
import React from 'react';
import { TrendingUp, Coins, Zap, Target } from 'lucide-react';

interface GameStatsProps {
  userBet: number;
  potentialWin: number;
  multiplier: number;
  gamePhase: 'waiting' | 'running' | 'crashed';
}

const GameStats: React.FC<GameStatsProps> = ({ userBet, potentialWin, multiplier, gamePhase }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
      {/* Current Multiplier */}
      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 dark:from-purple-500/20 dark:to-pink-500/20 light:from-purple-100/80 light:to-pink-100/80 rounded-lg sm:rounded-xl p-2 sm:p-3 lg:p-4 border border-purple-500/30 dark:border-purple-500/30 light:border-purple-300/50">
        <div className="flex items-center space-x-1 sm:space-x-2 mb-1 sm:mb-2">
          <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400 dark:text-purple-400 light:text-purple-600" />
          <div className="text-purple-300 dark:text-purple-300 light:text-purple-600 text-xs sm:text-sm font-medium">Multiplier</div>
        </div>
        <div className={`text-lg sm:text-xl lg:text-2xl font-bold transition-colors ${
          gamePhase === 'running' ? 'text-green-400 animate-pulse' : 
          gamePhase === 'crashed' ? 'text-red-400' : 
          'text-purple-400 dark:text-purple-400 light:text-purple-600'
        }`}>
          {multiplier.toFixed(2)}x
        </div>
      </div>

      {/* Your Bet */}
      <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 dark:from-blue-500/20 dark:to-cyan-500/20 light:from-blue-100/80 light:to-cyan-100/80 rounded-lg sm:rounded-xl p-2 sm:p-3 lg:p-4 border border-blue-500/30 dark:border-blue-500/30 light:border-blue-300/50">
        <div className="flex items-center space-x-1 sm:space-x-2 mb-1 sm:mb-2">
          <Coins className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400 dark:text-blue-400 light:text-blue-600" />
          <div className="text-blue-300 dark:text-blue-300 light:text-blue-600 text-xs sm:text-sm font-medium">Your Bet</div>
        </div>
        <div className="text-white dark:text-white light:text-gray-900 text-lg sm:text-xl lg:text-2xl font-bold">
          <span className="hidden sm:inline">{userBet.toFixed(4)} BTC</span>
          <span className="sm:hidden">{userBet.toFixed(3)}</span>
        </div>
      </div>
      
      {/* Potential Win */}
      <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 dark:from-green-500/20 dark:to-emerald-500/20 light:from-green-100/80 light:to-emerald-100/80 rounded-lg sm:rounded-xl p-2 sm:p-3 lg:p-4 border border-green-500/30 dark:border-green-500/30 light:border-green-300/50">
        <div className="flex items-center space-x-1 sm:space-x-2 mb-1 sm:mb-2">
          <Target className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 dark:text-green-400 light:text-green-600" />
          <div className="text-green-300 dark:text-green-300 light:text-green-600 text-xs sm:text-sm font-medium">Potential Win</div>
        </div>
        <div className="text-green-400 text-lg sm:text-xl lg:text-2xl font-bold">
          <span className="hidden sm:inline">{potentialWin.toFixed(4)} BTC</span>
          <span className="sm:hidden">{potentialWin.toFixed(3)}</span>
        </div>
      </div>

      {/* Auto Cash Out */}
      <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 dark:from-yellow-500/20 dark:to-orange-500/20 light:from-yellow-100/80 light:to-orange-100/80 rounded-lg sm:rounded-xl p-2 sm:p-3 lg:p-4 border border-yellow-500/30 dark:border-yellow-500/30 light:border-yellow-300/50">
        <div className="flex items-center space-x-1 sm:space-x-2 mb-1 sm:mb-2">
          <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 dark:text-yellow-400 light:text-yellow-600" />
          <div className="text-yellow-300 dark:text-yellow-300 light:text-yellow-600 text-xs sm:text-sm font-medium">Auto Cash</div>
        </div>
        <div className="text-yellow-400 text-lg sm:text-xl lg:text-2xl font-bold">2.00x</div>
      </div>
    </div>
  );
};

export default GameStats;
