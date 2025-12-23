export interface SetupStatus {
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
