import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import NodeCache from 'node-cache';
import { GoogleGenAI } from '@google/genai';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import { readEnvFile, writeEnvFile, hasApiKey, validateApiKey } from './configManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root
// Support both development (tsx) and production (compiled) modes
const isDist = __dirname.endsWith('dist');
const envPath = path.join(__dirname, isDist ? '../../.env' : '../.env');
console.log('Loading .env from:', envPath);
const result = dotenv.config({ path: envPath });
if (result.error) {
  console.error('Error loading .env:', result.error);
} else {
  console.log('Loaded env vars:', Object.keys(result.parsed || {}).join(', '));
}

const app = express();
const PORT = process.env.PORT || 3001;
let API_KEY = process.env.GEMINI_API_KEY;
const NODE_ENV = process.env.NODE_ENV || 'development';

console.log('API_KEY loaded:', API_KEY ? 'Yes (' + API_KEY.substring(0, 10) + '...)' : 'No');

// Check if API key exists, if not we'll show setup page
const needsSetup = !API_KEY;

// Initialize Gemini AI (only if API key exists)
let ai: GoogleGenAI | null = null;
if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
}

// Cache setup - 1 Stunde TTL, Check alle 10 Minuten
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

// Middleware
// CORS muss vor anderen Middleware kommen
app.use(cors({
  origin: NODE_ENV === 'production' ? false : ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));

app.use(helmet({
  contentSecurityPolicy: false // CSP deaktiviert, da es in Production Probleme mit SPA verursacht
}));

// Serve static files in production
if (NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../../dist');
  app.use(express.static(frontendPath));
}

// Rate Limiting - 30 Anfragen pro 15 Minuten pro IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: 'Zu viele Anfragen von dieser IP. Bitte versuchen Sie es später erneut.' },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: 'Zu viele Anfragen von dieser IP. Bitte versuchen Sie es später erneut.'
    });
  }
});

app.use('/api/', limiter);

// Cache-Key-Generator (Hash des Textes)
function generateCacheKey(text: string): string {
  return crypto.createHash('sha256').update(text.toLowerCase().trim()).digest('hex');
}

// Health Check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    needsSetup: !API_KEY
  });
});

// Setup API - API Key Status prüfen
app.get('/api/setup/status', (req: Request, res: Response) => {
  res.json({
    configured: !!API_KEY,
    needsSetup: !API_KEY
  });
});

// Setup API - API Key speichern
app.post('/api/setup/configure', async (req: Request, res: Response) => {
  try {
    const { apiKey } = req.body;

    if (!apiKey || typeof apiKey !== 'string') {
      return res.status(400).json({ error: 'API Key ist erforderlich' });
    }

    // Validierung
    if (!validateApiKey(apiKey)) {
      return res.status(400).json({ error: 'Ungültiges API Key Format' });
    }

    // API Key testen
    try {
      const testAi = new GoogleGenAI({ apiKey });
      await testAi.models.generateContent({
        model: 'gemini-2.0-flash-exp',
        contents: 'Test',
        config: { temperature: 0.2 }
      });
    } catch (error) {
      return res.status(400).json({
        error: 'API Key ist ungültig oder funktioniert nicht. Bitte überprüfe den Key.'
      });
    }

    // In .env speichern
    const config = readEnvFile();
    config.GEMINI_API_KEY = apiKey;
    config.PORT = config.PORT || '3001';
    config.NODE_ENV = config.NODE_ENV || 'production';

    const success = writeEnvFile(config);

    if (!success) {
      return res.status(500).json({ error: 'Fehler beim Speichern der Konfiguration' });
    }

    // Globale Variable aktualisieren
    API_KEY = apiKey;
    ai = new GoogleGenAI({ apiKey });

    res.json({
      success: true,
      message: 'API Key wurde erfolgreich gespeichert und getestet!'
    });
  } catch (error) {
    console.error('Error configuring API key:', error);
    res.status(500).json({ error: 'Fehler beim Konfigurieren des API Keys' });
  }
});

