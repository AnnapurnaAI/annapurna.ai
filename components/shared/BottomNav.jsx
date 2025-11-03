import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, UserCircle } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/recipes', label: 'Recipes', icon: BookOpen },
  { path: '/profile', label: 'Profile', icon: UserCircle },
];

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 shadow-t-lg z-40">
      <div className="max-w-4xl mx-auto flex justify-around px-2 py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-24 p-2 rounded-lg transition-colors text-sm ${
                isActive
                  ? 'bg-green-100 dark:bg-slate-700 text-primary font-semibold'
                  : 'text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700/50'
              }`
            }
          >
            <item.icon className="w-6 h-6 mb-1" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;