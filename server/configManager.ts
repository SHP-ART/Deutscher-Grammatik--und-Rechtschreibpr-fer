import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Support both development (tsx) and production (compiled) modes
const isDist = __dirname.endsWith('dist');
const ENV_PATH = path.join(__dirname, isDist ? '../../.env' : '../.env');

export interface Config {
  GEMINI_API_KEY?: string;
  PORT?: string;
  NODE_ENV?: string;
}

// .env Datei lesen
export function readEnvFile(): Config {
  try {
    if (!fs.existsSync(ENV_PATH)) {
      return {};
    }

    const content = fs.readFileSync(ENV_PATH, 'utf-8');
    const config: Config = {};

    content.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        const value = valueParts.join('=').trim();
        if (key && value) {
          config[key as keyof Config] = value;
        }
      }
    });

    return config;
  } catch (error) {
    console.error('Error reading .env file:', error);
    return {};
  }
}

// .env Datei schreiben
export function writeEnvFile(config: Config): boolean {
  try {
    const lines: string[] = [
      '# Backend Server Configuration',
      `GEMINI_API_KEY=${config.GEMINI_API_KEY || ''}`,
      `PORT=${config.PORT || '3001'}`,
      `NODE_ENV=${config.NODE_ENV || 'production'}`,
      '',
      '# Frontend Configuration (Optional - für Entwicklung)',
      'VITE_API_URL=http://localhost:3001',
    ];

    fs.writeFileSync(ENV_PATH, lines.join('\n'), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing .env file:', error);
    return false;
  }
}

// API Key Status prüfen
export function hasApiKey(): boolean {
  const config = readEnvFile();
  return !!config.GEMINI_API_KEY && config.GEMINI_API_KEY.length > 10;
}

// API Key validieren (einfache Prüfung)
export function validateApiKey(apiKey: string): boolean {
  // Gemini API Keys haben normalerweise ein bestimmtes Format
  return apiKey.length > 20 && /^[A-Za-z0-9_-]+$/.test(apiKey);
}
