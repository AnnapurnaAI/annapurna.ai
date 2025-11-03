import React from "react";
import { useUser } from "../contexts/UserContext.jsx";
import WaterTracker from "./WaterTracker.jsx";
import MealLogger from "./MealLogger.jsx";
import CircularProgress from "./shared/CircularProgress.jsx";
import { Utensils, Droplet, Flame, Beef, Wheat, Shell } from "lucide-react";

const Dashboard = () => {
  const { profile, dailyTotals } = useUser();

  if (!profile) {
    return null; // Onboarding component will be displayed
  }

  const { goals } = profile;

  const nutrients = [
    {
      name: "Protein",
      value: dailyTotals.protein,
      goal: goals.protein,
      color: "text-red-500",
      icon: <Beef className="w-6 h-6 text-red-500" />,
      unit: "g",
    },
    {
      name: "Carbs",
      value: dailyTotals.carbs,
      goal: goals.carbs,
      color: "text-yellow-500",
      icon: <Wheat className="w-6 h-6 text-yellow-500" />,
      unit: "g",
    },
    {
      name: "Fat",
      value: dailyTotals.fat,
      goal: goals.fat,
      color: "text-blue-500",
      icon: <Shell className="w-6 h-6 text-blue-500" />,
      unit: "g",
    },
  ];

  const isCaloriesOverflow = dailyTotals.calories > goals.calories;

  return (
    <div className="py-6 flex flex-col h-full">
      <div className="flex-shrink-0">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100">
          Hello, {profile.name}!
        </h1>
        <p className="text-gray-500 dark:text-slate-400">
          Here's your nutritional summary for today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 flex-shrink-0">
        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-slate-200 flex items-center mb-6">
            <Flame className="w-6 h-6 mr-2 text-secondary" />
            Daily Summary
          </h2>
          <div className="flex flex-col items-center justify-around gap-6">
            {/* Calories Circle */}
            <div className="flex flex-col items-center">
              <CircularProgress
                value={dailyTotals.calories}
                max={goals.calories}
                size={150}
                strokeWidth={14}
                colorClass={
                  isCaloriesOverflow ? "text-red-500" : "text-secondary"
                }
              >
                {isCaloriesOverflow ? (
                  <span className="text-4xl" role="img" aria-label="Warning">
                    ⚠️
                  </span>
                ) : (
                  <>
                    <span className="text-3xl font-bold text-gray-800 dark:text-slate-100">
                      {Math.round(dailyTotals.calories)}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-slate-400">
                      / {goals.calories} kcal
                    </span>
                  </>
                )}
              </CircularProgress>
            </div>

            {/* Macronutrients */}
            <div className="w-full xl:w-auto flex justify-around items-start gap-4">
              {nutrients.map((nutrient) => {
                const isOverflow = nutrient.value > nutrient.goal;
                return (
                  <div
                    key={nutrient.name}
                    className="flex flex-col items-center gap-1 text-center w-20"
                  >
                    <CircularProgress
                      value={nutrient.value}
                      max={nutrient.goal}
                      size={80}
                      strokeWidth={8}
                      colorClass={isOverflow ? "text-red-500" : nutrient.color}
                    >
                      {isOverflow ? (
                        <span
                          className="text-2xl"
                          role="img"
                          aria-label="Warning"
                        >
                          ⚠️
                        </span>
                      ) : (
                        React.cloneElement(nutrient.icon, {
                          className: `w-5 h-5 ${nutrient.color}`,
                        })
                      )}
                    </CircularProgress>
                    <span className="text-sm font-semibold mt-1 dark:text-slate-200">
                      {nutrient.name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-slate-400">{`${Math.round(
                      nutrient.value
                    )}/${nutrient.goal}${nutrient.unit}`}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <WaterTracker />
      </div>

      <div className="flex-grow mt-8 overflow-hidden">
        <MealLogger />
      </div>
    </div>
  );
};

export default Dashboard;
