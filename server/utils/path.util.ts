import path from 'path';
import { fileURLToPath } from 'url';

export function getProjectRoot(importMetaUrl: string): { __filename: string; __dirname: string } {
  const __filename = fileURLToPath(importMetaUrl);
  const __dirname = path.dirname(__filename);
  return { __filename, __dirname };
}

export function getEnvPath(currentDir: string): string {
  const isDist = currentDir.endsWith('dist');
  return path.join(currentDir, isDist ? '../../.env' : '../.env');
}

export function getFrontendPath(currentDir: string): string {
  return path.join(currentDir, '../../dist');
}
