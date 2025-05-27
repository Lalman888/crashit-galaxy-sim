import React, { useState, useEffect, useRef } from 'react';

interface ChatMessage {
  id: number;
  user: string;
  message: string;
  time: string;
  avatar: string;
  isTyping?: boolean;
}

const EnhancedChatSystem = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageIndex = useRef(0);

  const avatars = ['👤', '🎮', '💎', '🚀', '⚡', '🔥', '💰', '🎯', '🌟', '💫', '🎲', '🃏'];

  const chatMessages = [
    // Enhanced English messages
    { user: "CryptoKing88", message: "Just won 5.2x! 🚀🚀🚀", lang: "en" },
    { user: "BitMaster", message: "Betting 0.1 BTC this round 💰", lang: "en" },
    { user: "MoonShot", message: "10x incoming! I can feel it 🌙", lang: "en" },
    { user: "DiamondHands", message: "HODL and bet! 💎🙌", lang: "en" },
    { user: "RocketMan", message: "Crashed at 1.2x... again 😭", lang: "en" },
    { user: "WhaleAlert", message: "Big whale bet: 2.5 BTC! 🐋", lang: "en" },
    { user: "LuckyStrike", message: "Lightning strikes twice! ⚡⚡", lang: "en" },
    { user: "NightTrader", message: "Night sessions are the best 🌙✨", lang: "en" },
    
    // Spanish messages
    { user: "ElMatador", message: "¡Vamos por el 20x! 🔥", lang: "es" },
    { user: "CriptoLoco", message: "Apostar 0.05 BTC 🎰", lang: "es" },
    { user: "LunaLlena", message: "¡Ganê 3.4x! ¡Increíble! 🎉", lang: "es" },
    { user: "ToroDorado", message: "Esta ronda será épica 🐂", lang: "es" },
    { user: "AguiReal", message: "Al infinito y más allá 🚀", lang: "es" },
    
    // Russian messages
    { user: "МедведьБык", message: "Ставлю всё на 15x! 💪", lang: "ru" },
    { user: "КриптоЦарь", message: "Выиграл 0.8 BTC! 🎉", lang: "ru" },
    { user: "ЛунныйВолк", message: "До луны! 🌙🚀", lang: "ru" },
    { user: "ЗолотойОрёл", message: "Удача со мной сегодня ⭐", lang: "ru" },
    
    // Chinese messages
    { user: "月亮王", message: "下注 0.2 BTC！🚀", lang: "cn" },
    { user: "金龙", message: "赢了 8.5 倍！太棒了！🐉", lang: "cn" },
    { user: "火箭侠", message: "这轮要爆发了 🔥", lang: "cn" },
    { user: "钻石手", message: "坚持到底！💎", lang: "cn" },
    
    // More reaction messages
    { user: "ReactFast", message: "WOOOOO! What a round! 🎉🎊", lang: "en" },
    { user: "EmojiBomb", message: "🚀🚀🚀🚀🚀🔥🔥🔥", lang: "en" },
    { user: "Celebration", message: "🎉🎊✨💫⭐🌟", lang: "en" },
    { user: "HypeMan", message: "THIS IS IT! BIG ONE COMING! 📈", lang: "en" },
    { user: "LetsGo", message: "LET'S GOOOOO! 🚀🌙💎", lang: "en" },
  ];

  const getRandomAvatar = () => avatars[Math.floor(Math.random() * avatars.length)];

  const generateRandomMessage = (): Omit<ChatMessage, 'id'> => {
    const randomIndex = Math.floor(Math.random() * chatMessages.length);
    const baseMessage = chatMessages[randomIndex];
    
    // Sometimes generate bet announcements
    if (Math.random() < 0.3) {
      const amount = (Math.random() * 0.5 + 0.01).toFixed(3);
      const betMessages = [
        `Betting ${amount} BTC! 🎰`,
        `All in ${amount} BTC! 💪`,
        `${amount} BTC on this round 🎯`,
        `Let's go ${amount} BTC! 🚀`
      ];
      return {
        user: baseMessage.user + Math.floor(Math.random() * 999),
        message: betMessages[Math.floor(Math.random() * betMessages.length)],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: getRandomAvatar()
      };
    }
    
    return {
      user: baseMessage.user + Math.floor(Math.random() * 99),
      message: baseMessage.message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: getRandomAvatar()
    };
  };

  const showTypingIndicator = (username: string) => {
    setTypingUsers(prev => [...prev, username]);
    setTimeout(() => {
      setTypingUsers(prev => prev.filter(u => u !== username));
    }, 2000 + Math.random() * 1000);
  };

  useEffect(() => {
    // Add initial messages
    const initialMessages = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      ...generateRandomMessage()
    }));
    setMessages(initialMessages);

    // Add new messages every 2-4 seconds
    const interval = setInterval(() => {
      const messageData = generateRandomMessage();
      
      // Show typing indicator before message
      if (Math.random() < 0.4) {
        showTypingIndicator(messageData.user);
        setTimeout(() => {
          const newMessage = {
            id: messageIndex.current++,
            ...messageData
          };
          
          setMessages(prev => {
            const updated = [...prev, newMessage];
            return updated.slice(-50); // Keep only last 50 messages
          });
        }, 1500 + Math.random() * 1000);
      } else {
        const newMessage = {
          id: messageIndex.current++,
          ...messageData
        };
        
        setMessages(prev => {
          const updated = [...prev, newMessage];
          return updated.slice(-50);
        });
      }
    }, Math.random() * 2000 + 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-purple-500/20 p-4 h-80">
      <h3 className="text-lg font-bold text-purple-400 mb-4 flex items-center">
        💬 Live Chat 
        <span className="ml-2 text-xs bg-green-500/20 px-2 py-1 rounded-full text-green-400">
          🟢 {Math.floor(Math.random() * 500 + 1200)} online
        </span>
      </h3>
      <div className="h-64 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-gray-800">
        {messages.map((msg) => (
          <div key={msg.id} className="text-sm hover:bg-gray-800/30 rounded p-1 transition-colors">
            <div className="flex items-center space-x-2">
              <span className="text-lg">{msg.avatar}</span>
              <span className="text-xs text-gray-500">{msg.time}</span>
              <span className="font-semibold text-purple-300">{msg.user}:</span>
            </div>
            <div className="text-gray-300 ml-6 break-words">{msg.message}</div>
          </div>
        ))}
        
        {typingUsers.map((user) => (
          <div key={user} className="text-sm italic text-gray-400 ml-6 animate-pulse">
            <span className="text-lg">{getRandomAvatar()}</span>
            <span className="ml-2">{user} is typing...</span>
            <span className="animate-bounce ml-1">●●●</span>
          </div>
        ))}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default EnhancedChatSystem;
