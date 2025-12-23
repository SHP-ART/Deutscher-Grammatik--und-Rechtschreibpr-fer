export interface SuccessResponse<T = unknown> {
  success: true;
  data?: T;
  message?: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
  needsSetup?: boolean;
}

export function successResponse<T>(data?: T, message?: string): SuccessResponse<T> {
  return {
    success: true,
    ...(data !== undefined && { data }),
    ...(message && { message })
  };
}

export function errorResponse(error: string, code?: string, needsSetup?: boolean): ErrorResponse {
  return {
    success: false,
    error,
    ...(code && { code }),
    ...(needsSetup !== undefined && { needsSetup })
  };
}
