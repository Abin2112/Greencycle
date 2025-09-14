import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Upload, 
  Smartphone, 
  MapPin, 
  Calendar, 
  BarChart3, 
  Trophy,
  Leaf,
  Recycle,
  Award,
  TrendingUp,
  Users,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const UserDashboard: React.FC = () => {
  const { userProfile } = useAuth();

  // Mock data - replace with real API calls
  const stats = {
    devicesUploaded: 12,
    totalImpact: {
      waterSaved: 6400, // liters
      co2Reduced: 184, // kg
      toxicPrevented: 7.2 // kg
    },
    recentDevices: [
      { id: 1, name: 'iPhone 12', status: 'recycled', date: '2024-01-15', impact: '520L water saved' },
      { id: 2, name: 'MacBook Pro', status: 'donated', date: '2024-01-10', impact: '1.2kg CO₂ reduced' },
      { id: 3, name: 'iPad Air', status: 'processing', date: '2024-01-08', impact: 'Processing...' },
    ],
    upcomingPickups: [
      { id: 1, date: '2024-01-20', time: '10:00 AM', address: '123 Main St', items: 2 },
      { id: 2, date: '2024-01-22', time: '2:00 PM', address: '456 Oak Ave', items: 1 },
    ],
    achievements: [
      { id: 1, name: 'Eco Warrior', description: 'Uploaded 10+ devices', icon: Award, earned: true },
      { id: 2, name: 'Green Pioneer', description: 'First device upload', icon: Leaf, earned: true },
      { id: 3, name: 'Impact Maker', description: 'Save 1000L water', icon: TrendingUp, earned: false },
    ]
  };

  const quickActions = [
    { name: 'Upload Device', href: '/user/upload', icon: Upload, description: 'Add a new device for recycling', color: 'from-green-400 to-green-600' },
    { name: 'Find NGOs', href: '/user/ngos', icon: MapPin, description: 'Locate nearby recycling centers', color: 'from-blue-400 to-blue-600' },
    { name: 'Schedule Pickup', href: '/user/pickups', icon: Calendar, description: 'Book a collection appointment', color: 'from-purple-400 to-purple-600' },
    { name: 'View Impact', href: '/user/impact', icon: BarChart3, description: 'See your environmental contribution', color: 'from-amber-400 to-amber-600' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center lg:text-left"
      >
        <h1 className="text-3xl lg:text-4xl font-display font-bold text-neutral-800 mb-4">
          Welcome back, {userProfile?.name}! 👋
        </h1>
        <p className="text-lg text-neutral-600 max-w-2xl">
          Continue making a positive impact on our environment. Track your progress, manage your devices, and see how you're helping create a sustainable future.
        </p>
      </motion.div>

      {/* Stats Overview */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-neutral-800">{stats.devicesUploaded}</p>
              <p className="text-sm text-neutral-600">Devices Uploaded</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-neutral-800">{stats.totalImpact.waterSaved.toLocaleString()}L</p>
              <p className="text-sm text-neutral-600">Water Saved</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
              <Recycle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-neutral-800">{stats.totalImpact.co2Reduced}kg</p>
              <p className="text-sm text-neutral-600">CO₂ Reduced</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-neutral-800">{userProfile?.points}</p>
              <p className="text-sm text-neutral-600">Green Points</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        <h2 className="text-2xl font-display font-semibold text-neutral-800">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Link to={action.href} className="group block p-4 rounded-2xl hover:bg-white/50 transition-all duration-200 hover:shadow-medium">
                  <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-neutral-800 mb-2">{action.name}</h3>
                  <p className="text-sm text-neutral-600">{action.description}</p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Recent Activity & Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Devices */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-display font-semibold text-neutral-800">Recent Devices</h3>
            <Link to="/user/devices" className="text-sm text-primary-600 hover:text-primary-500 font-medium">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {stats.recentDevices.map((device) => (
              <div key={device.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-neutral-800">{device.name}</p>
                    <p className="text-sm text-neutral-600">{device.impact}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`px-2 py-1 rounded-lg text-xs font-medium ${
                    device.status === 'recycled' ? 'bg-green-100 text-green-800' :
                    device.status === 'donated' ? 'bg-blue-100 text-blue-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {device.status}
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">{device.date}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Pickups */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-display font-semibold text-neutral-800">Upcoming Pickups</h3>
            <Link to="/user/pickups" className="text-sm text-primary-600 hover:text-primary-500 font-medium">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {stats.upcomingPickups.map((pickup) => (
              <div key={pickup.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-neutral-800">{pickup.date}</p>
                    <p className="text-sm text-neutral-600">{pickup.address}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-neutral-400" />
                    <span className="text-sm font-medium text-neutral-700">{pickup.time}</span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">{pickup.items} items</p>
                </div>
              </div>
            ))}
            {stats.upcomingPickups.length === 0 && (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <p className="text-neutral-500">No upcoming pickups</p>
                <Link to="/user/pickups" className="text-primary-600 hover:text-primary-500 text-sm font-medium">
                  Schedule a pickup
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Achievements */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-display font-semibold text-neutral-800">Achievements</h3>
          <Link to="/user/gamification" className="text-sm text-primary-600 hover:text-primary-500 font-medium">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.achievements.map((achievement) => {
            const Icon = achievement.icon;
            return (
              <div 
                key={achievement.id} 
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  achievement.earned 
                    ? 'border-primary-200 bg-primary-50 hover:border-primary-300' 
                    : 'border-neutral-200 bg-neutral-50 opacity-60'
                }`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    achievement.earned 
                      ? 'bg-gradient-to-br from-primary-400 to-primary-600 text-white' 
                      : 'bg-neutral-300 text-neutral-500'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-neutral-800">{achievement.name}</p>
                  </div>
                </div>
                <p className="text-sm text-neutral-600">{achievement.description}</p>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default UserDashboard;