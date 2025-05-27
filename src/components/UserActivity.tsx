
import React, { useState, useEffect } from 'react';

interface Activity {
  id: number;
  user: string;
  type: 'bet' | 'win' | 'loss';
  amount: number;
  multiplier?: number;
  time: string;
}

const UserActivity = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [leaderboard, setLeaderboard] = useState<Array<{user: string, amount: number}>>([]);

  const usernames = [
    "CryptoKing88", "BitMaster", "MoonShot", "DiamondHands", "RocketMan",
    "SatoshiGhost", "WhaleHunter", "LuckySeven", "CashOut", "HighRoller",
    "QuickFingers", "BetSmart", "NightTrader", "CoinFlip", "RiskTaker",
    "BlockchainBoss", "CryptoPunk", "DeFiDealer", "NFTNinja", "ToTheMoon"
  ];

  const generateActivity = (): Activity => {
    const user = usernames[Math.floor(Math.random() * usernames.length)] + Math.floor(Math.random() * 999);
    const amount = parseFloat((Math.random() * 2 + 0.01).toFixed(4));
    const type = Math.random() < 0.6 ? 'bet' : (Math.random() < 0.7 ? 'win' : 'loss');
    
    let multiplier;
    if (type === 'win') {
      multiplier = parseFloat((Math.random() * 10 + 1.1).toFixed(2));
    }

    return {
      id: Date.now() + Math.random(),
      user,
      type,
      amount,
      multiplier,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const generateLeaderboard = () => {
    return Array.from({ length: 10 }, (_, i) => ({
      user: usernames[Math.floor(Math.random() * usernames.length)] + Math.floor(Math.random() * 999),
      amount: parseFloat((Math.random() * 50 + 5).toFixed(4))
    })).sort((a, b) => b.amount - a.amount);
  };

  useEffect(() => {
    // Initialize with some activities
    const initialActivities = Array.from({ length: 8 }, generateActivity);
    setActivities(initialActivities);
    setLeaderboard(generateLeaderboard());

    // Add new activities every 1-3 seconds
    const interval = setInterval(() => {
      const newActivity = generateActivity();
      setActivities(prev => {
        const updated = [newActivity, ...prev];
        return updated.slice(0, 20); // Keep only last 20 activities
      });
    }, Math.random() * 2000 + 1000);

    // Update leaderboard every 30 seconds
    const leaderboardInterval = setInterval(() => {
      setLeaderboard(generateLeaderboard());
    }, 30000);

    return () => {
      clearInterval(interval);
      clearInterval(leaderboardInterval);
    };
  }, []);

  return (
    <div className="space-y-4">
      {/* Recent Activity */}
      <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-purple-500/20 p-4 h-60">
        <h3 className="text-lg font-bold text-purple-400 mb-4">Recent Activity 📊</h3>
        <div className="space-y-2 h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-gray-800">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between text-sm bg-gray-800/50 rounded-lg p-2">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'win' ? 'bg-green-400' :
                  activity.type === 'loss' ? 'bg-red-400' : 'bg-yellow-400'
                }`} />
                <span className="text-gray-300 truncate max-w-20">{activity.user}</span>
              </div>
              <div className="text-right">
                {activity.type === 'bet' && (
                  <div className="text-yellow-400">🎰 {activity.amount} BTC</div>
                )}
                {activity.type === 'win' && (
                  <div className="text-green-400">
                    🎉 {(activity.amount * (activity.multiplier || 1)).toFixed(4)} BTC
                    <div className="text-xs text-gray-400">{activity.multiplier}x</div>
                  </div>
                )}
                {activity.type === 'loss' && (
                  <div className="text-red-400">💥 -{activity.amount} BTC</div>
                )}
                <div className="text-xs text-gray-500">{activity.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-purple-500/20 p-4 h-60">
        <h3 className="text-lg font-bold text-purple-400 mb-4">Top Winners 🏆</h3>
        <div className="space-y-2">
          {leaderboard.slice(0, 8).map((player, index) => (
            <div key={player.user} className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  index === 0 ? 'bg-yellow-500 text-black' :
                  index === 1 ? 'bg-gray-400 text-black' :
                  index === 2 ? 'bg-amber-600 text-white' :
                  'bg-gray-700 text-gray-300'
                }`}>
                  {index + 1}
                </div>
                <span className="text-gray-300 truncate max-w-24">{player.user}</span>
              </div>
              <div className="text-green-400 font-semibold">
                {player.amount.toFixed(4)} BTC
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserActivity;
