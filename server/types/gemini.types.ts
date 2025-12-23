export interface FormatOptions {
  asEmail?: boolean;
  asInvoice?: boolean;
  withResearch?: boolean;
  modelName?: string;
}

export interface GrammarCheckRequest {
  text: string;
  formatOptions?: FormatOptions;
}

export interface GrammarCheckResponse {
  correctedText: string;
  cached: boolean;
}

export interface GeminiApiConfig {
  model: string;
  contents: string;
  config: {
    temperature: number;
    tools?: Array<{ googleSearch: Record<string, never> }>;
  };
}

export interface GroundingMetadata {
  groundingChunks?: Array<{
    web?: {
      uri?: string;
      title?: string;
    };
  }>;
  groundingSupports?: Array<{
    groundingChunkIndices?: number[];
  }>;
}
