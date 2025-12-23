import { ValidationError } from '../types/error.types.js';
import { SERVER_CONSTANTS, ERROR_MESSAGES } from '../utils/constants.js';
import type { GrammarCheckRequest, SetupConfigureRequest } from '../types/index.js';

export function validateGrammarCheckRequest(data: any): GrammarCheckRequest {
  if (!data || typeof data !== 'object') {
    throw new ValidationError('Invalid request body');
  }

  const { text, formatOptions } = data;

  if (!text || typeof text !== 'string') {
    throw new ValidationError(ERROR_MESSAGES.INVALID_TEXT);
  }

  if (text.length > SERVER_CONSTANTS.MAX_TEXT_LENGTH) {
    throw new ValidationError(ERROR_MESSAGES.TEXT_TOO_LONG);
  }

  return {
    text,
    formatOptions: formatOptions || {}
  };
}

export function validateSetupConfigureRequest(data: any): SetupConfigureRequest {
  if (!data || typeof data !== 'object') {
    throw new ValidationError('Invalid request body');
  }

  const { apiKey } = data;

  if (!apiKey || typeof apiKey !== 'string') {
    throw new ValidationError(ERROR_MESSAGES.API_KEY_REQUIRED);
  }

  return { apiKey };
}

export function validateText(text: unknown): string {
  if (!text || typeof text !== 'string') {
    throw new ValidationError(ERROR_MESSAGES.INVALID_TEXT);
  }

  if (text.trim().length === 0) {
    throw new ValidationError('Text darf nicht leer sein');
  }

  if (text.length > SERVER_CONSTANTS.MAX_TEXT_LENGTH) {
    throw new ValidationError(ERROR_MESSAGES.TEXT_TOO_LONG);
  }

  return text;
}
