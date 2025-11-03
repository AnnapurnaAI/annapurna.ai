import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext.jsx';
import { ChevronDown, Clock, Trash2, Flame, Beef, Wheat, Shell, Pencil } from 'lucide-react';

const MealCard = ({ meal }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { deleteMeal } = useUser();

  const mealTime = new Date(meal.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const foodSummary = meal.foods.map(f => `${f.name} (${f.quantity})`).join(', ');

  const handleDelete = (e) => {
    e.stopPropagation(); // Prevent the card from toggling when deleting
    if (window.confirm('Are you sure you want to delete this meal?')) {
      deleteMeal(meal.id);
    }
  };
  
  const handleEdit = (e) => {
    e.stopPropagation();
    alert('Edit functionality is coming soon!');
  };

  return (
    <div className="border border-gray-200 dark:border-slate-700 rounded-lg transition-shadow hover:shadow-md">
      {/* Collapsed View */}
      <button onClick={() => setIsOpen(!isOpen)} className="w-full text-left p-4 flex items-center justify-between" aria-expanded={isOpen} aria-controls={`meal-details-${meal.id}`}>
        <div className="flex-1 min-w-0">
          <div className="flex items-center text-sm text-gray-500 dark:text-slate-400 mb-1">
            <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{mealTime}</span>
          </div>
          <p className="font-semibold text-gray-800 dark:text-slate-200 capitalize truncate" title={foodSummary}>{foodSummary}</p>
          <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600 dark:text-slate-400 mt-2">
             <span className="flex items-center"><Flame className="w-3 h-3 mr-1 text-secondary"/>{meal.total.calories} kcal</span>
             <span className="flex items-center"><Beef className="w-3 h-3 mr-1 text-red-500"/>{meal.total.protein}g P</span>
             <span className="flex items-center"><Wheat className="w-3 h-3 mr-1 text-yellow-500"/>{meal.total.carbs}g C</span>
             <span className="flex items-center"><Shell className="w-3 h-3 mr-1 text-blue-500"/>{meal.total.fat}g F</span>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ml-2 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Expanded View */}
      {isOpen && (
        <div id={`meal-details-${meal.id}`} className="p-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50">
          <h4 className="font-semibold text-sm mb-2 text-gray-700 dark:text-slate-300">Meal Breakdown:</h4>
          <ul className="space-y-2 mb-4">
            {meal.foods.map((food, index) => (
              <li key={index} className="text-sm p-2 bg-white dark:bg-slate-700 rounded-md flex justify-between items-center">
                <span className="capitalize dark:text-slate-200">{food.name} ({food.quantity})</span>
                <span className="font-medium text-gray-600 dark:text-slate-300">{food.calories} kcal</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-end space-x-2">
            <button 
              onClick={handleEdit}
              className="flex items-center text-sm px-3 py-1 bg-gray-200 text-gray-700 dark:bg-slate-600 dark:text-slate-200 rounded-md hover:bg-gray-300 dark:hover:bg-slate-500"
            >
              <Pencil className="w-4 h-4 mr-1" />
              Edit
            </button>
            <button 
              onClick={handleDelete}
              className="flex items-center text-sm px-3 py-1 bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-900/60"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealCard;