
import React from 'react';
import { Rocket } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  return (
    <header className="bg-black/20 backdrop-blur-md border-b border-purple-500/20 sticky top-0 z-40">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-1.5 sm:p-2 rounded-lg sm:rounded-xl animate-pulse">
            <Rocket className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            CrashIt.io
          </h1>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
          <div className="bg-green-500/20 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg border border-green-500/30 hover:bg-green-500/30 transition-colors">
            <span className="text-green-400 font-semibold text-xs sm:text-sm lg:text-base">
              <span className="hidden sm:inline">🟢 {Math.floor(Math.random() * 1000 + 3000)} Online</span>
              <span className="sm:hidden">🟢 {Math.floor(Math.random() * 1000 + 3000)}</span>
            </span>
          </div>
          <div className="bg-purple-500/20 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg border border-purple-500/30 hover:bg-purple-500/30 transition-colors hidden md:block">
            <span className="text-purple-400 font-semibold text-xs sm:text-sm lg:text-base">💎 Total Win: {(Math.random() * 500 + 1000).toFixed(2)} BTC</span>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
