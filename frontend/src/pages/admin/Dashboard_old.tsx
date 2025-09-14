import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Building2, 
  Package,
  AlertTriangle,
  Shield,
  Activity,
  UserCheck,
  Settings,
  BarChart3,
  Globe,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { adminApiService } from '../../services/adminApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminDashboard: React.FC = () => {
  const { userProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);

  const fetchDashboardData = async () => {
    try {
      setError(null);
      const [overview, userAnalytics, ngoAnalytics, activities, alerts] = await Promise.all([
        adminApiService.getAdminOverview(),
        adminApiService.getUserAnalytics(),
        adminApiService.getNgoAnalytics(),
        adminApiService.getRecentActivities(),
        adminApiService.getCriticalAlerts()
      ]);

      setDashboardData({
        overview,
        userAnalytics,
        ngoAnalytics,
        activities,
        alerts
      });
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
  };

  useEffect(() => {
    if (userProfile?.role === 'admin') {
      fetchDashboardData();
    }
  }, [userProfile]);

  if (userProfile && userProfile.role !== 'admin') {
    return (
      <div className="p-6 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-800 mb-2">Access Denied</h2>
          <p className="text-red-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-96">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Dashboard</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
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
              System running smoothly. {dashboardData?.alerts?.length || 0} alerts require attention.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="bg-red-500 bg-opacity-30 p-3 rounded-xl hover:bg-opacity-50 transition-all disabled:opacity-50"
              title="Refresh Dashboard"
            >
              {refreshing ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <RefreshCw className="h-6 w-6" />
              )}
            </button>
            <div className="bg-red-500 bg-opacity-30 p-4 rounded-xl">
              <Shield className="h-8 w-8" />
            </div>
          </div>
        </div>
        <div className="flex items-center mt-4 text-red-100">
          <Globe className="h-5 w-5 mr-2" />
          <span>Global E-waste Management Platform</span>
        </div>
      </motion.div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-50 p-3 rounded-xl">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {dashboardData?.overview?.overview?.total_users?.toLocaleString() || '0'}
          </h3>
          <p className="text-gray-600 text-sm">Total Users</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-50 p-3 rounded-xl">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {dashboardData?.ngoAnalytics?.stats?.verified_ngos?.toLocaleString() || '0'}
          </h3>
          <p className="text-gray-600 text-sm">Active NGOs</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-50 p-3 rounded-xl">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {dashboardData?.overview?.overview?.devices_processed?.toLocaleString() || '0'}
          </h3>
          <p className="text-gray-600 text-sm">Devices Processed</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-50 p-3 rounded-xl">
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">99.2%</h3>
          <p className="text-gray-600 text-sm">System Health</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
      </div>
    </div>
  );
};

export default AdminDashboard;
