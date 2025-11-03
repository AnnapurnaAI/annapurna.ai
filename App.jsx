import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard.jsx';
import RecipeGenerator from './components/RecipeGenerator.jsx';
import Profile from './components/Profile.jsx';
import BottomNav from './components/shared/BottomNav.jsx';
import { UserProvider } from './contexts/UserContext.jsx';
import Onboarding from './components/Onboarding.jsx';

function App() {
  return (
    <UserProvider>
      <HashRouter>
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-slate-200">
          <main className="pb-20 h-screen flex flex-col">
            <div className="flex-grow overflow-y-auto">
               <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                 <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/recipes" element={<RecipeGenerator />} />
                    <Route path="/profile" element={<Profile />} />
                  </Routes>
              </div>
            </div>
          </main>
          <BottomNav />
          <Onboarding />
        </div>
      </HashRouter>
    </UserProvider>
  );
}

export default App;