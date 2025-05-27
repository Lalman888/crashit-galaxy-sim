
import React from 'react';
import { Rocket } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-black/20 backdrop-blur-md border-b border-purple-500/20 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-xl">
            <Rocket className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            CrashIt.io
          </h1>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="bg-green-500/20 px-4 py-2 rounded-lg border border-green-500/30">
            <span className="text-green-400 font-semibold">🟢 3,247 Online</span>
          </div>
          <div className="bg-purple-500/20 px-4 py-2 rounded-lg border border-purple-500/30">
            <span className="text-purple-400 font-semibold">💎 Total Win: 1,234.56 BTC</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
