import { getGeminiClient } from '../config/gemini.js';
import { SERVER_CONSTANTS } from '../utils/constants.js';
import { GeminiError, ApiKeyError } from '../types/error.types.js';
import type { FormatOptions, GeminiApiConfig, GroundingMetadata } from '../types/index.js';

function buildPrompt(text: string, formatOptions?: FormatOptions): string {
  if (formatOptions?.withResearch) {
    return `Beantworte die folgende Frage mit aktuellen Informationen aus dem Internet. Gib eine ausführliche Antwort mit Quellenangaben. Frage: "${text}"`;
  }

  let prompt = 'Korrigiere die Grammatik und Rechtschreibung des folgenden deutschen Textes. Gib nur den korrigierten Text zurück, ohne zusätzliche Erklärungen, Kommentare oder Formatierungen wie Markdown.';

  if (formatOptions?.asEmail) {
    prompt += ' Formatiere den Text als professionelle E-Mail mit Anrede, Haupttext und Grußformel. Verwende eine höfliche und professionelle Sprache.';
  } else if (formatOptions?.asInvoice) {
    prompt += ' Formuliere den Text als professionellen Rechnungstext für eine KFZ-Werkstatt. Der Text soll präzise und verständlich die durchgeführten Arbeiten, Reparaturen oder Serviceleistungen beschreiben. Verwende Fachbegriffe korrekt, aber erkläre diese kundenfreundlich. Der Text muss sachlich, transparent und nachvollziehbar sein, damit der Kunde genau versteht, welche Leistungen erbracht wurden. Vermeide umgangssprachliche Formulierungen und achte auf eine klare, strukturierte Darstellung.';
  }

  prompt += ` Der Text ist: "${text}"`;

  return prompt;
}

function buildApiConfig(prompt: string, formatOptions?: FormatOptions): GeminiApiConfig {
  const config: GeminiApiConfig = {
    model: SERVER_CONSTANTS.GEMINI.MODEL,
    contents: prompt,
    config: {
      temperature: SERVER_CONSTANTS.GEMINI.TEMPERATURE
    }
  };

  if (formatOptions?.withResearch) {
    config.config.tools = [{
      googleSearch: {}
    }];
  }

  return config;
}

function extractGroundingSources(responseData: any): string {
  let sources = '';

  if (responseData.groundingMetadata) {
    const metadata = responseData.groundingMetadata as GroundingMetadata;

    if (metadata.groundingSupports) {
      sources += '\n\n--- Quellen ---\n';

      metadata.groundingSupports.forEach((support, index) => {
        if (support.groundingChunkIndices) {
          support.groundingChunkIndices.forEach((chunkIndex) => {
            const chunk = metadata.groundingChunks?.[chunkIndex];
            if (chunk?.web?.uri) {
              sources += `\n[${index + 1}] ${chunk.web.uri}`;
              if (chunk.web.title) {
                sources += ` - ${chunk.web.title}`;
              }
            }
          });
        }
      });
    }
  }

  return sources;
}

export async function checkGrammar(
  text: string,
  formatOptions?: FormatOptions
): Promise<string> {
  const geminiClient = getGeminiClient();

  if (!geminiClient) {
    throw new ApiKeyError('Gemini client is not initialized');
  }

  try {
    const prompt = buildPrompt(text, formatOptions);

    // Use model from formatOptions or default
    const modelName = formatOptions?.modelName || SERVER_CONSTANTS.GEMINI.DEFAULT_MODEL;

    const requestConfig: any = {
      model: modelName,
      contents: prompt,
      config: {
        temperature: SERVER_CONSTANTS.GEMINI.TEMPERATURE
      }
    };

    if (formatOptions?.withResearch) {
      requestConfig.config.tools = [{
        googleSearch: {}
      }];
    }

    const response = await geminiClient.models.generateContent(requestConfig);

    let correctedText = response.text?.trim() || '';

    if (formatOptions?.withResearch) {
      const sources = extractGroundingSources(response as any);
      correctedText += sources;
    }

    return correctedText;
  } catch (error: any) {
    console.error('Gemini API error:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));

    if (error.message?.includes('API key')) {
      throw new GeminiError('API key ist ungültig', 400);
    }

    throw new GeminiError('Fehler bei der Gemini API Kommunikation', 500);
  }
}
