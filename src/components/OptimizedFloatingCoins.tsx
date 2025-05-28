
import React, { useEffect, useState, useMemo } from 'react';

interface Coin {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  size: number;
  opacity: number;
  symbol: string;
  color: string;
}

const OptimizedFloatingCoins = () => {
  const [coins, setCoins] = useState<Coin[]>([]);

  const coinConfig = useMemo(() => ({
    symbols: ['₿', 'Ξ', '⚡', '💎'],
    colors: ['text-yellow-400', 'text-orange-400', 'text-blue-400', 'text-purple-400'],
    maxCoins: 15, // Reduced for better performance
    spawnRate: 2000 // Slower spawn rate
  }), []);

  const createCoin = (): Coin => ({
    id: Math.random(),
    x: Math.random() * window.innerWidth,
    y: window.innerHeight + 50,
    vx: (Math.random() - 0.5) * 2,
    vy: -Math.random() * 3 - 1,
    rotation: 0,
    size: Math.random() * 20 + 20,
    opacity: Math.random() * 0.4 + 0.3,
    symbol: coinConfig.symbols[Math.floor(Math.random() * coinConfig.symbols.length)],
    color: coinConfig.colors[Math.floor(Math.random() * coinConfig.colors.length)]
  });

  useEffect(() => {
    // Initialize with fewer coins
    const initialCoins = Array.from({ length: 8 }, createCoin);
    setCoins(initialCoins);

    // Optimized animation with fewer updates
    const animate = () => {
      setCoins(prevCoins => {
        return prevCoins.map(coin => ({
          ...coin,
          x: coin.x + coin.vx,
          y: coin.y + coin.vy,
          rotation: coin.rotation + 2,
          vy: coin.vy + 0.02
        })).filter(coin => coin.y > -100);
      });
    };

    // Add new coins less frequently
    const coinInterval = setInterval(() => {
      setCoins(prev => {
        if (prev.length < coinConfig.maxCoins) {
          return [...prev, createCoin()];
        }
        return prev;
      });
    }, coinConfig.spawnRate);

    const animationInterval = setInterval(animate, 100); // 10fps instead of 20fps

    return () => {
      clearInterval(coinInterval);
      clearInterval(animationInterval);
    };
  }, [coinConfig]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {coins.map(coin => (
        <div
          key={coin.id}
          className={`absolute ${coin.color} font-bold select-none transition-transform duration-100`}
          style={{
            left: coin.x,
            top: coin.y,
            fontSize: coin.size,
            opacity: coin.opacity,
            transform: `rotate(${coin.rotation}deg)`,
            textShadow: `0 0 ${coin.size * 0.3}px currentColor`,
            filter: 'brightness(1.2)',
          }}
        >
          {coin.symbol}
        </div>
      ))}
    </div>
  );
};

export default OptimizedFloatingCoins;
