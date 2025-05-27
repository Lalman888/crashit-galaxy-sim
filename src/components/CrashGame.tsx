
import React, { useRef, useEffect, useState } from 'react';

const CrashGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [multiplier, setMultiplier] = useState(1.00);
  const [gameState, setGameState] = useState<'waiting' | 'flying' | 'crashed'>('waiting');
  const [countdown, setCountdown] = useState(5);
  const animationRef = useRef<number>();
  const gameTimeRef = useRef(0);
  const crashPointRef = useRef(0);

  const generateCrashPoint = () => {
    // Generate realistic crash points with weighted probabilities
    const rand = Math.random();
    if (rand < 0.33) return 1 + Math.random() * 1; // 1.0x - 2.0x (33%)
    if (rand < 0.66) return 2 + Math.random() * 3; // 2.0x - 5.0x (33%)
    if (rand < 0.9) return 5 + Math.random() * 5; // 5.0x - 10.0x (24%)
    return 10 + Math.random() * 40; // 10.0x - 50.0x (10%)
  };

  const startNewGame = () => {
    crashPointRef.current = generateCrashPoint();
    gameTimeRef.current = 0;
    setMultiplier(1.00);
    setGameState('flying');
    
    const animate = () => {
      gameTimeRef.current += 0.016; // ~60fps
      const progress = gameTimeRef.current / 3; // 3 seconds to reach crash point
      const currentMultiplier = 1 + (crashPointRef.current - 1) * Math.pow(progress, 0.8);
      
      if (currentMultiplier >= crashPointRef.current) {
        setMultiplier(crashPointRef.current);
        setGameState('crashed');
        setTimeout(() => {
          setGameState('waiting');
          setCountdown(5);
        }, 3000);
      } else {
        setMultiplier(currentMultiplier);
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    
    animate();
  };

  useEffect(() => {
    let countdownInterval: NodeJS.Timeout;
    
    if (gameState === 'waiting' && countdown > 0) {
      countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            startNewGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (countdownInterval) clearInterval(countdownInterval);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [gameState, countdown]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.1)';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 50) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      if (gameState === 'flying' || gameState === 'crashed') {
        // Draw curve
        const progress = Math.min(gameTimeRef.current / 3, 1);
        const points = [];
        
        for (let i = 0; i <= progress * canvas.width; i += 5) {
          const x = i;
          const mult = 1 + (crashPointRef.current - 1) * Math.pow(i / canvas.width, 0.8);
          const y = canvas.height - (mult - 1) * (canvas.height / Math.max(crashPointRef.current, 10));
          points.push({ x, y });
        }

        if (points.length > 1) {
          ctx.strokeStyle = gameState === 'crashed' ? '#ef4444' : '#10b981';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y);
          
          for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
          }
          ctx.stroke();

          // Draw rocket at the end
          if (points.length > 0) {
            const lastPoint = points[points.length - 1];
            ctx.fillStyle = gameState === 'crashed' ? '#ef4444' : '#fbbf24';
            ctx.font = '24px Arial';
            ctx.fillText('🚀', lastPoint.x - 12, lastPoint.y + 8);
          }
        }
      }
    };

    const resizeObserver = new ResizeObserver(draw);
    resizeObserver.observe(canvas);
    draw();

    return () => resizeObserver.disconnect();
  }, [gameState, multiplier]);

  return (
    <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-purple-500/20 p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-purple-400">Crash Game</h2>
        <div className="flex items-center space-x-4">
          {gameState === 'waiting' && (
            <div className="bg-yellow-500/20 px-4 py-2 rounded-lg border border-yellow-500/30">
              <span className="text-yellow-400 font-semibold">Next round in {countdown}s</span>
            </div>
          )}
          <div className={`px-6 py-3 rounded-lg font-bold text-3xl ${
            gameState === 'crashed' ? 'bg-red-500/20 border-red-500/30 text-red-400' :
            gameState === 'flying' ? 'bg-green-500/20 border-green-500/30 text-green-400' :
            'bg-purple-500/20 border-purple-500/30 text-purple-400'
          }`}>
            {multiplier.toFixed(2)}x
          </div>
        </div>
      </div>
      
      <div className="relative h-96 bg-gray-900/50 rounded-xl overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ width: '100%', height: '100%' }}
        />
        
        {gameState === 'crashed' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-red-500/90 text-white px-8 py-4 rounded-xl text-2xl font-bold animate-pulse">
              💥 CRASHED at {crashPointRef.current.toFixed(2)}x!
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="bg-gray-800/50 rounded-lg p-4">
          <h3 className="text-sm text-gray-400 mb-2">Your Bet</h3>
          <div className="text-xl font-bold text-white">0.05 BTC</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4">
          <h3 className="text-sm text-gray-400 mb-2">Potential Win</h3>
          <div className="text-xl font-bold text-green-400">
            {(0.05 * multiplier).toFixed(4)} BTC
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrashGame;
