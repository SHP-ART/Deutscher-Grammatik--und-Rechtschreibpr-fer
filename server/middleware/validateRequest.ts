import type { Request, Response, NextFunction } from 'express';
import { validateGrammarCheckRequest, validateSetupConfigureRequest } from '../services/validation.service.js';

export function validateGrammarRequest(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    req.body = validateGrammarCheckRequest(req.body);
    next();
  } catch (error) {
    next(error);
  }
}

export function validateSetupRequest(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    req.body = validateSetupConfigureRequest(req.body);
    next();
  } catch (error) {
    next(error);
  }
}
