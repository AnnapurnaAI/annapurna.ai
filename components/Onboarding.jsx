import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext.jsx';
import { ChevronRight } from 'lucide-react';

const Onboarding = () => {
  const { isOnboardingComplete, saveProfile } = useUser();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    preference: 'Veg',
    calorieGoal: 1800,
    city: '',
    country: '',
  });

  if (isOnboardingComplete) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveProfile(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-80 dark:bg-slate-900/90 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 w-full max-w-md transform transition-all">
        <h1 className="text-2xl font-bold text-center text-primary">Welcome to Annapurna.ai!</h1>
        <p className="text-center text-gray-500 dark:text-slate-400 mt-2 mb-6">Let's set up your profile to get started.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
           <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Name</label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Age</label>
              <input type="number" name="age" id="age" value={formData.age} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" required />
            </div>
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Gender</label>
              <select name="gender" id="gender" value={formData.gender} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-slate-300">City</label>
              <input type="text" name="city" id="city" value={formData.city} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
            </div>
             <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Country</label>
              <input type="text" name="country" id="country" value={formData.country} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Dietary Preference</label>
            <div className="mt-1 flex space-x-4">
              <label className="flex items-center">
                <input type="radio" name="preference" value="Veg" checked={formData.preference === 'Veg'} onChange={handleChange} className="focus:ring-primary h-4 w-4 text-primary border-gray-300"/>
                <span className="ml-2 text-sm text-gray-600 dark:text-slate-300">Vegetarian</span>
              </label>
              <label className="flex items-center">
                <input type="radio" name="preference" value="Non-Veg" checked={formData.preference === 'Non-Veg'} onChange={handleChange} className="focus:ring-primary h-4 w-4 text-primary border-gray-300"/>
                <span className="ml-2 text-sm text-gray-600 dark:text-slate-300">Non-Vegetarian</span>
              </label>
            </div>
          </div>
          
          <div>
            <label htmlFor="calorieGoal" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Daily Calorie Goal (kcal)</label>
            <input type="number" name="calorieGoal" id="calorieGoal" value={formData.calorieGoal} onChange={handleChange} step="50" className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" required />
          </div>

          <div className="pt-4">
            <button type="submit" className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-full shadow-lg text-md font-medium text-white bg-primary hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition">
              Let's Go!
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;