export function formatCharacterCount(count: number): string {
  return count.toLocaleString('de-DE');
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
}

export function sanitizeText(text: string): string {
  return text.trim();
}
