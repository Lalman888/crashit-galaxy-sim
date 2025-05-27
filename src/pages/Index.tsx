
import React, { useState, useEffect } from 'react';
import CrashGame from '../components/CrashGame';
import ChatSystem from '../components/ChatSystem';
import UserActivity from '../components/UserActivity';
import FloatingCoins from '../components/FloatingCoins';
import LoginPrompt from '../components/LoginPrompt';
import Header from '../components/Header';

const Index = () => {
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    // Show login prompt after 20 seconds
    const timer = setTimeout(() => {
      setShowLoginPrompt(true);
    }, 20000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white overflow-hidden relative">
      <FloatingCoins />
      
      <Header />
      
      <main className={`transition-all duration-500 ${showLoginPrompt ? 'blur-sm' : ''}`}>
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-120px)]">
            {/* Main Game Area */}
            <div className="lg:col-span-3">
              <CrashGame />
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-4">
              <UserActivity />
              <ChatSystem />
            </div>
          </div>
        </div>
      </main>

      {showLoginPrompt && <LoginPrompt />}
    </div>
  );
};

export default Index;
