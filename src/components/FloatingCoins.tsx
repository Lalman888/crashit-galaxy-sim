
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
}

const FloatingCoins = () => {
  const [coins, setCoins] = useState<Coin[]>([]);

  const coinSymbols = ['₿', 'Ξ', '₳', '⚡', '💎', '🚀'];

  const createCoin = (): Coin => ({
    id: Math.random(),
    x: Math.random() * window.innerWidth,
    y: window.innerHeight + 50,
    vx: (Math.random() - 0.5) * 2,
    vy: -Math.random() * 3 - 1,
    rotation: 0,
    rotationSpeed: (Math.random() - 0.5) * 10,
    size: Math.random() * 20 + 15,
    opacity: Math.random() * 0.3 + 0.1,
    symbol: coinSymbols[Math.floor(Math.random() * coinSymbols.length)]
  });

  useEffect(() => {
    // Initialize with some coins
    const initialCoins = Array.from({ length: 15 }, createCoin);
    setCoins(initialCoins);

    // Animation loop
    const animate = () => {
      setCoins(prevCoins => {
        return prevCoins.map(coin => ({
          ...coin,
          x: coin.x + coin.vx,
          y: coin.y + coin.vy,
          rotation: coin.rotation + coin.rotationSpeed,
          vy: coin.vy + 0.02 // gravity
        })).filter(coin => coin.y > -100); // Remove coins that are too high
      });
    };

    // Add new coins periodically
    const coinInterval = setInterval(() => {
      setCoins(prev => {
        if (prev.length < 20) {
          return [...prev, createCoin()];
        }
        return prev;
      });
    }, 2000);

    const animationInterval = setInterval(animate, 50);

    return () => {
      clearInterval(coinInterval);
      clearInterval(animationInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {coins.map(coin => (
        <div
          key={coin.id}
          className="absolute text-yellow-400 font-bold select-none"
          style={{
            left: coin.x,
            top: coin.y,
            fontSize: coin.size,
            opacity: coin.opacity,
            transform: `rotate(${coin.rotation}deg)`,
            textShadow: '0 0 10px rgba(251, 191, 36, 0.5)'
          }}
        >
          {coin.symbol}
        </div>
      ))}
    </div>
  );
};

export default FloatingCoins;
