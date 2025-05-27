
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

interface LoginPromptProps {
  onClose?: () => void;
}

const LoginPrompt: React.FC<LoginPromptProps> = ({ onClose }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-purple-900 to-gray-900 p-8 rounded-3xl border border-purple-500/30 text-center max-w-md mx-4 animate-scale-in relative">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="text-6xl mb-4">🚀</div>
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready to Play for Real?
        </h2>
        <p className="text-gray-300 mb-6 text-lg">
          Join thousands of players and start winning crypto!
        </p>
        
        <div className="space-y-4">
          <button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 text-lg"
          >
            🎮 Log in to Play Online!
          </button>
          
          <div className="text-sm text-gray-400">
            <p>✅ Instant deposits & withdrawals</p>
            <p>✅ Provably fair gaming</p>
            <p>✅ 24/7 live chat support</p>
          </div>
        </div>
        
        <div className="mt-6 text-xs text-gray-500">
          Must be 18+ to play. Please gamble responsibly.
        </div>
      </div>
    </div>
  );
};

export default LoginPrompt;
