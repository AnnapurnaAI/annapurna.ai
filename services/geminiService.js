
import { GoogleGenAI } from "@google/genai";
import { generateNutritionPrompt, generateRecipePrompt } from '../lib/prompts.js';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const parseJsonResponse = (text) => {
    // Gemini sometimes wraps the JSON in ```json ... ```, so we need to clean it.
    const cleanedText = text.replace(/^```json\s*/, '').replace(/```$/, '');
    try {
        return JSON.parse(cleanedText);
    } catch (error) {
        console.error("Failed to parse JSON from Gemini:", cleanedText);
        throw new Error("Received an invalid format from the AI.");
    }
};

export const analyzeMeal = async (mealText) => {
    const prompt = generateNutritionPrompt(mealText);
    const model = 'gemini-2.5-flash';

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });
        return parseJsonResponse(response.text);
    } catch (error) {
        console.error("Error analyzing meal with Gemini:", error);
        throw error;
    }
};

export const generateRecipes = async (dashboardData, userProfile) => {
    const prompt = generateRecipePrompt(dashboardData, userProfile);
    const model = 'gemini-2.5-flash';

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
             config: {
                responseMimeType: "application/json",
            }
        });
        
        return parseJsonResponse(response.text);
    } catch (error) {
        console.error("Error generating recipes with Gemini:", error);
        throw error;
    }
};