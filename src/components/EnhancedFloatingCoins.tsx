
import React, { useEffect, useState } from 'react';

interface Coin {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  size: number;
  opacity: number;
  symbol: string;
  scale: number;
  pulse: number;
  trail: Array<{x: number, y: number, opacity: number}>;
  color: string;
}

const EnhancedFloatingCoins = () => {
  const [coins, setCoins] = useState<Coin[]>([]);

  const coinSymbols = ['₿', 'Ξ', '₳', '⚡', '💎', '🚀', '🔥', '⭐', '💰', '🎯'];
  const coinColors = [
    'text-yellow-400',
    'text-orange-400', 
    'text-blue-400',
    'text-green-400',
    'text-purple-400',
    'text-pink-400',
    'text-red-400',
    'text-indigo-400'
  ];

  const createCoin = (): Coin => ({
    id: Math.random(),
    x: Math.random() * window.innerWidth,
    y: window.innerHeight + 50,
    vx: (Math.random() - 0.5) * 3,
    vy: -Math.random() * 5 - 2,
    rotation: 0,
    rotationSpeed: (Math.random() - 0.5) * 20,
    size: Math.random() * 30 + 25,
    opacity: Math.random() * 0.6 + 0.4,
    symbol: coinSymbols[Math.floor(Math.random() * coinSymbols.length)],
    scale: 1,
    pulse: 0,
    trail: [],
    color: coinColors[Math.floor(Math.random() * coinColors.length)]
  });

  useEffect(() => {
    // Initialize with more coins
    const initialCoins = Array.from({ length: 30 }, createCoin);
    setCoins(initialCoins);

    // Animation loop
    const animate = () => {
      setCoins(prevCoins => {
        return prevCoins.map(coin => {
          // Update trail with better opacity
          const newTrail = [
            { x: coin.x, y: coin.y, opacity: coin.opacity * 0.5 },
            ...coin.trail.slice(0, 6)
          ].map((point, index) => ({
            ...point,
            opacity: point.opacity * (1 - index * 0.15)
          }));

          return {
            ...coin,
            x: coin.x + coin.vx,
            y: coin.y + coin.vy,
            rotation: coin.rotation + coin.rotationSpeed,
            vy: coin.vy + 0.015, // reduced gravity for slower fall
            pulse: coin.pulse + 0.08,
            scale: 1 + Math.sin(coin.pulse) * 0.2, // more dramatic pulsing
            trail: newTrail
          };
        }).filter(coin => coin.y > -200); // Keep coins longer
      });
    };

    // Add new coins more frequently
    const coinInterval = setInterval(() => {
      setCoins(prev => {
        if (prev.length < 35) {
          return [...prev, createCoin()];
        }
        return prev;
      });
    }, 1200);

    const animationInterval = setInterval(animate, 50);

    return () => {
      clearInterval(coinInterval);
      clearInterval(animationInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {coins.map(coin => (
        <React.Fragment key={coin.id}>
          {/* Enhanced coin trail */}
          {coin.trail.map((point, index) => (
            <div
              key={`trail-${coin.id}-${index}`}
              className={`absolute ${coin.color} font-bold select-none`}
              style={{
                left: point.x,
                top: point.y,
                fontSize: coin.size * (0.9 - index * 0.08),
                opacity: point.opacity,
                transform: `scale(${0.9 - index * 0.08})`,
                filter: 'blur(1px)',
                textShadow: `0 0 ${coin.size * 0.3}px currentColor`
              }}
            >
              {coin.symbol}
            </div>
          ))}
          
          {/* Main enhanced coin */}
          <div
            className={`absolute ${coin.color} font-bold select-none transition-all duration-100`}
            style={{
              left: coin.x,
              top: coin.y,
              fontSize: coin.size,
              opacity: coin.opacity,
              transform: `rotate(${coin.rotation}deg) scale(${coin.scale})`,
              textShadow: `
                0 0 ${coin.size * 0.4}px currentColor,
                0 0 ${coin.size * 0.8}px currentColor,
                0 0 ${coin.size * 1.2}px rgba(255, 255, 255, 0.3)
              `,
              filter: `brightness(${1.2 + Math.sin(coin.pulse) * 0.4}) contrast(1.2)`,
              WebkitTextStroke: `1px rgba(255, 255, 255, 0.3)`,
            }}
          >
            {coin.symbol}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default EnhancedFloatingCoins;
