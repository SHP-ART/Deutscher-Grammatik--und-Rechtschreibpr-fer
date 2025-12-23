import { GoogleGenAI } from '@google/genai';

let geminiClient: GoogleGenAI | null = null;

export function initializeGeminiClient(apiKey: string): GoogleGenAI {
  geminiClient = new GoogleGenAI({ apiKey });
  return geminiClient;
}

export function getGeminiClient(): GoogleGenAI | null {
  return geminiClient;
}

export function hasGeminiClient(): boolean {
  return geminiClient !== null;
}

export function resetGeminiClient(): void {
  geminiClient = null;
}
