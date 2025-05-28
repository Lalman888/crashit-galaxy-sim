
import React, { useState, useEffect } from 'react';
import CrashChart from './CrashChart';
import GameStats from './GameStats';
import GameStatus from './GameStatus';
import { Rocket } from 'lucide-react';

const ActiveCrashGame = () => {
  const [multiplier, setMultiplier] = useState(1.00);
  const [isRunning, setIsRunning] = useState(false);
  const [crashed, setCrashed] = useState(false);
  const [gamePhase, setGamePhase] = useState<'waiting' | 'running' | 'crashed'>('waiting');
  const [countdown, setCountdown] = useState(5);
  const [userBet] = useState(0.05);
  const [potentialWin, setPotentialWin] = useState(0.05);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gamePhase === 'waiting') {
      interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setGamePhase('running');
            setIsRunning(true);
            setMultiplier(1.00);
            setCrashed(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (gamePhase === 'running') {
      interval = setInterval(() => {
        setMultiplier(prev => {
          const increment = Math.random() * 0.05 + 0.01;
          const newMultiplier = prev + increment;
          
          const crashChance = Math.min((newMultiplier - 1) * 0.1, 0.4);
          
          if (Math.random() < crashChance || newMultiplier > 50) {
            setIsRunning(false);
            setCrashed(true);
            setGamePhase('crashed');
            
            setTimeout(() => {
              setGamePhase('waiting');
              setCountdown(5);
            }, 3000);
            
            return newMultiplier;
          }
          
          return newMultiplier;
        });
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gamePhase]);

  useEffect(() => {
    setPotentialWin(userBet * multiplier);
  }, [multiplier, userBet]);

  return (
    <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-purple-500/20 p-4 lg:p-6 h-full flex flex-col dark:bg-black/20 light:bg-white/90 dark:border-purple-500/20 light:border-purple-300/30">
      {/* Game Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
            <Rocket className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
          </div>
          <h2 className="text-xl lg:text-2xl font-bold text-white dark:text-white light:text-gray-900">
            Crash Game
          </h2>
        </div>
        
        <GameStatus gamePhase={gamePhase} countdown={countdown} />
      </div>

      {/* Multiplier Display - Mobile optimized */}
      <div className="text-center mb-4 flex-shrink-0">
        <div className={`text-4xl sm:text-5xl lg:text-6xl font-bold transition-all duration-200 ${
          gamePhase === 'running' ? 'text-green-400 animate-pulse' : 
          gamePhase === 'crashed' ? 'text-red-400' : 'text-gray-400 dark:text-gray-400 light:text-gray-600'
        }`}>
          {multiplier.toFixed(2)}x
        </div>
        {gamePhase === 'running' && (
          <div className="text-green-400 text-base lg:text-lg animate-bounce">
            🚀 Rising...
          </div>
        )}
      </div>

      {/* Game Chart - Responsive height */}
      <div className="relative flex-1 min-h-[200px] sm:min-h-[250px] lg:min-h-[300px] mb-4">
        <CrashChart 
          multiplier={multiplier} 
          isRunning={isRunning} 
          crashed={crashed}
          gamePhase={gamePhase}
        />
      </div>

      {/* Game Statistics */}
      <div className="mb-4 flex-shrink-0">
        <GameStats 
          userBet={userBet}
          potentialWin={potentialWin}
          multiplier={multiplier}
          gamePhase={gamePhase}
        />
      </div>

      {/* Status Info */}
      <div className="text-center flex-shrink-0">
        <div className="text-gray-400 dark:text-gray-400 light:text-gray-600 text-sm">
          {gamePhase === 'running' ? (
            <span className="text-yellow-400">
              ⚡ Auto cash out at 2.00x
            </span>
          ) : (
            "Demo mode - Experience the thrill!"
          )}
        </div>
      </div>
    </div>
  );
};

export default ActiveCrashGame;
