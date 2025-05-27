
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
}

const EnhancedFloatingCoins = () => {
  const [coins, setCoins] = useState<Coin[]>([]);

  const coinSymbols = ['₿', 'Ξ', '₳', '⚡', '💎', '🚀', '🔥', '⭐', '💰', '🎯'];

  const createCoin = (): Coin => ({
    id: Math.random(),
    x: Math.random() * window.innerWidth,
    y: window.innerHeight + 50,
    vx: (Math.random() - 0.5) * 2,
    vy: -Math.random() * 4 - 1,
    rotation: 0,
    rotationSpeed: (Math.random() - 0.5) * 15,
    size: Math.random() * 25 + 20,
    opacity: Math.random() * 0.4 + 0.2,
    symbol: coinSymbols[Math.floor(Math.random() * coinSymbols.length)],
    scale: 1,
    pulse: 0,
    trail: []
  });

  useEffect(() => {
    // Initialize with some coins
    const initialCoins = Array.from({ length: 20 }, createCoin);
    setCoins(initialCoins);

    // Animation loop
    const animate = () => {
      setCoins(prevCoins => {
        return prevCoins.map(coin => {
          // Update trail
          const newTrail = [
            { x: coin.x, y: coin.y, opacity: coin.opacity * 0.3 },
            ...coin.trail.slice(0, 4)
          ].map((point, index) => ({
            ...point,
            opacity: point.opacity * (1 - index * 0.2)
          }));

          return {
            ...coin,
            x: coin.x + coin.vx,
            y: coin.y + coin.vy,
            rotation: coin.rotation + coin.rotationSpeed,
            vy: coin.vy + 0.02, // gravity
            pulse: coin.pulse + 0.1,
            scale: 1 + Math.sin(coin.pulse) * 0.1, // pulsing effect
            trail: newTrail
          };
        }).filter(coin => coin.y > -150); // Remove coins that are too high
      });
    };

    // Add new coins periodically
    const coinInterval = setInterval(() => {
      setCoins(prev => {
        if (prev.length < 25) {
          return [...prev, createCoin()];
        }
        return prev;
      });
    }, 1500);

    const animationInterval = setInterval(animate, 60);

    return () => {
      clearInterval(coinInterval);
      clearInterval(animationInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {coins.map(coin => (
        <React.Fragment key={coin.id}>
          {/* Coin trail */}
          {coin.trail.map((point, index) => (
            <div
              key={`trail-${coin.id}-${index}`}
              className="absolute text-yellow-400/50 font-bold select-none"
              style={{
                left: point.x,
                top: point.y,
                fontSize: coin.size * 0.8,
                opacity: point.opacity,
                transform: `scale(${0.8 - index * 0.1})`,
                filter: 'blur(1px)'
              }}
            >
              {coin.symbol}
            </div>
          ))}
          
          {/* Main coin */}
          <div
            className="absolute text-yellow-400 font-bold select-none transition-transform duration-100"
            style={{
              left: coin.x,
              top: coin.y,
              fontSize: coin.size,
              opacity: coin.opacity,
              transform: `rotate(${coin.rotation}deg) scale(${coin.scale})`,
              textShadow: `0 0 ${coin.size * 0.5}px rgba(251, 191, 36, 0.8), 0 0 ${coin.size}px rgba(251, 191, 36, 0.4)`,
              filter: `brightness(${1 + Math.sin(coin.pulse) * 0.3})`
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
