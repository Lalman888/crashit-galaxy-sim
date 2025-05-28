
import React from 'react';
import { Rocket, Clock, AlertTriangle } from 'lucide-react';

interface GameStatusProps {
  gamePhase: 'waiting' | 'running' | 'crashed';
  countdown: number;
}

const GameStatus: React.FC<GameStatusProps> = ({ gamePhase, countdown }) => {
  const getStatusConfig = () => {
    switch (gamePhase) {
      case 'waiting':
        return {
          icon: Clock,
          text: `Starting in ${countdown}s`,
          bgColor: 'bg-yellow-500/20',
          borderColor: 'border-yellow-500/30',
          textColor: 'text-yellow-400',
          animation: 'animate-pulse'
        };
      case 'running':
        return {
          icon: Rocket,
          text: '🚀 FLYING',
          bgColor: 'bg-green-500/20',
          borderColor: 'border-green-500/30',
          textColor: 'text-green-400',
          animation: 'animate-pulse'
        };
      case 'crashed':
        return {
          icon: AlertTriangle,
          text: '💥 CRASHED',
          bgColor: 'bg-red-500/20',
          borderColor: 'border-red-500/30',
          textColor: 'text-red-400',
          animation: 'animate-bounce'
        };
      default:
        return {
          icon: Clock,
          text: 'Waiting...',
          bgColor: 'bg-gray-500/20',
          borderColor: 'border-gray-500/30',
          textColor: 'text-gray-400',
          animation: ''
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className={`${config.bgColor} px-4 py-2 rounded-lg border ${config.borderColor} ${config.animation} flex items-center space-x-2`}>
      <Icon className={`w-4 h-4 ${config.textColor}`} />
      <span className={`${config.textColor} font-semibold text-sm sm:text-base`}>
        {config.text}
      </span>
    </div>
  );
};

export default GameStatus;
