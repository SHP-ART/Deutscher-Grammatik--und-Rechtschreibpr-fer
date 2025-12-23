export const APP_CONSTANTS = {
  APP_NAME: 'Textassistent',
  APP_SUBTITLE: 'Powered by Google Gemini AI',
  MAX_TEXT_LENGTH: 50000,
  COPY_SUCCESS_DURATION: 2000,
  API_BASE_URL: import.meta.env.VITE_API_URL || ''
} as const;

export const UI_TEXT = {
  LOADING: 'Analysiere...',
  CHECKING: 'Prüfung läuft...',
  CHECK_GRAMMAR: 'Grammatik prüfen',
  COPY: 'Kopieren',
  COPIED: 'Kopiert!',
  INPUT_PLACEHOLDER: 'Schreiben Sie hier Ihren Text...',
  OUTPUT_PLACEHOLDER: 'Die Korrektur wird hier angezeigt...',
  ERROR_DEFAULT: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.'
} as const;

export const FORMAT_OPTIONS_LABELS = {
  TO_UPPERCASE: 'Ausgabe in GROSSBUCHSTABEN',
  AS_EMAIL: 'Als E-Mail formatieren',
  AS_INVOICE: 'Als KFZ-Werkstatt Rechnungstext',
  WITH_RESEARCH: 'Mit Google-Recherche und Quellenangaben'
} as const;

export const GEMINI_MODELS = [
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    description: 'Stabil und schnell (empfohlen)'
  },
  {
    id: 'gemini-3-flash-preview',
    name: 'Gemini 3 Flash',
    description: 'Neueste Version (Preview)'
  }
] as const;
