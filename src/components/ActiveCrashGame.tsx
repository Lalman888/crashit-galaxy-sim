
import React, { useState, useEffect } from 'react';
import CrashGameCanvas from './CrashGameCanvas';
import { Rocket, TrendingUp, Zap } from 'lucide-react';

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
          
          // Random crash chance increases with multiplier
          const crashChance = Math.min((newMultiplier - 1) * 0.1, 0.4);
          
          if (Math.random() < crashChance || newMultiplier > 50) {
            setIsRunning(false);
            setCrashed(true);
            setGamePhase('crashed');
            
            // Start next round after crash
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
    <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-purple-500/20 p-6 h-full">
      {/* Game Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
            <Rocket className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Crash Game</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          {gamePhase === 'waiting' && (
            <div className="bg-yellow-500/20 px-4 py-2 rounded-lg border border-yellow-500/30">
              <span className="text-yellow-400 font-semibold">Starting in {countdown}s</span>
            </div>
          )}
          {gamePhase === 'running' && (
            <div className="bg-green-500/20 px-4 py-2 rounded-lg border border-green-500/30 animate-pulse">
              <span className="text-green-400 font-semibold">🚀 FLYING</span>
            </div>
          )}
          {gamePhase === 'crashed' && (
            <div className="bg-red-500/20 px-4 py-2 rounded-lg border border-red-500/30">
              <span className="text-red-400 font-semibold">💥 CRASHED</span>
            </div>
          )}
        </div>
      </div>

      {/* Multiplier Display */}
      <div className="text-center mb-6">
        <div className={`text-6xl font-bold transition-all duration-200 ${
          gamePhase === 'running' ? 'text-green-400 animate-pulse' : 
          gamePhase === 'crashed' ? 'text-red-400' : 'text-gray-400'
        }`}>
          {multiplier.toFixed(2)}x
        </div>
        {gamePhase === 'running' && (
          <div className="text-green-400 text-lg animate-bounce">
            <TrendingUp className="w-6 h-6 inline mr-2" />
            Rising...
          </div>
        )}
      </div>

      {/* Game Canvas */}
      <div className="relative h-64 mb-6 bg-black/30 rounded-xl border border-purple-500/20 overflow-hidden">
        <CrashGameCanvas 
          multiplier={multiplier} 
          isRunning={isRunning} 
          crashed={crashed} 
        />
        
        {gamePhase === 'waiting' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">🚀</div>
              <div className="text-white text-xl font-semibold">Next round in {countdown}s</div>
            </div>
          </div>
        )}
      </div>

      {/* Betting Section */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/20">
          <div className="text-purple-300 text-sm mb-1">Your Bet</div>
          <div className="text-white text-2xl font-bold">{userBet.toFixed(4)} BTC</div>
        </div>
        
        <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
          <div className="text-green-300 text-sm mb-1">Potential Win</div>
          <div className="text-green-400 text-2xl font-bold">{potentialWin.toFixed(4)} BTC</div>
        </div>
      </div>

      {/* Auto Cash Out Info */}
      <div className="mt-4 text-center">
        <div className="text-gray-400 text-sm">
          {gamePhase === 'running' ? (
            <span className="text-yellow-400">
              <Zap className="w-4 h-4 inline mr-1" />
              Auto cash out at 2.00x
            </span>
          ) : (
            "Demo mode - Next round starting soon!"
          )}
        </div>
      </div>
    </div>
  );
};

export default ActiveCrashGame;
