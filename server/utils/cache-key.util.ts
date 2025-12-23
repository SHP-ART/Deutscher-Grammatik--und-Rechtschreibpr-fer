import crypto from 'crypto';
import type { FormatOptions } from '../types/index.js';

export function generateCacheKey(text: string, formatOptions?: FormatOptions): string {
  const optionsString = formatOptions ? JSON.stringify(formatOptions) : '';
  const combinedString = text.toLowerCase().trim() + optionsString;
  return crypto.createHash('sha256').update(combinedString).digest('hex');
}
