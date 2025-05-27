
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="bg-purple-500/20 hover:bg-purple-500/30 dark:bg-purple-500/20 dark:hover:bg-purple-500/30 light:bg-indigo-100 light:hover:bg-indigo-200 px-3 py-2 rounded-lg border border-purple-500/30 dark:border-purple-500/30 light:border-indigo-300 transition-all duration-300 transform hover:scale-105"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-yellow-400" />
      ) : (
        <Moon className="w-5 h-5 text-indigo-600" />
      )}
    </button>
  );
};

export default ThemeToggle;
