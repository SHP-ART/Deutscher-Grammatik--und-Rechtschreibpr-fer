import type { Request, Response, NextFunction } from 'express';
import { checkGrammar } from '../services/gemini.service.js';
import { getCachedResult, setCachedResult } from '../services/cache.service.js';
import type { GrammarCheckRequest, GrammarCheckResponse } from '../types/index.js';

export async function checkGrammarRequest(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { text, formatOptions } = req.body as GrammarCheckRequest;

    const cachedResult = getCachedResult(text, formatOptions);

    if (cachedResult) {
      console.log('Cache hit for request');
      const response: GrammarCheckResponse = {
        correctedText: cachedResult,
        cached: true
      };
      res.json(response);
      return;
    }

    const correctedText = await checkGrammar(text, formatOptions);

    setCachedResult(text, correctedText, formatOptions);

    const response: GrammarCheckResponse = {
      correctedText,
      cached: false
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
}
