
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, LogIn } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    // Simulate login process
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl animate-pulse">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              CrashIt.io
            </h1>
          </div>
          <p className="text-gray-400">Join the ultimate crypto crash game</p>
        </div>

        <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-purple-500/20 p-8">
          <div className="flex mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                isLogin
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ml-2 ${
                !isLogin
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="text-6xl mb-4">🎮</div>
              <h2 className="text-2xl font-bold text-white">
                {isLogin ? 'Welcome Back!' : 'Join the Action!'}
              </h2>
              <p className="text-gray-300">
                {isLogin 
                  ? 'Ready to continue your winning streak?' 
                  : 'Start your crypto gambling journey today!'
                }
              </p>
            </div>

            <div className="space-y-3 text-sm text-gray-400">
              <p className="flex items-center justify-center">
                <span className="text-green-400 mr-2">✅</span>
                Instant deposits & withdrawals
              </p>
              <p className="flex items-center justify-center">
                <span className="text-green-400 mr-2">✅</span>
                Provably fair gaming
              </p>
              <p className="flex items-center justify-center">
                <span className="text-green-400 mr-2">✅</span>
                24/7 live chat support
              </p>
              <p className="flex items-center justify-center">
                <span className="text-green-400 mr-2">✅</span>
                {Math.floor(Math.random() * 1000 + 3000)}+ players online
              </p>
            </div>

            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 text-lg disabled:opacity-50 disabled:transform-none flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>{isLogin ? 'Login & Play' : 'Sign Up & Play'} 🚀</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
            >
              ← Back to Demo
            </button>
          </div>

          <div className="mt-6 text-xs text-gray-500 text-center space-y-1">
            <p>By continuing, you agree to our Terms of Service</p>
            <p>Must be 18+ to play. Please gamble responsibly.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
