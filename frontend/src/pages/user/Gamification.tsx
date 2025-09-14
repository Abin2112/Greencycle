import React from 'react';
import { Trophy, Award, Target, Users, Crown, Medal } from 'lucide-react';
import { motion } from 'framer-motion';

const Gamification: React.FC = () => {
  const userStats = {
    points: 1250,
    level: 5,
    rank: 23,
    totalUsers: 1847
  };

  const badges = [
    { id: 1, name: 'Eco Warrior', description: 'Uploaded 10+ devices', icon: Award, earned: true, rarity: 'common' },
    { id: 2, name: 'Green Pioneer', description: 'First device upload', icon: Trophy, earned: true, rarity: 'common' },
    { id: 3, name: 'Impact Maker', description: 'Saved 1000L+ water', icon: Target, earned: true, rarity: 'rare' },
    { id: 4, name: 'Community Leader', description: 'Top 10% in leaderboard', icon: Crown, earned: false, rarity: 'epic' },
    { id: 5, name: 'Sustainability Champion', description: 'Recycled 50+ devices', icon: Medal, earned: false, rarity: 'legendary' }
  ];

  const challenges = [
    { id: 1, title: 'Weekend Warrior', description: 'Upload 3 devices this weekend', progress: 2, target: 3, reward: 150, timeLeft: '2 days' },
    { id: 2, title: 'Water Saver', description: 'Save 500L of water', progress: 320, target: 500, reward: 200, timeLeft: '1 week' },
    { id: 3, title: 'Community Goal', description: 'Help reach 1000 devices community-wide', progress: 847, target: 1000, reward: 300, timeLeft: '3 days' }
  ];

  const leaderboard = [
    { rank: 1, name: 'Alex Johnson', points: 2840, devices: 28 },
    { rank: 2, name: 'Sarah Chen', points: 2650, devices: 25 },
    { rank: 3, name: 'Mike Rodriguez', points: 2420, devices: 23 },
    { rank: 23, name: 'You', points: 1250, devices: 12, isCurrentUser: true },
  ];

  const rarityColors = {
    common: 'from-gray-400 to-gray-600',
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-purple-400 to-purple-600',
    legendary: 'from-amber-400 to-amber-600'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h1 className="text-3xl font-display font-bold text-neutral-800 mb-4">
          Gamification Hub
        </h1>
        <p className="text-lg text-neutral-600">
          Compete, achieve, and make an impact with the community
        </p>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary-600 mb-2">{userStats.points}</div>
          <div className="text-neutral-600">Green Points</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary-600 mb-2">Level {userStats.level}</div>
          <div className="text-neutral-600">Current Level</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary-600 mb-2">#{userStats.rank}</div>
          <div className="text-neutral-600">Global Rank</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary-600 mb-2">{userStats.totalUsers}</div>
          <div className="text-neutral-600">Total Users</div>
        </div>
      </div>

      {/* Active Challenges */}
      <div className="card">
        <h2 className="text-2xl font-display font-semibold text-neutral-800 mb-6">
          Active Challenges
        </h2>
        <div className="space-y-4">
          {challenges.map((challenge) => (
            <div key={challenge.id} className="p-4 border border-neutral-200 rounded-xl">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-neutral-800">{challenge.title}</h3>
                  <p className="text-neutral-600 text-sm">{challenge.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-primary-600">+{challenge.reward} pts</div>
                  <div className="text-xs text-neutral-500">{challenge.timeLeft} left</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1 mr-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{challenge.progress}/{challenge.target}</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div 
                      className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(challenge.progress / challenge.target) * 100}%` }}
                    />
                  </div>
                </div>
                <button className="btn-primary text-sm">
                  Join Challenge
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Badges & Achievements */}
      <div className="card">
        <h2 className="text-2xl font-display font-semibold text-neutral-800 mb-6">
          Badges & Achievements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div 
                key={badge.id} 
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  badge.earned 
                    ? 'border-primary-200 bg-primary-50' 
                    : 'border-neutral-200 bg-neutral-50 opacity-60'
                }`}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${
                    badge.earned 
                      ? rarityColors[badge.rarity as keyof typeof rarityColors]
                      : 'from-neutral-300 to-neutral-400'
                  }`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-800">{badge.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      badge.rarity === 'legendary' ? 'bg-amber-100 text-amber-800' :
                      badge.rarity === 'epic' ? 'bg-purple-100 text-purple-800' :
                      badge.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {badge.rarity}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-neutral-600">{badge.description}</p>
                {badge.earned && (
                  <div className="mt-2 text-xs text-green-600 font-medium">✓ Earned</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="card">
        <h2 className="text-2xl font-display font-semibold text-neutral-800 mb-6">
          Global Leaderboard
        </h2>
        <div className="space-y-3">
          {leaderboard.map((user) => (
            <div 
              key={user.rank} 
              className={`flex items-center justify-between p-4 rounded-xl ${
                user.isCurrentUser 
                  ? 'bg-primary-50 border-2 border-primary-200' 
                  : 'bg-neutral-50'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  user.rank === 1 ? 'bg-amber-100 text-amber-800' :
                  user.rank === 2 ? 'bg-gray-100 text-gray-800' :
                  user.rank === 3 ? 'bg-orange-100 text-orange-800' :
                  'bg-neutral-200 text-neutral-700'
                }`}>
                  #{user.rank}
                </div>
                <div>
                  <div className={`font-medium ${user.isCurrentUser ? 'text-primary-800' : 'text-neutral-800'}`}>
                    {user.name}
                  </div>
                  <div className="text-sm text-neutral-600">{user.devices} devices</div>
                </div>
              </div>
              <div className={`text-xl font-bold ${user.isCurrentUser ? 'text-primary-600' : 'text-neutral-700'}`}>
                {user.points} pts
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Gamification;