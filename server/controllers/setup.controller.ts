import type { Request, Response, NextFunction } from 'express';
import { hasGeminiClient, initializeGeminiClient } from '../config/gemini.js';
import { validateApiKeyFormat, testApiKey, writeEnvFile, readEnvFile } from '../services/config.service.js';
import { ValidationError } from '../types/error.types.js';
import { ERROR_MESSAGES } from '../utils/constants.js';
import type { SetupStatusResponse, SetupConfigureResponse, SetupConfigureRequest } from '../types/index.js';

export async function getSetupStatus(
  req: Request,
  res: Response
): Promise<void> {
  const response: SetupStatusResponse = {
    configured: hasGeminiClient(),
    needsSetup: !hasGeminiClient()
  };

  res.json(response);
}

export async function configureSetup(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { apiKey } = req.body as SetupConfigureRequest;

    if (!validateApiKeyFormat(apiKey)) {
      throw new ValidationError(ERROR_MESSAGES.INVALID_API_KEY_FORMAT);
    }

    await testApiKey(apiKey);

    const config = readEnvFile(import.meta.url);
    config.GEMINI_API_KEY = apiKey;
    config.PORT = config.PORT || '3001';
    config.NODE_ENV = config.NODE_ENV || 'production';

    const success = writeEnvFile(config, import.meta.url);

    if (!success) {
      throw new ValidationError(ERROR_MESSAGES.CONFIG_SAVE_FAILED);
    }

    process.env.GEMINI_API_KEY = apiKey;
    initializeGeminiClient(apiKey);

    const response: SetupConfigureResponse = {
      success: true,
      message: 'API Key wurde erfolgreich gespeichert und getestet!'
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
}
