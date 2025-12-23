import { getCache } from '../config/cache.js';
import { generateCacheKey } from '../utils/cache-key.util.js';
import type { FormatOptions } from '../types/index.js';
import type NodeCache from 'node-cache';

export function getCachedResult(text: string, formatOptions?: FormatOptions): string | undefined {
  const cache = getCache();
  const cacheKey = generateCacheKey(text, formatOptions);
  return cache.get<string>(cacheKey);
}

export function setCachedResult(text: string, result: string, formatOptions?: FormatOptions): void {
  const cache = getCache();
  const cacheKey = generateCacheKey(text, formatOptions);
  cache.set(cacheKey, result);
}

export function getCacheStats(): NodeCache.Stats {
  const cache = getCache();
  return cache.getStats();
}

export function clearCache(): void {
  const cache = getCache();
  cache.flushAll();
}
