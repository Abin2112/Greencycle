import React from 'react';
import { 
  Users, 
  Building2, 
  Package, 
  TrendingUp,
  AlertTriangle,
  Shield,
  Activity,
  Database,
  UserCheck,
  Settings,
  BarChart3,
  Globe
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard: React.FC = () => {
  // Mock data - in real app, this would come from API
  const systemStats = [
    {
      label: 'Total Users',
      value: '0',
      change: '+0',
      changeType: 'neutral' as const,
      icon: Users
    },
    {
      label: 'Active NGOs',
      value: '0',
      change: '+0',
      changeType: 'neutral' as const,
      icon: Building2
    },
    {
      label: 'Devices Processed',
      value: '0',
      change: '+0',
      changeType: 'neutral' as const,
      icon: Package
    },
    {
      label: 'System Health',
      value: '100%',
      change: '+0%',
      changeType: 'neutral' as const,
      icon: Activity
    }
  ];

  const recentActivities: any[] = [];

  const criticalAlerts: any[] = [];

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'high': return 'border-red-300 bg-red-50 text-red-800';
      case 'medium': return 'border-yellow-300 bg-yellow-50 text-yellow-800';
      case 'low': return 'border-blue-300 bg-blue-50 text-blue-800';
      default: return 'border-gray-300 bg-gray-50 text-gray-800';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'ngo_registration': return <Building2 className="h-4 w-4" />;
      case 'user_report': return <AlertTriangle className="h-4 w-4" />;
      case 'system_alert': return <Shield className="h-4 w-4" />;
      case 'data_backup': return <Database className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'reviewing': return 'text-orange-600 bg-orange-100';
      case 'resolved': return 'text-green-600 bg-green-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-red-600 to-red-800 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Control Center</h1>
            <p className="text-red-100 text-lg">
              System running smoothly with 99.2% uptime. 8 pending approvals require attention.
            </p>
          </div>
          <div className="bg-red-500 bg-opacity-30 p-4 rounded-xl">
            <Shield className="h-12 w-12 text-white" />
          </div>
        </div>
        <div className="flex items-center mt-4 text-red-100">
          <Globe className="h-5 w-5 mr-2" />
          <span>Global Platform Status: All systems operational</span>
        </div>
      </motion.div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemStats.map((stat, index) => {
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
                <div className="bg-red-100 p-3 rounded-xl">
                  <IconComponent className="h-6 w-6 text-red-600" />
                </div>
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                  stat.changeType === 'positive' 
                    ? 'text-green-600 bg-green-100' 
                    : stat.changeType === 'negative'
                    ? 'text-red-600 bg-red-100'
                    : 'text-gray-600 bg-gray-100'
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
        {/* Critical Alerts */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
              Critical Alerts
            </h2>
            <button className="text-red-600 hover:text-red-700 font-medium">
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {criticalAlerts.length > 0 ? (
              criticalAlerts.map((alert) => (
                <div key={alert.id} className={`p-4 border rounded-xl ${getAlertColor(alert.level)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{alert.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      alert.level === 'high' ? 'bg-red-200' : 
                      alert.level === 'medium' ? 'bg-yellow-200' : 'bg-blue-200'
                    }`}>
                      {alert.level.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm mb-3">{alert.description}</p>
                  <button className="text-sm font-medium hover:underline">
                    {alert.action} →
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                <AlertTriangle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Critical Alerts</h3>
                <p className="text-gray-600">All systems are running smoothly</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent System Activities */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Activities</h2>
            <button className="text-red-600 hover:text-red-700 font-medium">
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start p-4 border border-gray-200 rounded-xl hover:border-red-300 transition-colors">
                  <div className="bg-gray-100 p-2 rounded-lg mr-3 mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900">{activity.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                        {activity.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{activity.description}</p>
                    <span className="text-gray-500 text-xs">{activity.timestamp}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                <Activity className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Recent Activity</h3>
                <p className="text-gray-600">System activity will appear here</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Admin Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="card"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 text-left border border-gray-200 rounded-xl hover:border-red-300 hover:bg-red-50 transition-all group">
            <div className="flex flex-col items-center text-center">
              <div className="bg-red-100 p-3 rounded-xl group-hover:bg-red-200 transition-colors mb-3">
                <UserCheck className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">User Management</h3>
              <p className="text-gray-600 text-sm">Manage user accounts</p>
            </div>
          </button>
          
          <button className="p-4 text-left border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all group">
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 p-3 rounded-xl group-hover:bg-blue-200 transition-colors mb-3">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">NGO Approvals</h3>
              <p className="text-gray-600 text-sm">Review registrations</p>
            </div>
          </button>
          
          <button className="p-4 text-left border border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-all group">
            <div className="flex flex-col items-center text-center">
              <div className="bg-green-100 p-3 rounded-xl group-hover:bg-green-200 transition-colors mb-3">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Analytics</h3>
              <p className="text-gray-600 text-sm">System insights</p>
            </div>
          </button>
          
          <button className="p-4 text-left border border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all group">
            <div className="flex flex-col items-center text-center">
              <div className="bg-purple-100 p-3 rounded-xl group-hover:bg-purple-200 transition-colors mb-3">
                <Settings className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Settings</h3>
              <p className="text-gray-600 text-sm">System configuration</p>
            </div>
          </button>
        </div>
      </motion.div>

      {/* Platform Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 text-white"
      >
        <h2 className="text-2xl font-bold mb-6">Platform Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">45.8k</div>
            <div className="text-gray-300">Total Devices</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">892</div>
            <div className="text-gray-300">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">156</div>
            <div className="text-gray-300">Partner NGOs</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">23.4t</div>
            <div className="text-gray-300">E-waste Processed</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;