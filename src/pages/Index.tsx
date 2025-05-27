
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

  useEffect(() => {
    // Show login prompt after 20 seconds
    const timer = setTimeout(() => {
      setShowLoginPrompt(true);
    }, 20000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 light:from-gray-100 light:via-purple-100 light:to-gray-100 text-white dark:text-white light:text-gray-900 overflow-hidden relative transition-colors duration-500">
        <EnhancedFloatingCoins />
        
        <Header />
        
        <main className={`transition-all duration-500 ${showLoginPrompt ? 'blur-sm' : ''}`}>
          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-120px)]">
              {/* Main Game Area */}
              <div className="lg:col-span-3">
                <ActiveCrashGame />
              </div>
              
              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-4">
                <UserActivity />
                <EnhancedChatSystem />
              </div>
            </div>
          </div>
        </main>

        {showLoginPrompt && <LoginPrompt />}
      </div>
    </ThemeProvider>
  );
};

export default Index;
