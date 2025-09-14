import React, { useState, useEffect } from 'react';
import { Trophy, Award, Target, Users, Crown, Medal, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { getUserGamification, getUserAchievements, getChallenges, getLeaderboard } from '../../services/userApi';
import { useAuth } from '../../context/AuthContext';

interface UserStats {
  points: number;
  level: number;
  rank: number;
  totalUsers: number;
}

interface Badge {
  id: number;
  name: string;
  description: string;
  earned: boolean;
  rarity: string;
  iconType: string;
}

interface Challenge {
  id: number;
  title: string;
  description: string;
  progress: number;
  target: number;
  reward: number;
  timeLeft: string;
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  devices: number;
  isCurrentUser?: boolean;
}

const Gamification: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userStats, setUserStats] = useState<UserStats>({
    points: 0,
    level: 0,
    rank: 0,
    totalUsers: 0
  });
  const [badges, setBadges] = useState<Badge[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const fetchGamificationData = async () => {
      try {
        setLoading(true);
        const [gamificationData, achievementsData, challengesData, leaderboardData] = await Promise.all([
          getUserGamification(),
          getUserAchievements(),
          getChallenges(),
          getLeaderboard()
        ]);
        
        setUserStats(gamificationData);
        setBadges(achievementsData);
        setChallenges(challengesData);
        setLeaderboard(leaderboardData);
        setError(null);
      } catch (err) {
        console.error('Error fetching gamification data:', err);
        setError('Failed to load gamification data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchGamificationData();
  }, []);

  const rarityColors = {
    common: 'from-gray-400 to-gray-600',
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-purple-400 to-purple-600',
    legendary: 'from-amber-400 to-amber-600'
  };

  // For debugging
  console.log("Current userProfile:", useAuth().userProfile);

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
      {loading ? (
        <div className="text-center py-12">
          <Trophy className="w-16 h-16 text-neutral-300 mx-auto mb-4 animate-pulse" />
          <h3 className="text-lg font-medium text-neutral-800 mb-2">Loading gamification data...</h3>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-red-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-neutral-800 mb-2">Error loading gamification data</h3>
          <p className="text-neutral-600 mb-6">{error}</p>
        </div>
      ) : (
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
      )}

      {/* Active Challenges */}
      {!loading && !error && (
        <div className="card">
          <h2 className="text-2xl font-display font-semibold text-neutral-800 mb-6">
            Active Challenges
          </h2>
          <div className="space-y-4">
            {challenges.length > 0 ? (
              challenges.map((challenge) => (
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
              ))
            ) : (
              <div className="text-center py-8">
                <Target className="w-16 h-16 text-neutral-300 mx-auto mb-3" />
                <p className="text-neutral-500">No active challenges</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Badges & Achievements */}
      {!loading && !error && (
        <div className="card">
          <h2 className="text-2xl font-display font-semibold text-neutral-800 mb-6">
            Badges & Achievements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {badges.length > 0 ? (
              badges.map((badge) => {
                // Get the appropriate icon based on badge type
                const getIcon = () => {
                  switch (badge.iconType) {
                    case 'award':
                      return <Award className="w-5 h-5" />;
                    case 'trophy':
                      return <Trophy className="w-5 h-5" />;
                    case 'target':
                      return <Target className="w-5 h-5" />;
                    case 'crown':
                      return <Crown className="w-5 h-5" />;
                    case 'medal':
                      return <Medal className="w-5 h-5" />;
                    default:
                      return <Award className="w-5 h-5" />;
                  }
                };
              
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
                        {getIcon()}
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
              })
            ) : (
              <div className="col-span-3 text-center py-8">
                <Trophy className="w-16 h-16 text-neutral-300 mx-auto mb-3" />
                <p className="text-neutral-500">No badges earned yet</p>
                <p className="text-sm text-neutral-600">Complete challenges to earn badges</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Leaderboard */}
      {!loading && !error && (
        <div className="card">
          <h2 className="text-2xl font-display font-semibold text-neutral-800 mb-6">
            Global Leaderboard
          </h2>
          <div className="space-y-3">
            {leaderboard.length > 0 ? (
              leaderboard.map((user) => (
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
              ))
            ) : (
              <div className="text-center py-8">
                <Users className="w-16 h-16 text-neutral-300 mx-auto mb-3" />
                <p className="text-neutral-500">Leaderboard data not available</p>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Gamification;