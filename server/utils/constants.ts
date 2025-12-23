export const SERVER_CONSTANTS = {
  DEFAULT_PORT: 3001,
  MAX_TEXT_LENGTH: 50000,
  MAX_REQUEST_SIZE: '10mb',

  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 30
  },

  CACHE: {
    TTL: 3600, // 1 hour in seconds
    CHECK_PERIOD: 600 // 10 minutes in seconds
  },

  GEMINI: {
    DEFAULT_MODEL: 'gemini-2.5-flash',
    AVAILABLE_MODELS: ['gemini-3-flash-preview', 'gemini-2.5-flash'] as const,
    TEMPERATURE: 0.2
  },

  API_KEY: {
    MIN_LENGTH: 20
  }
} as const;

export const ERROR_MESSAGES = {
  NO_API_KEY: 'Server ist noch nicht konfiguriert. Bitte API Key einrichten.',
  INVALID_TEXT: 'Ungültiger Text',
  TEXT_TOO_LONG: `Text ist zu lang (max. ${SERVER_CONSTANTS.MAX_TEXT_LENGTH} Zeichen)`,
  INVALID_API_KEY_FORMAT: 'Ungültiges API Key Format',
  API_KEY_TEST_FAILED: 'API Key ist ungültig oder funktioniert nicht. Bitte überprüfe den Key.',
  CONFIG_SAVE_FAILED: 'Fehler beim Speichern der Konfiguration',
  PROCESSING_ERROR: 'Fehler bei der Verarbeitung. Bitte versuchen Sie es erneut.',
  RATE_LIMIT_EXCEEDED: 'Zu viele Anfragen von dieser IP. Bitte versuchen Sie es später erneut.',
  API_KEY_REQUIRED: 'API Key ist erforderlich'
} as const;
