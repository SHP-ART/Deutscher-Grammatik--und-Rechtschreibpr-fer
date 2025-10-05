
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY is not defined in environment variables");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function correctGrammar(text: string): Promise<string> {
  const model = 'gemini-2.5-flash';
  const prompt = `Korrigiere die Grammatik und Rechtschreibung des folgenden deutschen Textes. Gib nur den korrigierten Text zurück, ohne zusätzliche Erklärungen, Kommentare oder Formatierungen wie Markdown. Der Text ist: "${text}"`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        temperature: 0.2, // Lower temperature for more deterministic, corrective tasks
      }
    });

    const correctedText = response.text.trim();
    return correctedText;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get a response from the AI model.");
  }
}
