import React, { useState, useEffect } from 'react';
import ProfessionalChart from './ProfessionalChart';
import GameStats from './GameStats';
import GameStatus from './GameStatus';
import { CrashAlgorithm } from '../utils/crashAlgorithm';
import { Rocket } from 'lucide-react';

const ActiveCrashGame = () => {
  const [multiplier, setMultiplier] = useState(1.00);
  const [isRunning, setIsRunning] = useState(false);
  const [crashed, setCrashed] = useState(false);
  const [gamePhase, setGamePhase] = useState<'waiting' | 'running' | 'crashed'>('waiting');
  const [countdown, setCountdown] = useState(5);
  const [userBet] = useState(0.05);
  const [potentialWin, setPotentialWin] = useState(0.05);
  const [crashPoint, setCrashPoint] = useState(2.0);
  const [startTime, setStartTime] = useState(0);
  const [gameSpeed] = useState(100); // ms between updates

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gamePhase === 'waiting') {
      interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            // Generate new crash point for this round
            const newCrashPoint = CrashAlgorithm.generateCrashPoint();
            setCrashPoint(newCrashPoint);
            
            setGamePhase('running');
            setIsRunning(true);
            setMultiplier(1.00);
            setCrashed(false);
            setStartTime(Date.now());
            
            console.log(`🎯 New round starting! Crash point: ${newCrashPoint.toFixed(2)}x`);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (gamePhase === 'running') {
      interval = setInterval(() => {
        setMultiplier(prev => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / (crashPoint * 1000), 1);
          
          const newMultiplier = CrashAlgorithm.calculateMultiplier(progress, crashPoint, startTime);
          
          // Check if should crash
          if (CrashAlgorithm.shouldCrash(newMultiplier, crashPoint)) {
            setIsRunning(false);
            setCrashed(true);
            setGamePhase('crashed');
            
            console.log(`💥 CRASHED at ${newMultiplier.toFixed(2)}x! Target was ${crashPoint.toFixed(2)}x`);
            
            setTimeout(() => {
              setGamePhase('waiting');
              setCountdown(5);
            }, 3000);
            
            return crashPoint; // Set to exact crash point
          }
          
          return newMultiplier;
        });
      }, gameSpeed);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gamePhase, crashPoint, startTime, gameSpeed]);

  useEffect(() => {
    setPotentialWin(userBet * multiplier);
  }, [multiplier, userBet]);

  return (
    <div className="bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-md rounded-xl lg:rounded-2xl border border-purple-500/20 p-3 sm:p-4 lg:p-6 h-full flex flex-col shadow-2xl">
      {/* Game Header - Mobile Optimized */}
      <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 flex-shrink-0">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 sm:p-3 rounded-lg sm:rounded-xl shadow-lg">
            <Rocket className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
              Professional Crash
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm hidden sm:block">Live Market Simulation</p>
          </div>
        </div>
        
        <GameStatus gamePhase={gamePhase} countdown={countdown} />
      </div>

      {/* Enhanced Multiplier Display - Mobile Responsive */}
      <div className="text-center mb-4 sm:mb-6 flex-shrink-0">
        <div className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold transition-all duration-300 ${
          gamePhase === 'running' ? 'text-green-400 animate-pulse drop-shadow-lg' : 
          gamePhase === 'crashed' ? 'text-red-400 drop-shadow-lg' : 'text-gray-400'
        }`}>
          {multiplier.toFixed(2)}x
        </div>
        
        {gamePhase === 'running' && (
          <div className="mt-1 sm:mt-2">
            <div className="text-green-400 text-sm sm:text-base lg:text-lg animate-pulse">
              🚀 Target: {crashPoint.toFixed(2)}x
            </div>
            {multiplier > crashPoint * 0.8 && (
              <div className="text-yellow-400 text-xs sm:text-sm animate-bounce mt-1">
                ⚠️ Danger Zone!
              </div>
            )}
          </div>
        )}
        
        {gamePhase === 'crashed' && (
          <div className="text-red-400 text-sm sm:text-base lg:text-lg animate-bounce mt-1 sm:mt-2">
            💥 Market Crashed!
          </div>
        )}
      </div>

      {/* Professional Chart - Mobile Height Optimization */}
      <div className="relative flex-1 min-h-[200px] sm:min-h-[250px] md:min-h-[300px] lg:min-h-[400px] mb-3 sm:mb-4 lg:mb-6">
        <ProfessionalChart 
          multiplier={multiplier} 
          isRunning={isRunning} 
          crashed={crashed}
          gamePhase={gamePhase}
          crashPoint={crashPoint}
        />
      </div>

      {/* Enhanced Game Statistics - Mobile Grid */}
      <div className="mb-3 sm:mb-4 flex-shrink-0">
        <GameStats 
          userBet={userBet}
          potentialWin={potentialWin}
          multiplier={multiplier}
          gamePhase={gamePhase}
        />
      </div>

      {/* Status Info - Mobile Optimized */}
      <div className="text-center flex-shrink-0">
        <div className="text-gray-400 text-xs sm:text-sm">
          {gamePhase === 'running' ? (
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-4">
              <span className="text-yellow-400 animate-pulse text-xs sm:text-sm">
                ⚡ Auto cash out at 2.00x
              </span>
              <span className="text-green-400 text-xs sm:text-sm">
                🎯 Current target: {crashPoint.toFixed(2)}x
              </span>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="text-xs sm:text-sm">Professional Trading Simulator</div>
              <div className="text-xs text-gray-500 hidden sm:block">
                Using advanced market algorithms for realistic crashes
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActiveCrashGame;
