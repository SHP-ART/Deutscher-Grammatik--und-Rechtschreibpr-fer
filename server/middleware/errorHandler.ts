import type { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError, ApiKeyError, GeminiError } from '../types/error.types.js';
import { errorResponse } from '../utils/response.util.js';

export function errorHandler(
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('Error occurred:', error);

  if (error instanceof AppError) {
    res.status(error.statusCode).json(
      errorResponse(error.message, error.code, error instanceof ApiKeyError)
    );
    return;
  }

  res.status(500).json(
    errorResponse('Ein unerwarteter Fehler ist aufgetreten', 'INTERNAL_SERVER_ERROR')
  );
}

export default errorHandler;
