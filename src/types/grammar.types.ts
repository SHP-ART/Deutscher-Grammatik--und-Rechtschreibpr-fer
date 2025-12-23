export interface FormatOptions {
  asEmail?: boolean;
  asInvoice?: boolean;
  withResearch?: boolean;
  modelName?: string;
}

export interface GeminiModel {
  id: string;
  name: string;
  description: string;
}

export interface GrammarCheckRequest {
  text: string;
  formatOptions?: FormatOptions;
}

export interface GrammarCheckResponse {
  correctedText: string;
  cached: boolean;
}
