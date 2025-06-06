
import React, { useState, useEffect } from 'react';
import ActiveCrashGame from '../components/ActiveCrashGame';
import EnhancedChatSystem from '../components/EnhancedChatSystem';
import UserActivity from '../components/UserActivity';
import OptimizedFloatingCoins from '../components/OptimizedFloatingCoins';
import LoginPrompt from '../components/LoginPrompt';
import Header from '../components/Header';
import { ThemeProvider } from '../hooks/useTheme';

const Index = () => {
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [startTime] = useState(() => Date.now());
  const [hasShownPrompt, setHasShownPrompt] = useState(() => {
    return localStorage.getItem('loginPromptShown') === 'true';
  });

  useEffect(() => {
    if (hasShownPrompt) return;

    const checkTimer = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= 20000) { // 20 seconds
        setShowLoginPrompt(true);
        setHasShownPrompt(true);
        localStorage.setItem('loginPromptShown', 'true');
      }
    };

    const interval = setInterval(checkTimer, 1000);
    return () => clearInterval(interval);
  }, [startTime, hasShownPrompt]);

  const handleCloseLoginPrompt = () => {
    setShowLoginPrompt(false);
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 light:from-slate-50 light:via-blue-50 light:to-indigo-100 text-white dark:text-white light:text-gray-900 relative transition-colors duration-500">
        <OptimizedFloatingCoins />
        
        <Header />
        
        <main className={`min-h-[calc(100vh-60px)] sm:min-h-[calc(100vh-80px)] transition-all duration-500 ${showLoginPrompt ? 'blur-sm pointer-events-none' : ''}`}>
          <div className="px-2 sm:px-4 py-2 sm:py-4">
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-2 sm:gap-4 min-h-[calc(100vh-100px)] sm:min-h-[calc(100vh-120px)]">
              {/* Main Game Area */}
              <div className="xl:col-span-3 order-1">
                <ActiveCrashGame />
              </div>
              
              {/* Sidebar - Mobile Bottom, Desktop Right */}
              <div className="xl:col-span-1 flex flex-col space-y-2 sm:space-y-4 min-h-[300px] sm:min-h-[400px] xl:min-h-[calc(100vh-120px)] order-2">
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
