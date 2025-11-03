import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

const DEFAULT_GOALS = {
  calories: 1800,
  protein: 90, // 20% of 1800 kcal
  carbs: 225, // 50% of 1800 kcal
  fat: 60, // 30% of 1800 kcal
};

export const UserProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [mealLog, setMealLog] = useState([]);
  const [waterIntake, setWaterIntake] = useState(0); // in ml

  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem('annapurna-profile');
      const storedMealLog = localStorage.getItem('annapurna-mealLog');
      const storedWater = localStorage.getItem('annapurna-waterIntake');
      
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
      }
      if (storedMealLog) {
        setMealLog(JSON.parse(storedMealLog));
      }
      if (storedWater) {
        setWaterIntake(JSON.parse(storedWater));
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
      localStorage.clear(); // Clear corrupted data
    }
  }, []);

  const saveProfile = useCallback((newProfile) => {
    const calculatedGoals = {
        calories: newProfile.calorieGoal || DEFAULT_GOALS.calories,
        protein: Math.round((newProfile.calorieGoal * 0.20) / 4),
        carbs: Math.round((newProfile.calorieGoal * 0.50) / 4),
        fat: Math.round((newProfile.calorieGoal * 0.30) / 9),
    };

    const profileWithGoals = { 
        ...newProfile, 
        goals: calculatedGoals
    };
    setProfile(profileWithGoals);
    localStorage.setItem('annapurna-profile', JSON.stringify(profileWithGoals));
  }, []);

  const addMeal = useCallback((mealData) => {
    setMealLog(prevLog => {
      const newMeal = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        foods: mealData.foods,
        total: mealData.total,
      };
      const newLog = [newMeal, ...prevLog]; // Prepend to show the latest meal first
      localStorage.setItem('annapurna-mealLog', JSON.stringify(newLog));
      return newLog;
    });
  }, []);

  const deleteMeal = useCallback((mealId) => {
    setMealLog(prevLog => {
      const newLog = prevLog.filter(meal => meal.id !== mealId);
      localStorage.setItem('annapurna-mealLog', JSON.stringify(newLog));
      return newLog;
    });
  }, []);

  const addWater = useCallback((amount) => {
    setWaterIntake(prevIntake => {
      const newIntake = prevIntake + amount;
      localStorage.setItem('annapurna-waterIntake', JSON.stringify(newIntake));
      return newIntake;
    });
  }, []);

  const dailyTotals = mealLog.reduce(
    (acc, meal) => {
      acc.calories += meal.total?.calories || 0;
      acc.protein += meal.total?.protein || 0;
      acc.carbs += meal.total?.carbs || 0;
      acc.fat += meal.total?.fat || 0;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const value = {
    profile,
    saveProfile,
    mealLog,
    addMeal,
    deleteMeal,
    waterIntake,
    addWater,
    dailyTotals,
    isOnboardingComplete: !!profile,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};