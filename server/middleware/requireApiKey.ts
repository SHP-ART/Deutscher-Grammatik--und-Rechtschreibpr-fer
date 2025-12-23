import type { Request, Response, NextFunction } from 'express';
import { hasGeminiClient } from '../config/gemini.js';
import { ApiKeyError } from '../types/error.types.js';
import { ERROR_MESSAGES } from '../utils/constants.js';

export function requireApiKey(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!hasGeminiClient()) {
    next(new ApiKeyError(ERROR_MESSAGES.NO_API_KEY));
    return;
  }

  next();
}

export default requireApiKey;
