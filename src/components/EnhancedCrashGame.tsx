
import React, { useRef, useEffect, useState } from 'react';
import SoundManager from './SoundManager';

const EnhancedCrashGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [multiplier, setMultiplier] = useState(1.00);
  const [gameState, setGameState] = useState<'waiting' | 'flying' | 'crashed'>('waiting');
  const [countdown, setCountdown] = useState(5);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, vx: number, vy: number, life: number}>>([]);
  const animationRef = useRef<number>();
  const gameTimeRef = useRef(0);
  const crashPointRef = useRef(0);

  const generateCrashPoint = () => {
    const rand = Math.random();
    if (rand < 0.33) return 1 + Math.random() * 1; // 1.0x - 2.0x (33%)
    if (rand < 0.66) return 2 + Math.random() * 3; // 2.0x - 5.0x (33%)
    if (rand < 0.9) return 5 + Math.random() * 5; // 5.0x - 10.0x (24%)
    return 10 + Math.random() * 40; // 10.0x - 50.0x (10%)
  };

  const createParticles = (x: number, y: number, count: number) => {
    const newParticles = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: Math.random(),
        x,
        y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        life: 1
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
  };

  const startNewGame = () => {
    crashPointRef.current = generateCrashPoint();
    gameTimeRef.current = 0;
    setMultiplier(1.00);
    setGameState('flying');
    setParticles([]);
    
    const animate = () => {
      gameTimeRef.current += 0.016; // ~60fps
      const progress = gameTimeRef.current / 3; // 3 seconds to reach crash point
      const currentMultiplier = 1 + (crashPointRef.current - 1) * Math.pow(progress, 0.8);
      
      if (currentMultiplier >= crashPointRef.current) {
        setMultiplier(crashPointRef.current);
        setGameState('crashed');
        
        // Create explosion particles
        const canvas = canvasRef.current;
        if (canvas) {
          createParticles(canvas.width * 0.8, canvas.height * 0.3, 20);
        }
        
        setTimeout(() => {
          setGameState('waiting');
          setCountdown(5);
        }, 3000);
      } else {
        setMultiplier(currentMultiplier);
        
        // Create trail particles during flight
        if (Math.random() < 0.3) {
          const canvas = canvasRef.current;
          if (canvas) {
            const progress = gameTimeRef.current / 3;
            const x = progress * canvas.width * 0.8;
            const y = canvas.height - (currentMultiplier - 1) * (canvas.height / Math.max(crashPointRef.current, 10));
            createParticles(x, y, 2);
          }
        }
        
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
      
      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, 'rgba(139, 92, 246, 0.05)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.8)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw enhanced grid with glow effect
      ctx.strokeStyle = gameState === 'flying' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(139, 92, 246, 0.1)';
      ctx.lineWidth = 1;
      ctx.shadowColor = ctx.strokeStyle;
      ctx.shadowBlur = 2;
      
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
      ctx.shadowBlur = 0;

      if (gameState === 'flying' || gameState === 'crashed') {
        // Draw enhanced curve with glow
        const progress = Math.min(gameTimeRef.current / 3, 1);
        const points = [];
        
        for (let i = 0; i <= progress * canvas.width; i += 3) {
          const x = i;
          const mult = 1 + (crashPointRef.current - 1) * Math.pow(i / canvas.width, 0.8);
          const y = canvas.height - (mult - 1) * (canvas.height / Math.max(crashPointRef.current, 10));
          points.push({ x, y });
        }

        if (points.length > 1) {
          // Draw glow effect
          ctx.strokeStyle = gameState === 'crashed' ? '#ef4444' : '#10b981';
          ctx.lineWidth = 8;
          ctx.shadowColor = ctx.strokeStyle;
          ctx.shadowBlur = 20;
          ctx.globalAlpha = 0.5;
          
          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y);
          for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
          }
          ctx.stroke();
          
          // Draw main line
          ctx.globalAlpha = 1;
          ctx.lineWidth = 4;
          ctx.shadowBlur = 0;
          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y);
          for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
          }
          ctx.stroke();

          // Draw rocket with trail
          if (points.length > 0) {
            const lastPoint = points[points.length - 1];
            
            // Rocket trail
            if (gameState === 'flying') {
              ctx.fillStyle = 'rgba(251, 191, 36, 0.6)';
              ctx.fillRect(lastPoint.x - 20, lastPoint.y, 20, 3);
              ctx.fillRect(lastPoint.x - 15, lastPoint.y + 3, 15, 2);
              ctx.fillRect(lastPoint.x - 10, lastPoint.y + 5, 10, 1);
            }
            
            // Rocket
            ctx.fillStyle = gameState === 'crashed' ? '#ef4444' : '#fbbf24';
            ctx.font = '28px Arial';
            ctx.fillText('🚀', lastPoint.x - 14, lastPoint.y + 10);
          }
        }
      }

      // Draw particles
      ctx.fillStyle = 'rgba(251, 191, 36, 0.8)';
      particles.forEach(particle => {
        ctx.globalAlpha = particle.life;
        ctx.fillRect(particle.x, particle.y, 3, 3);
      });
      ctx.globalAlpha = 1;
    };

    // Update particles
    const updateParticles = () => {
      setParticles(prev => 
        prev.map(p => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          vy: p.vy + 0.2, // gravity
          life: p.life - 0.02
        })).filter(p => p.life > 0)
      );
    };

    const animateCanvas = () => {
      draw();
      updateParticles();
      requestAnimationFrame(animateCanvas);
    };

    const resizeObserver = new ResizeObserver(draw);
    resizeObserver.observe(canvas);
    animateCanvas();

    return () => resizeObserver.disconnect();
  }, [gameState, multiplier, particles]);

  return (
    <>
      <SoundManager gameState={gameState} multiplier={multiplier} />
      <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-purple-500/20 p-6 h-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-purple-400">🚀 Crash Game</h2>
          <div className="flex items-center space-x-4">
            {gameState === 'waiting' && (
              <div className="bg-yellow-500/20 px-4 py-2 rounded-lg border border-yellow-500/30 animate-pulse">
                <span className="text-yellow-400 font-semibold">⏰ Next round in {countdown}s</span>
              </div>
            )}
            <div className={`px-6 py-3 rounded-lg font-bold text-3xl transition-all duration-300 ${
              gameState === 'crashed' ? 'bg-red-500/20 border-red-500/30 text-red-400 animate-pulse' :
              gameState === 'flying' ? 'bg-green-500/20 border-green-500/30 text-green-400 animate-pulse' :
              'bg-purple-500/20 border-purple-500/30 text-purple-400'
            }`}>
              {multiplier.toFixed(2)}x
              {gameState === 'flying' && multiplier > 2 && (
                <div className="text-xs text-green-300 animate-bounce">🔥 HOT STREAK!</div>
              )}
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
              <div className="bg-red-500/90 text-white px-8 py-4 rounded-xl text-2xl font-bold animate-bounce">
                💥 CRASHED at {crashPointRef.current.toFixed(2)}x!
              </div>
            </div>
          )}
          
          {gameState === 'flying' && multiplier > 5 && (
            <div className="absolute top-4 right-4 animate-pulse">
              <div className="bg-yellow-500/90 text-black px-4 py-2 rounded-lg font-bold">
                🚀 {multiplier.toFixed(2)}x RISING!
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-gray-800/50 rounded-lg p-4 hover:bg-gray-700/50 transition-colors">
            <h3 className="text-sm text-gray-400 mb-2">💰 Your Bet</h3>
            <div className="text-xl font-bold text-white">0.05 BTC</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 hover:bg-gray-700/50 transition-colors">
            <h3 className="text-sm text-gray-400 mb-2">🎯 Potential Win</h3>
            <div className={`text-xl font-bold transition-colors ${
              multiplier > 2 ? 'text-green-400' : 'text-green-400'
            }`}>
              {(0.05 * multiplier).toFixed(4)} BTC
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EnhancedCrashGame;
