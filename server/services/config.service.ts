import fs from 'fs';
import { getProjectRoot, getEnvPath } from '../utils/path.util.js';
import type { Config } from '../types/index.js';
import { SERVER_CONSTANTS } from '../utils/constants.js';
import { GoogleGenAI } from '@google/genai';
import { GeminiError } from '../types/error.types.js';

export function readEnvFile(importMetaUrl: string): Config {
  try {
    const { __dirname } = getProjectRoot(importMetaUrl);
    const envPath = getEnvPath(__dirname);

    if (!fs.existsSync(envPath)) {
      return {};
    }

    const content = fs.readFileSync(envPath, 'utf-8');
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

export function writeEnvFile(config: Config, importMetaUrl: string): boolean {
  try {
    const { __dirname } = getProjectRoot(importMetaUrl);
    const envPath = getEnvPath(__dirname);

    const lines: string[] = [
      '# Backend Server Configuration',
      `GEMINI_API_KEY=${config.GEMINI_API_KEY || ''}`,
      `PORT=${config.PORT || SERVER_CONSTANTS.DEFAULT_PORT}`,
      `NODE_ENV=${config.NODE_ENV || 'production'}`,
      '',
      '# Frontend Configuration (Optional - für Entwicklung)',
      'VITE_API_URL=http://localhost:3001',
    ];

    fs.writeFileSync(envPath, lines.join('\n'), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing .env file:', error);
    return false;
  }
}

export function hasApiKey(importMetaUrl: string): boolean {
  const config = readEnvFile(importMetaUrl);
  return !!config.GEMINI_API_KEY && config.GEMINI_API_KEY.length > 10;
}

export function validateApiKeyFormat(apiKey: string): boolean {
  return apiKey.length > SERVER_CONSTANTS.API_KEY.MIN_LENGTH && /^[A-Za-z0-9_-]+$/.test(apiKey);
}

export async function testApiKey(apiKey: string): Promise<void> {
  try {
    const testAi = new GoogleGenAI({ apiKey });
    await testAi.models.generateContent({
      model: SERVER_CONSTANTS.GEMINI.DEFAULT_MODEL,
      contents: 'Test',
      config: { temperature: SERVER_CONSTANTS.GEMINI.TEMPERATURE }
    });
  } catch (error) {
    throw new GeminiError('API Key ist ungültig oder funktioniert nicht', 400);
  }
}
