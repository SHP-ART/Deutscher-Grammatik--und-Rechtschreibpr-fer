import api from './api';
import type { SetupStatus, SetupConfigureRequest, SetupConfigureResponse } from '../types';

export async function checkSetupStatus(): Promise<SetupStatus> {
  return api.get<SetupStatus>('/api/setup/status');
}

export async function configureApiKey(apiKey: string): Promise<SetupConfigureResponse> {
  const request: SetupConfigureRequest = { apiKey };
  return api.post<SetupConfigureResponse>('/api/setup/configure', request);
}
