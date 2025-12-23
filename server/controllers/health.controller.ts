import type { Request, Response } from 'express';
import { hasGeminiClient } from '../config/gemini.js';
import type { HealthCheckResponse } from '../types/index.js';

export async function getHealthStatus(
  req: Request,
  res: Response
): Promise<void> {
  const response: HealthCheckResponse = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    needsSetup: !hasGeminiClient()
  };

  res.json(response);
}
