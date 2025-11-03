import React from "react";
import { useUser } from "../contexts/UserContext.jsx";
import { Droplet, Plus } from "lucide-react";

const WATER_GOAL = 3000; // 3L in ml

const WaterTracker = () => {
  const { waterIntake, addWater } = useUser();
  const progress = Math.min((waterIntake / WATER_GOAL) * 100, 100);

  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-md flex flex-col">
      <h2 className="text-xl font-semibold text-gray-700 dark:text-slate-200 flex items-center mb-4">
        <Droplet className="w-6 h-6 mr-2 text-blue-500" />
        Water Intake
      </h2>
      <div className="relative w-48 h-48 self-center my-6">
        <svg className="w-full h-full" viewBox="0 0 36 36">
          <path
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            className="stroke-current text-gray-200 dark:text-slate-700"
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            className="stroke-current text-blue-500 transition-all duration-500"
            strokeWidth="3"
            fill="none"
            strokeDasharray={`${progress}, 100`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {Math.round((waterIntake / 1000) * 10) / 10}L
          </span>
          <span className="text-xs text-gray-500 dark:text-slate-400">
            of 3L
          </span>
        </div>
      </div>
      <div className="flex justify-center gap-4 mt-auto">
        <button
          onClick={() => addWater(250)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/80 transition text-sm"
        >
          <Plus className="w-4 h-4" /> Glass (250ml)
        </button>
        <button
          onClick={() => addWater(1000)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/80 transition text-sm"
        >
          <Plus className="w-4 h-4" /> Bottle (1L)
        </button>
      </div>
    </div>
  );
};

export default WaterTracker;
