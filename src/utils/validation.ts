export const VALIDATION_RULES = {
  MAX_TEXT_LENGTH: 50000,
  MIN_API_KEY_LENGTH: 20
} as const;

export function validateTextInput(text: string): { valid: boolean; error?: string } {
  if (!text || text.trim().length === 0) {
    return { valid: false, error: 'Bitte geben Sie einen Text ein.' };
  }

  if (text.length > VALIDATION_RULES.MAX_TEXT_LENGTH) {
    return {
      valid: false,
      error: `Text ist zu lang (max. ${VALIDATION_RULES.MAX_TEXT_LENGTH.toLocaleString()} Zeichen)`
    };
  }

  return { valid: true };
}

export function validateApiKey(apiKey: string): { valid: boolean; error?: string } {
  if (!apiKey || apiKey.trim().length === 0) {
    return { valid: false, error: 'API Key ist erforderlich' };
  }

  if (apiKey.length < VALIDATION_RULES.MIN_API_KEY_LENGTH) {
    return { valid: false, error: 'API Key ist zu kurz' };
  }

  return { valid: true };
}
