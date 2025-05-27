
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
  const [loginPromptShown, setLoginPromptShown] = useState(() => {
    return localStorage.getItem('loginPromptShown') === 'true';
  });

  useEffect(() => {
    if (!loginPromptShown) {
      const timer = setTimeout(() => {
        setShowLoginPrompt(true);
        setLoginPromptShown(true);
        localStorage.setItem('loginPromptShown', 'true');
      }, 20000);

      return () => clearTimeout(timer);
    }
  }, [loginPromptShown]);

  const handleCloseLoginPrompt = () => {
    setShowLoginPrompt(false);
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 light:from-slate-50 light:via-blue-50 light:to-indigo-100 text-white dark:text-white light:text-gray-900 relative transition-colors duration-500">
        <EnhancedFloatingCoins />
        
        <Header />
        
        <main className={`min-h-[calc(100vh-80px)] transition-all duration-500 ${showLoginPrompt ? 'blur-sm pointer-events-none' : ''}`}>
          <div className="px-4 py-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 min-h-[calc(100vh-120px)]">
              {/* Main Game Area */}
              <div className="lg:col-span-3">
                <ActiveCrashGame />
              </div>
              
              {/* Sidebar */}
              <div className="lg:col-span-1 flex flex-col space-y-4 min-h-[calc(100vh-120px)]">
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
