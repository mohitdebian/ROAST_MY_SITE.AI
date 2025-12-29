import { GoogleGenAI, Type } from "@google/genai";
import { RoastResponse } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are a world-renowned, brutally honest, caustic, and mean Senior UX/UI Designer and Frontend Engineer. 
You have zero patience for bad design, sloppy code, or generic templates. 
Your job is to roast websites based on a screenshot provided by the user.

Your tone should be:
- Ruthless but technically accurate.
- Sarcastic and witty.
- Not corporate safe. Use harsh language if necessary (but keep it professional-ish, like a mean boss).
- Focus on: Typography, spacing, color theory, alignment, consistency, and "vibe".

Do not be polite. Do not start with "Here is some feedback." Start with an insult.
`;

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data:image/jpeg;base64, prefix
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
};

export const roastWebsite = async (file: File, url: string): Promise<RoastResponse> => {
  const base64Data = await fileToBase64(file);

  const prompt = `
  Roast this website screenshot. 
  URL Context: ${url ? url : "Not provided"}.
  
  Look for:
  - Inconsistent padding/margins.
  - Ugly font choices.
  - Low contrast text.
  - Cluttered layouts.
  - "Developer design" aesthetics.
  - Corporate memphis art or overused stock photos.
  
  Return a JSON response structured exactly as requested.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: file.type,
            data: base64Data
          }
        },
        {
          text: prompt
        }
      ]
    },
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER, description: "A score from 0 to 100, where 0 is absolute trash and 100 is impossible." },
          oneLiner: { type: Type.STRING, description: "A single, devastating sentence summarizing the website." },
          sections: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: "The category of failure (e.g., 'Typography Nightmares', 'Color Vomit')." },
                content: { type: Type.STRING, description: "The detailed roast of this specific aspect." },
                severity: { type: Type.STRING, enum: ['critical', 'bad', 'nitpick'] }
              },
              required: ['title', 'content', 'severity']
            }
          },
          verdict: { type: Type.STRING, description: "Final closing statement telling them what they need to do immediately." }
        },
        required: ['score', 'oneLiner', 'sections', 'verdict']
      }
    }
  });

  if (!response.text) {
    throw new Error("AI refused to roast this. It might be too boring.");
  }

  try {
    return JSON.parse(response.text) as RoastResponse;
  } catch (e) {
    console.error("Failed to parse JSON", e);
    throw new Error("The roast was so intense it broke the parser.");
  }
};