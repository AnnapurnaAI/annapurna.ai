export const generateNutritionPrompt = (mealText) => `
You are Annapurna.ai, an expert Indian food nutrition assistant.
Your task is to estimate the nutritional breakdown for the meal described by the user.
Respond ONLY with a valid JSON object. Do not include any text before or after the JSON.
The JSON should have a "foods" array and a "total" object.
Each item in the "foods" array should be an object with "name", "quantity", "calories", "protein", "carbs", and "fat".
Base your estimations on typical portion sizes for Indian cuisine.

Meal: "${mealText}"

Example Output:
{
  "foods": [
    {"name": "roti", "quantity": 2, "calories": 240, "protein": 6, "carbs": 40, "fat": 8},
    {"name": "dal", "quantity": 1, "calories": 180, "protein": 10, "carbs": 25, "fat": 6}
  ],
  "total": {"calories": 420, "protein": 16, "carbs": 65, "fat": 14}
}
`;

export const generateRecipePrompt = (dashboardData, userProfile) => {
  const locationContext = (userProfile.city && userProfile.country) 
    ? `The user is located in ${userProfile.city}, ${userProfile.country}. Suggest recipes and ingredients that are culturally relevant and easily available in this region.`
    : '';

  return `
You are Annapurna.ai, a personalized Indian diet planner.

User's current nutrient summary for the day:
Calories Consumed: ${Math.round(dashboardData.calories)} / ${userProfile.goals.calories} kcal
Protein Consumed: ${Math.round(dashboardData.protein)} / ${userProfile.goals.protein} g
Carbs Consumed: ${Math.round(dashboardData.carbs)} / ${userProfile.goals.carbs} g
Fat Consumed: ${Math.round(dashboardData.fat)} / ${userProfile.goals.fat} g
Dietary Preference: ${userProfile.preference}
${locationContext}

Your task is to generate 2 dinner recipes that help the user meet their remaining daily targets.
The recipes must adhere to the user's dietary preference.
For each recipe, provide:
- name: The name of the dish.
- description: A short, appealing description.
- nutrients: An object with per-serving calories, protein, carbs, and fat.
- portion_suggestion: A practical portion size suggestion (e.g., "1 bowl (approx. 250g)").
- ingredients: An array of strings with ingredients.
- instructions: An array of strings, with each string being a step-by-step cooking instruction.
- cooking_time: A string indicating the estimated total cooking time (e.g., "Approx. 25 minutes").

Respond ONLY with a valid JSON array containing the two recipe objects. Do not include any text before or after the JSON.

Example output:
[
  {
    "name": "Paneer Bhurji with 2 Rotis",
    "description": "A quick and protein-rich scrambled cottage cheese dish, perfect for a light yet satisfying dinner.",
    "nutrients": {"calories": 450, "protein": 25, "carbs": 35, "fat": 22},
    "portion_suggestion": "1 serving (approx. 300g)",
    "ingredients": ["200g Paneer", "2 medium Rotis", "1 Onion", "1 Tomato", "Ginger-garlic paste", "Spices (turmeric, garam masala)"],
    "instructions": [
      "Heat oil in a pan and saute the onions until golden.",
      "Add tomatoes and ginger-garlic paste, and cook until soft.",
      "Crumble the paneer and add it to the pan along with spices.",
      "Cook for 5-7 minutes, stirring occasionally.",
      "Serve hot with rotis."
    ],
    "cooking_time": "Approx. 20 minutes"
  }
]
`;
};