
import React, { useState, useEffect, useRef } from 'react';

const ChatSystem = () => {
  const [messages, setMessages] = useState<Array<{id: number, user: string, message: string, time: string}>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageIndex = useRef(0);

  const chatMessages = [
    // English messages
    { user: "CryptoKing88", message: "Just won 5.2x! 🚀🚀🚀", lang: "en" },
    { user: "BitMaster", message: "Betting 0.1 BTC this round", lang: "en" },
    { user: "MoonShot", message: "10x incoming! I can feel it", lang: "en" },
    { user: "DiamondHands", message: "HODL and bet! 💎", lang: "en" },
    { user: "RocketMan", message: "Crashed at 1.2x... again 😭", lang: "en" },
    
    // Spanish messages
    { user: "ElMatador", message: "¡Vamos por el 20x! 🔥", lang: "es" },
    { user: "CriptoLoco", message: "Apostar 0.05 BTC", lang: "es" },
    { user: "LunaLlena", message: "¡Ganê 3.4x! ¡Increíble!", lang: "es" },
    { user: "ToroDorado", message: "Esta ronda será épica", lang: "es" },
    { user: "AguiReal", message: "Al infinito y más allá 🚀", lang: "es" },
    
    // Russian messages
    { user: "МедведьБык", message: "Ставлю всё на 15x! 💪", lang: "ru" },
    { user: "КриптоЦарь", message: "Выиграл 0.8 BTC! 🎉", lang: "ru" },
    { user: "ЛунныйВолк", message: "До луны! 🌙", lang: "ru" },
    { user: "ЗолотойОрёл", message: "Удача со мной сегодня", lang: "ru" },
    { user: "КосмосРакета", message: "Крашнулось на 2.1x 😤", lang: "ru" },
    
    // Chinese messages
    { user: "月亮王", message: "下注 0.2 BTC！🚀", lang: "cn" },
    { user: "金龙", message: "赢了 8.5 倍！太棒了！", lang: "cn" },
    { user: "火箭侠", message: "这轮要爆发了", lang: "cn" },
    { user: "钻石手", message: "坚持到底！💎", lang: "cn" },
    { user: "比特币王", message: "冲向月球！🌙", lang: "cn" },
    
    // More English messages for variety
    { user: "SatoshiGhost", message: "Big bet coming up! 0.3 BTC", lang: "en" },
    { user: "WhaleHunter", message: "Crashed at 1.05x... brutal", lang: "en" },
    { user: "LuckySeven", message: "7.77x would be perfect right now", lang: "en" },
    { user: "CashOut", message: "Always cash out at 2x, safe play", lang: "en" },
    { user: "HighRoller", message: "Going for 50x or bust! 🎲", lang: "en" },
    { user: "QuickFingers", message: "Cashed out at 4.2x just in time!", lang: "en" },
    { user: "BetSmart", message: "Patience is key in this game", lang: "en" },
    { user: "NightTrader", message: "Night sessions are the best 🌙", lang: "en" },
    { user: "CoinFlip", message: "Heads or tails? Let's go! 🪙", lang: "en" },
    { user: "RiskTaker", message: "No risk, no reward! Betting big", lang: "en" },
    
    // Additional Spanish
    { user: "VegasLoco", message: "¡Qué suerte más increíble!", lang: "es" },
    { user: "TiburónBTC", message: "Los tiburones siempre ganan", lang: "es" },
    { user: "RayoVeloz", message: "Rápido como un rayo ⚡", lang: "es" },
    
    // Additional Russian
    { user: "СибирскийТигр", message: "Сибирская мощь! 🐅", lang: "ru" },
    { user: "БиткойнБогатырь", message: "За победу! 🏆", lang: "ru" },
    
    // Additional Chinese
    { user: "龙王", message: "龙的力量！🐉", lang: "cn" },
    { user: "凤凰", message: "浴火重生！🔥", lang: "cn" },
    
    // Reaction messages
    { user: "ReactFast", message: "WOOOOO! What a round!", lang: "en" },
    { user: "EmojiBomb", message: "🚀🚀🚀🚀🚀", lang: "en" },
    { user: "ExcitedPlayer", message: "OMG OMG OMG!!!", lang: "en" },
    { user: "CelebrationTime", message: "🎉🎊🎉🎊", lang: "en" },
    { user: "FireEmojis", message: "🔥🔥🔥🔥🔥", lang: "en" },
    
    // Betting announcements
    { user: "BigBetBen", message: "Betting 1 BTC this round! 💰", lang: "en" },
    { user: "SmallBets", message: "Small but steady: 0.01 BTC", lang: "en" },
    { user: "AllIn", message: "ALL IN! Everything on this one!", lang: "en" },
    { user: "ConservativePlayer", message: "Playing it safe with 0.02 BTC", lang: "en" },
    
    // Win announcements
    { user: "WinnerCircle", message: "Just hit 12.5x! Best day ever!", lang: "en" },
    { user: "LuckyStrike", message: "Lightning doesn't strike twice... or does it? ⚡", lang: "en" },
    { user: "JackpotJoe", message: "JACKPOT! 25x multiplier!", lang: "en" },
    
    // Crash reactions
    { user: "CrashVictim", message: "Noooo! So close to 5x 😭", lang: "en" },
    { user: "AlmostThere", message: "1.01x crash... seriously?!", lang: "en" },
    { user: "BadLuckBrian", message: "My luck today... 📉", lang: "en" },
    
    // Strategy talk
    { user: "StrategyGuru", message: "Always set a target and stick to it", lang: "en" },
    { user: "MathWiz", message: "Probability suggests... ah, who cares! YOLO!", lang: "en" },
    { user: "PatientPlayer", message: "Waiting for the perfect moment...", lang: "en" },
    
    // General excitement
    { user: "HypeMan", message: "This is it! I can feel the big one coming!", lang: "en" },
    { user: "EnergyBooster", message: "Energy through the roof! ⚡⚡⚡", lang: "en" },
    { user: "PositiveVibes", message: "Good vibes only! ✨", lang: "en" },
    { user: "Champions", message: "Champions never quit! 🏆", lang: "en" },
    { user: "LetsGo", message: "LET'S GOOOOO! 🚀", lang: "en" },
    
    // More international variety
    { user: "GlobalPlayer", message: "Players from around the world! 🌍", lang: "en" },
    { user: "TimeZoneWarrior", message: "3 AM grinding session! 🌙", lang: "en" },
    { user: "WeekendVibes", message: "Weekend gambling hits different 😎", lang: "en" },
    
    // Additional languages simulation
    { user: "FrenchPlayer", message: "Bonne chance à tous! 🍀", lang: "fr" },
    { user: "GermanGamer", message: "Viel Glück! 🎰", lang: "de" },
    { user: "ItalianStallion", message: "Andiamo! 🇮🇹", lang: "it" },
    { user: "BrazilianBeast", message: "Vamos Brasil! 🇧🇷", lang: "pt" },
    { user: "DutchDiamond", message: "Veel succes! 💎", lang: "nl" },
    
    // Crypto-specific terms
    { user: "HODLer", message: "HODL the line! 💪", lang: "en" },
    { user: "ToTheMoon", message: "To the moon! 🌙🚀", lang: "en" },
    { user: "DiamondHands2", message: "Diamond hands never fold 💎🙌", lang: "en" },
    { user: "PaperHands", message: "Paper hands cashed out too early 📄", lang: "en" },
    { user: "WhaleAlert", message: "Whale incoming! 🐋", lang: "en" },
    { user: "SatoshiSpirit", message: "In Satoshi we trust 🙏", lang: "en" },
    { user: "BlockchainBoss", message: "Blockchain never lies! ⛓️", lang: "en" },
    { user: "CryptoPunk", message: "Punk attitude, crypto results 😎", lang: "en" },
    { user: "DeFiDealer", message: "DeFi is the future! 🔮", lang: "en" },
    { user: "NFTNinja", message: "NFTs and crash games - perfect combo! 🎨", lang: "en" }
  ];

  const usernames = [
    "CryptoKing", "BitMaster", "MoonShot", "DiamondHands", "RocketMan",
    "SatoshiGhost", "WhaleHunter", "LuckySeven", "CashOut", "HighRoller",
    "QuickFingers", "BetSmart", "NightTrader", "CoinFlip", "RiskTaker"
  ];

  const generateRandomMessage = () => {
    const randomIndex = Math.floor(Math.random() * chatMessages.length);
    const baseMessage = chatMessages[randomIndex];
    
    // Sometimes generate bet announcements
    if (Math.random() < 0.3) {
      const username = usernames[Math.floor(Math.random() * usernames.length)];
      const amount = (Math.random() * 0.5 + 0.01).toFixed(3);
      return {
        user: username + Math.floor(Math.random() * 999),
        message: `Betting ${amount} BTC! 🎰`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    }
    
    return {
      user: baseMessage.user + Math.floor(Math.random() * 99),
      message: baseMessage.message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  useEffect(() => {
    // Add initial messages
    const initialMessages = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      ...generateRandomMessage()
    }));
    setMessages(initialMessages);

    // Add new messages every 2-5 seconds
    const interval = setInterval(() => {
      const newMessage = {
        id: messageIndex.current++,
        ...generateRandomMessage()
      };
      
      setMessages(prev => {
        const updated = [...prev, newMessage];
        return updated.slice(-50); // Keep only last 50 messages
      });
    }, Math.random() * 3000 + 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-purple-500/20 p-4 h-80">
      <h3 className="text-lg font-bold text-purple-400 mb-4">Live Chat 💬</h3>
      <div className="h-64 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-gray-800">
        {messages.map((msg) => (
          <div key={msg.id} className="text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">{msg.time}</span>
              <span className="font-semibold text-purple-300">{msg.user}:</span>
            </div>
            <div className="text-gray-300 ml-2 break-words">{msg.message}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatSystem;
