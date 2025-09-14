import React from 'react';
import { 
  Package, 
  Users, 
  TrendingUp, 
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  MapPin
} from 'lucide-react';
import { motion } from 'framer-motion';

const NGODashboard: React.FC = () => {
  // Mock data - in real app, this would come from API
  const stats = [
    {
      label: 'Devices Collected',
      value: '1,247',
      change: '+12%',
      changeType: 'positive' as const,
      icon: Package
    },
    {
      label: 'Active Requests',
      value: '23',
      change: '+5',
      changeType: 'positive' as const,
      icon: Clock
    },
    {
      label: 'Users Served',
      value: '892',
      change: '+8%',
      changeType: 'positive' as const,
      icon: Users
    },
    {
      label: 'Recycling Rate',
      value: '94%',
      change: '+2%',
      changeType: 'positive' as const,
      icon: TrendingUp
    }
  ];

  const recentRequests = [
    {
      id: 'REQ-001',
      user: 'John Doe',
      devices: 'Laptop, Mobile Phone',
      location: 'Downtown Area',
      status: 'pending',
      timeAgo: '2 hours ago'
    },
    {
      id: 'REQ-002',
      user: 'Sarah Wilson',
      devices: 'Desktop PC',
      location: 'Uptown District',
      status: 'in_progress',
      timeAgo: '4 hours ago'
    },
    {
      id: 'REQ-003',
      user: 'Mike Johnson',
      devices: 'Tablet, Chargers',
      location: 'City Center',
      status: 'completed',
      timeAgo: '1 day ago'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <AlertCircle className="h-4 w-4" />;
      case 'in_progress': return <Clock className="h-4 w-4" />;
      case 'completed': return <CheckCircle2 className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white"
      >
        <h1 className="text-3xl font-bold mb-2">Welcome back, EcoRecycle NGO!</h1>
        <p className="text-blue-100 text-lg">
          You have 23 active collection requests and 5 pending approvals today.
        </p>
        <div className="flex items-center mt-4 text-blue-100">
          <Calendar className="h-5 w-5 mr-2" />
          <span>Today is {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.6 }}
              className="card"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <IconComponent className="h-6 w-6 text-blue-600" />
                </div>
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                  stat.changeType === 'positive' 
                    ? 'text-green-600 bg-green-100' 
                    : 'text-red-600 bg-red-100'
                }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-600">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Collection Requests */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Collection Requests</h2>
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {recentRequests.map((request) => (
              <div key={request.id} className="flex items-center p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{request.user}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(request.status)}`}>
                      {getStatusIcon(request.status)}
                      <span className="ml-1 capitalize">{request.status.replace('_', ' ')}</span>
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-1">{request.devices}</p>
                  <div className="flex items-center text-gray-500 text-xs">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{request.location} • {request.timeAgo}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="card"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          
          <div className="space-y-4">
            <button className="w-full p-4 text-left border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all group">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-xl group-hover:bg-blue-200 transition-colors">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">Scan QR Code</h3>
                  <p className="text-gray-600 text-sm">Track and process devices</p>
                </div>
              </div>
            </button>
            
            <button className="w-full p-4 text-left border border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-all group">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-xl group-hover:bg-green-200 transition-colors">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">Schedule Pickup</h3>
                  <p className="text-gray-600 text-sm">Plan collection routes</p>
                </div>
              </div>
            </button>
            
            <button className="w-full p-4 text-left border border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all group">
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-xl group-hover:bg-purple-200 transition-colors">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">View Analytics</h3>
                  <p className="text-gray-600 text-sm">Track your impact</p>
                </div>
              </div>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Environmental Impact Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="bg-gradient-to-r from-green-500 to-green-700 rounded-2xl p-8 text-white"
      >
        <h2 className="text-2xl font-bold mb-4">Your Environmental Impact This Month</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">2.4 tons</div>
            <div className="text-green-100">E-waste Processed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">890 kg</div>
            <div className="text-green-100">CO₂ Emissions Saved</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">156</div>
            <div className="text-green-100">Devices Refurbished</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NGODashboard;