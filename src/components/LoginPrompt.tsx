
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Rocket, Coins, Zap } from 'lucide-react';

interface LoginPromptProps {
  onClose?: () => void;
}

const FloatingParticle = ({ delay = 0 }: { delay?: number }) => (
  <div 
    className="absolute w-2 h-2 bg-purple-400 rounded-full animate-pulse opacity-70"
    style={{
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${delay}s`,
      animationDuration: `${2 + Math.random() * 2}s`
    }}
  />
);

const LoginPrompt: React.FC<LoginPromptProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = () => {
    navigate('/login');
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, 300);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50 p-4">
      {/* Floating particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <FloatingParticle key={i} delay={i * 0.2} />
        ))}
      </div>

      <div className={`relative w-full max-w-md transition-all duration-500 transform ${
        isVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
      }`}>
        {/* Glowing border effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-3xl blur-sm opacity-75 animate-pulse"></div>
        
        {/* Main modal */}
        <div className="relative bg-gradient-to-br from-gray-900/95 via-purple-900/95 to-gray-900/95 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-8 text-center overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="absolute top-4 right-8 text-purple-400/20 animate-spin">
              <Coins className="w-8 h-8" />
            </div>
            <div className="absolute bottom-8 left-6 text-cyan-400/20 animate-pulse">
              <Zap className="w-6 h-6" />
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-all duration-200 hover:scale-110 z-10"
          >
            <X className="w-6 h-6" />
          </button>
          
          {/* Animated rocket icon */}
          <div className="relative mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4 animate-pulse">
              <Rocket className="w-10 h-10 text-white animate-bounce" />
            </div>
            {/* Rocket trail effect */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-16 bg-gradient-to-t from-orange-500/60 to-transparent rounded-full blur-sm animate-pulse"></div>
          </div>
          
          {/* Title with gradient text */}
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-4 animate-fade-in">
            Ready to Launch?
          </h2>
          
          {/* Subtitle */}
          <p className="text-gray-300 mb-2 text-lg font-medium">
            Join the ultimate crypto gaming experience
          </p>
          
          {/* Stats showcase */}
          <div className="flex justify-center items-center space-x-6 mb-6 text-sm">
            <div className="flex items-center space-x-1 text-green-400">
              <Coins className="w-4 h-4" />
              <span>50K+ Players</span>
            </div>
            <div className="flex items-center space-x-1 text-cyan-400">
              <Zap className="w-4 h-4" />
              <span>Instant Wins</span>
            </div>
          </div>
          
          {/* Main CTA button */}
          <button
            onClick={handleLogin}
            className="group relative w-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 hover:from-purple-600 hover:via-pink-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl text-lg mb-6 overflow-hidden"
          >
            {/* Button shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            
            <div className="relative flex items-center justify-center space-x-2">
              <Rocket className="w-5 h-5" />
              <span>Launch Game Now!</span>
            </div>
          </button>
          
          {/* Feature list with icons */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-center space-x-3 text-sm text-gray-300">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>⚡ Lightning-fast deposits & withdrawals</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-sm text-gray-300">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span>🛡️ Provably fair & secure gaming</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-sm text-gray-300">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span>🎯 24/7 live support & community</span>
            </div>
          </div>
          
          {/* Footer disclaimer */}
          <div className="text-xs text-gray-500 opacity-75">
            Must be 18+ to play. Gamble responsibly.
          </div>
          
          {/* Animated border pulse */}
          <div className="absolute inset-0 rounded-3xl border-2 border-purple-500/30 animate-pulse pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};

export default LoginPrompt;
