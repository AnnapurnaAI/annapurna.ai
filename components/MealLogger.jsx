import React, { useState, useCallback } from 'react';
import { useUser } from '../contexts/UserContext.jsx';
import { analyzeMeal } from '../services/geminiService.js';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition.js';
import { Utensils, Mic, Send, Loader2, PlusCircle } from 'lucide-react';
import MealCard from './MealCard.jsx';

const QUICK_ADD_FOODS = ["1 Roti", "1 bowl Dal", "1 bowl Rice", "Paneer Sabji", "Mixed Veggies"];

const MealLogger = () => {
  const [textInput, setTextInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { addMeal, mealLog } = useUser();

  const { isListening, transcript, startListening, stopListening } = useSpeechRecognition({
    onResult: (result) => {
      setTextInput(result);
    }
  });

  const handleLogMeal = useCallback(async (mealText) => {
    if (!mealText.trim()) return;

    setIsLoading(true);
    setError('');
    try {
      const nutritionData = await analyzeMeal(mealText);
      addMeal(nutritionData);
      setTextInput('');
    } catch (err) {
      console.error("Failed to log meal:", err);
      setError("Sorry, I couldn't analyze that meal. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [addMeal]);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogMeal(textInput);
  };

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      setTextInput('');
      startListening();
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-md flex-shrink-0">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-slate-200 flex items-center mb-4">
          <Utensils className="w-6 h-6 mr-2 text-primary" />
          Log Your Meal
        </h2>
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="text"
            value={isListening ? 'Listening...' : textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="e.g., '2 rotis and a bowl of dal makhani'"
            className="w-full pl-4 pr-24 py-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-full focus:ring-2 focus:ring-primary focus:border-transparent transition"
            disabled={isLoading || isListening}
          />
          <div className="absolute right-2 flex items-center space-x-1">
            <button
              type="button"
              onClick={handleMicClick}
              className={`p-2 rounded-full transition ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 dark:bg-slate-600 hover:bg-gray-200 dark:hover:bg-slate-500'}`}
              disabled={isLoading}
            >
              <Mic className="w-5 h-5" />
            </button>
            <button
              type="submit"
              className="p-2 bg-primary text-white rounded-full hover:bg-green-700 disabled:bg-gray-400 transition"
              disabled={isLoading || !textInput.trim()}
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
        </form>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <div className="mt-4 flex flex-wrap gap-2">
            {QUICK_ADD_FOODS.map(food => (
                <button key={food} onClick={() => handleLogMeal(food)}
                className="flex items-center text-sm bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 px-3 py-1 rounded-full hover:bg-green-200 dark:hover:bg-green-900/80 transition disabled:opacity-50"
                disabled={isLoading}>
                    <PlusCircle className="w-4 h-4 mr-1"/>
                    {food}
                </button>
            ))}
        </div>
      </div>

      {mealLog.length > 0 && (
        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-md flex-grow overflow-hidden flex flex-col mt-6">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-slate-200 mb-3 flex-shrink-0">Today's Log</h3>
            <div className="space-y-3 pr-2 overflow-y-auto flex-grow">
                {mealLog.map((meal) => (
                    <MealCard key={meal.id} meal={meal} />
                ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default MealLogger;