// Grammar Check Endpoint
app.post('/api/check-grammar', async (req: Request, res: Response) => {
  try {
    // Prüfe ob API Key konfiguriert ist
    if (!ai || !API_KEY) {
      return res.status(503).json({
        error: 'Server ist noch nicht konfiguriert. Bitte API Key einrichten.',
        needsSetup: true
      });
    }

    const { text, formatOptions } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Ungültiger Text' });
    }

    if (text.length > 50000) {
      return res.status(400).json({ error: 'Text ist zu lang (max. 50.000 Zeichen)' });
    }

    // Cache prüfen (inkl. Format-Optionen im Cache-Key)
    const cacheKey = generateCacheKey(text + JSON.stringify(formatOptions || {}));
    const cachedResult = cache.get<string>(cacheKey);

    if (cachedResult) {
      console.log('Cache hit for request');
      return res.json({ correctedText: cachedResult, cached: true });
    }

    // Gemini API aufrufen
    const model = 'gemini-2.0-flash-exp';
    let prompt = '';

    // Recherche-Modus: Verwende Google Search für aktuelle Informationen
    if (formatOptions?.withResearch) {
      prompt = `Beantworte die folgende Frage mit aktuellen Informationen aus dem Internet. Gib eine ausführliche Antwort mit Quellenangaben. Frage: "${text}"`;
    } else {
      // Standard-Grammatikkorrektur
      prompt = `Korrigiere die Grammatik und Rechtschreibung des folgenden deutschen Textes. Gib nur den korrigierten Text zurück, ohne zusätzliche Erklärungen, Kommentare oder Formatierungen wie Markdown.`;

      // Formatierungs-Anweisungen hinzufügen
      if (formatOptions?.asEmail) {
        prompt += ` Formatiere den Text als professionelle E-Mail mit Anrede, Haupttext und Grußformel. Verwende eine höfliche und professionelle Sprache.`;
      } else if (formatOptions?.asInvoice) {
        prompt += ` Formatiere den Text als kurzen Rechnungstext für eine KFZ-Werkstatt. Der Text soll als Hinweis oder Erklärung auf einer Rechnung verwendet werden können. Verwende eine klare, sachliche und kundenfreundliche Sprache.`;
      }

      prompt += ` Der Text ist: "${text}"`;
    }

    // API-Konfiguration mit optionalem Google Search Grounding
    const apiConfig: any = {
      model: model,
      contents: prompt,
      config: {
        temperature: 0.2,
      }
    };

    // Google Search Grounding nur bei Recherche aktivieren
    if (formatOptions?.withResearch) {
      apiConfig.config.tools = [{
        googleSearch: {}
      }];
    }

    const response = await ai.models.generateContent(apiConfig);

    let correctedText = response.text?.trim() || '';

    // Wenn Recherche aktiviert ist, füge Quellenangaben hinzu
    if (formatOptions?.withResearch) {
      const responseData = response as any;

      if (responseData.groundingMetadata) {
        const sources = responseData.groundingMetadata.searchEntryPoint?.renderedContent ||
                        responseData.groundingMetadata.groundingChunks || [];

        if (sources && sources.length > 0) {
          correctedText += '\n\n--- Quellen ---\n';

          // Extrahiere URLs aus den Grounding-Metadaten
          if (responseData.groundingMetadata.groundingSupports) {
            responseData.groundingMetadata.groundingSupports.forEach((support: any, index: number) => {
              if (support.groundingChunkIndices) {
                support.groundingChunkIndices.forEach((chunkIndex: number) => {
                  const chunk = responseData.groundingMetadata.groundingChunks?.[chunkIndex];
                  if (chunk?.web?.uri) {
                    correctedText += `\n[${index + 1}] ${chunk.web.uri}`;
                    if (chunk.web.title) {
                      correctedText += ` - ${chunk.web.title}`;
                    }
                  }
                });
              }
            });
          }
        }
      }
    }

    // In Cache speichern
    cache.set(cacheKey, correctedText);

    res.json({ correctedText, cached: false });
  } catch (error) {
    console.error('Error processing grammar check:', error);
    res.status(500).json({ error: 'Fehler bei der Verarbeitung. Bitte versuchen Sie es erneut.' });
  }
});

// Cache-Statistiken (optional für Monitoring)
app.get('/api/cache-stats', (req: Request, res: Response) => {
  const stats = cache.getStats();
  res.json(stats);
});

// In Production: Alle anderen Routen zum Frontend SPA weiterleiten
if (NODE_ENV === 'production') {
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../../dist/index.html'));
  });
}

// Server starten
app.listen(PORT, () => {
  console.log(`🚀 Server läuft auf Port ${PORT}`);
  console.log(`📊 Cache aktiviert mit 1 Stunde TTL`);
  console.log(`🔒 Rate Limiting: 30 Anfragen pro 15 Minuten`);
  console.log(`🌍 Environment: ${NODE_ENV}`);
});
