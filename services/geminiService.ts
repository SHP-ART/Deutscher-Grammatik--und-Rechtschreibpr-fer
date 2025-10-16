// In production, use relative URL (same origin). In development, use localhost:3001
const API_URL = (import.meta as any).env?.VITE_API_URL || '';

export interface FormatOptions {
  asEmail?: boolean;
  asInvoice?: boolean;
}

export async function correctGrammar(text: string, options?: FormatOptions): Promise<string> {
  try {
    const response = await fetch(`${API_URL}/api/check-grammar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        formatOptions: options || {}
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Fehler bei der Anfrage');
    }

    const data = await response.json();
    return data.correctedText;
  } catch (error) {
    console.error('Error calling grammar check API:', error);
    throw new Error('Die Verbindung zum Server ist fehlgeschlagen. Bitte versuchen Sie es erneut.');
  }
}
