
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateImage = async (recipeName, ingredients) => {
  const prompt = `High-quality, vibrant, professional food photography of an Indian dish called "${recipeName}". The dish is made with ${ingredients}. The photo is styled for a modern, healthy recipe app, with a clean background and natural lighting.`;

  try {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '4:3',
        },
    });

    const base64ImageBytes = response.generatedImages[0].image.imageBytes;
    
    if (!base64ImageBytes) {
        throw new Error("No image data received from Gemini.");
    }

    return `data:image/jpeg;base64,${base64ImageBytes}`;

  } catch (error) {
    console.error("Error generating image with Gemini:", error);
    // Fallback to a placeholder on error
    return `https://picsum.photos/seed/${encodeURIComponent(recipeName)}/400/300`;
  }
};