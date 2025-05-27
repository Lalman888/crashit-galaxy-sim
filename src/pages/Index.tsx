
import React, { useState, useEffect } from 'react';
import ActiveCrashGame from '../components/ActiveCrashGame';
import EnhancedChatSystem from '../components/EnhancedChatSystem';
import UserActivity from '../components/UserActivity';
import EnhancedFloatingCoins from '../components/EnhancedFloatingCoins';
import LoginPrompt from '../components/LoginPrompt';
import Header from '../components/Header';
import { ThemeProvider } from '../hooks/useTheme';

const Index = () => {
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [loginPromptShown, setLoginPromptShown] = useState(false);

  useEffect(() => {
    // Only show login prompt once after 20 seconds
    if (!loginPromptShown) {
      const timer = setTimeout(() => {
        setShowLoginPrompt(true);
        setLoginPromptShown(true);
      }, 20000);

      return () => clearTimeout(timer);
    }
  }, [loginPromptShown]);

  const handleCloseLoginPrompt = () => {
    setShowLoginPrompt(false);
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white overflow-hidden relative transition-colors duration-500">
        <EnhancedFloatingCoins />
        
        <Header />
        
        <main className={`transition-all duration-500 ${showLoginPrompt ? 'blur-sm pointer-events-none' : ''}`}>
          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[calc(100vh-120px)]">
              {/* Main Game Area */}
              <div className="lg:col-span-3 flex flex-col">
                <ActiveCrashGame />
              </div>
              
              {/* Sidebar */}
              <div className="lg:col-span-1 flex flex-col space-y-4 max-h-[calc(100vh-120px)]">
                <div className="flex-shrink-0">
                  <UserActivity />
                </div>
                <div className="flex-1 min-h-0">
                  <EnhancedChatSystem />
                </div>
              </div>
            </div>
          </div>
        </main>

        {showLoginPrompt && (
          <LoginPrompt onClose={handleCloseLoginPrompt} />
        )}
      </div>
    </ThemeProvider>
  );
};

export default Index;
