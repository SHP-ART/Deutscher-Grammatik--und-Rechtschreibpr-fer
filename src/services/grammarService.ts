import api from './api';
import type { FormatOptions, GrammarCheckRequest, GrammarCheckResponse } from '../types';

export async function correctGrammar(
  text: string,
  options?: FormatOptions
): Promise<string> {
  const request: GrammarCheckRequest = {
    text,
    formatOptions: options || {}
  };

  const response = await api.post<GrammarCheckResponse>('/api/check-grammar', request);
  return response.correctedText;
}
