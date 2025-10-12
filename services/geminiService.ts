const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001';

export async function correctGrammar(text: string): Promise<string> {
  try {
    const response = await fetch(`${API_URL}/api/check-grammar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
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
