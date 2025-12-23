export interface Config {
  GEMINI_API_KEY?: string;
  PORT?: string;
  NODE_ENV?: string;
}

export interface EnvConfig {
  apiKey: string | undefined;
  port: number;
  nodeEnv: 'development' | 'production' | 'test';
}

export interface SetupStatusResponse {
  configured: boolean;
  needsSetup: boolean;
}

export interface SetupConfigureRequest {
  apiKey: string;
}

export interface SetupConfigureResponse {
  success: boolean;
  message: string;
}

export interface HealthCheckResponse {
  status: string;
  timestamp: string;
  needsSetup: boolean;
}
