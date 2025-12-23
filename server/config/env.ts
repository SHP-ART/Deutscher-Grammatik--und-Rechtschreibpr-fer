import dotenv from 'dotenv';
import { getProjectRoot, getEnvPath } from '../utils/path.util.js';
import type { EnvConfig } from '../types/index.js';
import { SERVER_CONSTANTS } from '../utils/constants.js';

let envLoaded = false;

export function loadEnv(importMetaUrl?: string): void {
  if (envLoaded) return;

  const currentDir = importMetaUrl ? getProjectRoot(importMetaUrl).__dirname : process.cwd();
  const envPath = getEnvPath(currentDir);

  console.log('Loading .env from:', envPath);

  const result = dotenv.config({ path: envPath });

  if (result.error) {
    console.error('Error loading .env:', result.error);
  } else {
    console.log('Loaded env vars:', Object.keys(result.parsed || {}).join(', '));
  }

  envLoaded = true;
}

export function getEnvConfig(): EnvConfig {
  const apiKey = process.env.GEMINI_API_KEY;
  const port = parseInt(process.env.PORT || String(SERVER_CONSTANTS.DEFAULT_PORT), 10);
  const nodeEnv = (process.env.NODE_ENV || 'development') as EnvConfig['nodeEnv'];

  if (apiKey) {
    console.log('API_KEY loaded:', `Yes (${apiKey.substring(0, 10)}...)`);
  } else {
    console.log('API_KEY loaded: No');
  }

  return {
    apiKey,
    port,
    nodeEnv
  };
}
