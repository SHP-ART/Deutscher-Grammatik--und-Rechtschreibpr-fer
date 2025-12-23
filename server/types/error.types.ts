export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public code?: string
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

export class ApiKeyError extends AppError {
  constructor(message: string) {
    super(message, 503, 'API_KEY_ERROR');
  }
}

export class GeminiError extends AppError {
  constructor(message: string, statusCode: number = 500) {
    super(message, statusCode, 'GEMINI_ERROR');
  }
}

export class ConfigError extends AppError {
  constructor(message: string) {
    super(message, 500, 'CONFIG_ERROR');
  }
}
