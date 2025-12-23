import type { Request, Response } from 'express';
import { getCacheStats } from '../services/cache.service.js';

export async function getCacheStatistics(
  req: Request,
  res: Response
): Promise<void> {
  const stats = getCacheStats();
  res.json(stats);
}
