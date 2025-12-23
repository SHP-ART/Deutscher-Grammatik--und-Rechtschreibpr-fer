import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { SERVER_CONSTANTS, ERROR_MESSAGES } from '../utils/constants.js';
import type { Request, Response } from 'express';

export function getCorsOptions(nodeEnv: string) {
  return cors({
    origin: nodeEnv === 'production'
      ? false
      : ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  });
}

export function getHelmetOptions() {
  return helmet({
    contentSecurityPolicy: false
  });
}

export function getRateLimiter(nodeEnv: string) {
  return rateLimit({
    windowMs: SERVER_CONSTANTS.RATE_LIMIT.WINDOW_MS,
    max: SERVER_CONSTANTS.RATE_LIMIT.MAX_REQUESTS,
    message: { error: ERROR_MESSAGES.RATE_LIMIT_EXCEEDED },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => nodeEnv === 'development',
    handler: (req: Request, res: Response) => {
      res.status(429).json({
        error: ERROR_MESSAGES.RATE_LIMIT_EXCEEDED
      });
    }
  });
}
