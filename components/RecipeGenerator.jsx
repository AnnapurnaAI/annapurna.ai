import React, { useState, useCallback, useEffect } from 'react';
import { useUser } from '../contexts/UserContext.jsx';
import { generateRecipes } from '../services/geminiService.js';
import { generateImage } from '../services/imageService.js';
import Card from './shared/Card.jsx';
import Modal from './shared/Modal.jsx';
import { Sparkles, Loader2, Utensils, Heart, Clock, PlusCircle, X } from 'lucide-react';

const RecipeGenerator = () => {
    const { profile, dailyTotals } = useUser();
    const [recipes, setRecipes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [imageUrls, setImageUrls] = useState({});
    const [selectedRecipe, setSelectedRecipe] = useState(null);

    const [savedRecipes, setSavedRecipes] = useState(() => {
        try {
            const saved = localStorage.getItem('annapurna-saved-recipes');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('annapurna-saved-recipes', JSON.stringify(savedRecipes));
    }, [savedRecipes]);

    const handleGenerateRecipes = useCallback(async () => {
        if (!profile) return;

        setIsLoading(true);
        setError('');
        setRecipes([]);
        setImageUrls({});
        
        try {
            const generated = await generateRecipes(dailyTotals, profile);
            setRecipes(generated);
            
            generated.forEach(async (recipe) => {
                try {
                    const imageUrl = await generateImage(recipe.name, recipe.ingredients.join(', '));
                    setImageUrls(prev => ({ ...prev, [recipe.name]: imageUrl }));
                } catch (imgErr) {
                    console.error("Image generation failed for:", recipe.name, imgErr);
                    setImageUrls(prev => ({ ...prev, [recipe.name]: `https://picsum.photos/seed/${recipe.name}/400/300` }));
                }
            });
            
        } catch (err) {
            console.error("Failed to generate recipes:", err);
            setError("Sorry, I couldn't generate recipes right now. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    }, [profile, dailyTotals]);

    const toggleSaveRecipe = (recipe) => {
        setSavedRecipes(prev => 
            prev.some(r => r.name === recipe.name)
                ? prev.filter(r => r.name !== recipe.name)
                : [...prev, recipe]
        );
    };

    return (
        <div className="py-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100">Smart Recipes</h1>
                <p className="text-gray-500 dark:text-slate-400">Get personalized recipe ideas to meet your goals.</p>
            </div>
            
            <Card>
                <div className="flex flex-col items-center text-center">
                    <h2 className="text-xl font-semibold text-gray-700 dark:text-slate-200">Feeling hungry?</h2>
                    <p className="text-gray-500 dark:text-slate-400 mt-1 mb-4">Let AI create delicious Indian recipes based on your nutrient gaps.</p>
                    <button 
                        onClick={handleGenerateRecipes}
                        disabled={isLoading}
                        className="flex items-center justify-center px-6 py-3 bg-primary text-white font-semibold rounded-full hover:bg-green-700 disabled:bg-gray-400 transition shadow-lg"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5 mr-2" />
                                Generate Recipes for My Gaps
                            </>
                        )}
                    </button>
                    {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
                </div>
            </Card>

            {(recipes.length > 0 || savedRecipes.length > 0) && (
                <div className="space-y-6">
                    {recipes.length > 0 && <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100">Generated Recipes</h2>}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {recipes.map((recipe, index) => (
                           <RecipeCard 
                             key={`gen-${index}`}
                             recipe={recipe} 
                             imageUrl={imageUrls[recipe.name]} 
                             onSave={toggleSaveRecipe} 
                             onView={() => setSelectedRecipe(recipe)}
                             isSaved={savedRecipes.some(r => r.name === recipe.name)} 
                            />
                        ))}
                    </div>

                    {savedRecipes.length > 0 && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100 mb-4">Saved Recipes</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {savedRecipes.map((recipe, index) => (
                                    <RecipeCard 
                                      key={`saved-${index}`}
                                      recipe={recipe} 
                                      imageUrl={imageUrls[recipe.name]} 
                                      onSave={toggleSaveRecipe} 
                                      onView={() => setSelectedRecipe(recipe)}
                                      isSaved={true} 
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {selectedRecipe && (
                <RecipeModal 
                    recipe={selectedRecipe} 
                    imageUrl={imageUrls[selectedRecipe.name]}
                    onClose={() => setSelectedRecipe(null)}
                />
            )}
        </div>
    );
};

const RecipeCard = ({ recipe, imageUrl, onSave, onView, isSaved }) => {
    return (
        <Card className="flex flex-col overflow-hidden transition-all duration-300 !p-0">
            <div className="relative h-48 bg-gray-200 dark:bg-slate-700 flex items-center justify-center">
                {imageUrl ? (
                    <img src={imageUrl} alt={recipe.name} className="w-full h-full object-cover" />
                ) : (
                    <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                )}
            </div>
            <div className="p-4 flex-grow flex flex-col">
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold flex-1 pr-2 dark:text-slate-100">{recipe.name}</h3>
                    <button onClick={() => onSave(recipe)} className="p-2 -mt-1 -mr-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 transition flex-shrink-0">
                        <Heart className={`w-5 h-5 ${isSaved ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                    </button>
                </div>
                <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 flex-grow">{recipe.description}</p>
                 <div className="mt-3">
                    <p className="text-sm font-semibold text-secondary flex items-center"><Utensils className="w-4 h-4 mr-2"/> {recipe.portion_suggestion}</p>
                </div>
                <div className="mt-2 text-xs text-gray-600 dark:text-slate-400 flex flex-wrap gap-x-3 gap-y-1">
                    <span>🔥 {recipe.nutrients.calories} kcal</span>
                    <span>🥩 {recipe.nutrients.protein}g P</span>
                    <span>🍞 {recipe.nutrients.carbs}g C</span>
                    <span>🥑 {recipe.nutrients.fat}g F</span>
                </div>
                <div className="mt-4">
                    <button onClick={onView} className="text-sm w-full font-semibold text-white bg-primary hover:bg-green-700 py-2 rounded-lg flex items-center justify-center transition" >
                        View Recipe
                    </button>
                </div>
            </div>
        </Card>
    );
};

const RecipeModal = ({ recipe, imageUrl, onClose }) => {
    const handleAddToPlan = () => {
        alert('Feature coming soon: Add this recipe to your daily meal plan!');
    };
    
    return (
        <Modal isOpen={!!recipe} onClose={onClose}>
            <div className="w-full max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-xl transform transition-all overflow-hidden">
                <div className="relative">
                    <div className="h-56 bg-gray-200 dark:bg-slate-700 flex items-center justify-center">
                        {imageUrl ? (
                            <img src={imageUrl} alt={recipe.name} className="w-full h-full object-cover" />
                        ) : (
                            <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                        )}
                    </div>
                    <button onClick={onClose} className="absolute top-3 right-3 p-1.5 bg-black/40 text-white rounded-full hover:bg-black/60 transition">
                        <X className="w-5 h-5"/>
                    </button>
                </div>
                
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100">{recipe.name}</h2>
                    <p className="mt-2 text-gray-600 dark:text-slate-400">{recipe.description}</p>
                    
                    <div className="mt-4 text-sm text-gray-600 dark:text-slate-300 bg-gray-100 dark:bg-slate-700/50 rounded-lg p-3 flex flex-wrap gap-x-4 gap-y-2">
                        <span className="font-semibold flex items-center"><Clock className="w-4 h-4 mr-1.5 text-primary"/>{recipe.cooking_time || 'N/A'}</span>
                        <span className="font-semibold">🔥 {recipe.nutrients.calories} kcal</span>
                        <span>🥩 {recipe.nutrients.protein}g Protein</span>
                        <span>🍞 {recipe.nutrients.carbs}g Carbs</span>
                        <span>🥑 {recipe.nutrients.fat}g Fat</span>
                    </div>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                        <div>
                            <h4 className="font-semibold text-gray-800 dark:text-slate-200 mb-2 border-b border-gray-200 dark:border-slate-700 pb-1">Ingredients</h4>
                            <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-slate-400 pl-2">
                                {(recipe.ingredients || []).map((ing, i) => <li key={i}>{ing}</li>)}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-800 dark:text-slate-200 mb-2 border-b border-gray-200 dark:border-slate-700 pb-1">Instructions</h4>
                            <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-slate-400 pl-2">
                                {(recipe.instructions || []).map((step, i) => <li key={i}>{step}</li>)}
                            </ol>
                        </div>
                    </div>
                </div>
                
                <div className="p-6 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-200 dark:border-slate-700 flex gap-4">
                    <button 
                        onClick={handleAddToPlan}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 rounded-full hover:bg-green-200 dark:hover:bg-green-900/80 transition font-semibold"
                    >
                        <PlusCircle className="w-5 h-5"/>
                        Add to Plan
                    </button>
                     <button 
                        onClick={onClose}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 dark:bg-slate-700 dark:text-slate-200 rounded-full hover:bg-gray-300 dark:hover:bg-slate-600 transition font-semibold"
                    >
                        Close
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default RecipeGenerator;