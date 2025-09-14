import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Package, 
  Building2,
  Download,
  RefreshCw,
  Globe,
  Recycle,
  Target,
  Activity,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { adminApiService } from '../../services/adminApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';

// Define proper types
interface KpiData {
  label: string;
  value: string;
  change: string;
  changePercent: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<any>;
  color: string;
}

interface ChartDataPoint {
  month: string;
  users: number;
  ngos: number;
}

interface DeviceData {
  category: string;
  count: number;
  percentage: number;
}

interface ChartData {
  userGrowth: ChartDataPoint[];
  deviceProcessing: DeviceData[];
}

interface RegionalData {
  region: string;
  users: number;
  ngos: number;
  devices: number;
}

const AdminAnalytics: React.FC = () => {
  const { userProfile } = useAuth();
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  const fetchAnalyticsData = async () => {
    try {
      setError(null);
      const [overview, ngoAnalytics] = await Promise.all([
        adminApiService.getAdminOverview(),
        adminApiService.getNgoAnalytics()
      ]);

      setAnalyticsData({
        overview,
        ngoAnalytics
      });
    } catch (err) {
      console.error('Failed to fetch analytics data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load analytics data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAnalyticsData();
  };

  useEffect(() => {
    if (userProfile?.role === 'admin') {
      fetchAnalyticsData();
    }
  }, [userProfile]);

  // Check if user is admin
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

  // Generate KPI data from API response
  const getKpiData = (): KpiData[] => {
    if (!analyticsData) {
      return [
        {
          label: 'Total Users',
          value: '0',
          change: '+0',
          changePercent: '+0%',
          changeType: 'neutral',
          icon: Users,
          color: 'blue'
        },
        {
          label: 'Active NGOs',
          value: '0',
          change: '+0',
          changePercent: '+0%',
          changeType: 'neutral',
          icon: Building2,
          color: 'green'
        },
        {
          label: 'Devices Processed',
          value: '0',
          change: '+0',
          changePercent: '+0%',
          changeType: 'neutral',
          icon: Package,
          color: 'purple'
        },
        {
          label: 'Platform Revenue',
          value: '$0',
          change: '+$0',
          changePercent: '+0%',
          changeType: 'neutral',
          icon: TrendingUp,
          color: 'yellow'
        }
      ];
    }

    const { overview, userAnalytics, ngoAnalytics } = analyticsData;

    return [
      {
        label: 'Total Users',
        value: overview.overview.total_users.toLocaleString(),
        change: `+${userAnalytics.stats.new_registrations_this_month}`,
        changePercent: `+${((userAnalytics.stats.new_registrations_this_month / overview.overview.total_users) * 100).toFixed(1)}%`,
        changeType: userAnalytics.stats.new_registrations_this_month > 0 ? 'positive' : 'neutral',
        icon: Users,
        color: 'blue'
      },
      {
        label: 'Active NGOs',
        value: ngoAnalytics.stats.verified_ngos.toLocaleString(),
        change: `${ngoAnalytics.stats.pending_verifications} pending`,
        changePercent: `${((ngoAnalytics.stats.verified_ngos / (ngoAnalytics.stats.verified_ngos + ngoAnalytics.stats.pending_verifications)) * 100).toFixed(1)}%`,
        changeType: ngoAnalytics.stats.pending_verifications > 5 ? 'negative' : 'positive',
        icon: Building2,
        color: 'green'
      },
      {
        label: 'Devices Processed',
        value: overview.overview.devices_processed.toLocaleString(),
        change: `${overview.overview.total_devices - overview.overview.devices_processed} pending`,
        changePercent: `${((overview.overview.devices_processed / overview.overview.total_devices) * 100).toFixed(1)}%`,
        changeType: (overview.overview.devices_processed / overview.overview.total_devices) > 0.8 ? 'positive' : 'neutral',
        icon: Package,
        color: 'purple'
      },
      {
        label: 'Environmental Impact',
        value: `${(overview.overview.environmental_impact.co2_saved_kg / 1000).toFixed(1)}t CO₂`,
        change: `${(overview.overview.environmental_impact.water_saved_liters / 1000).toFixed(1)}k L water saved`,
        changePercent: '+12.3%',
        changeType: 'positive',
        icon: TrendingUp,
        color: 'yellow'
      }
    ];
  };

  // Generate chart data from API response
  const getChartData = (): ChartData => {
    if (!analyticsData) {
      return {
        userGrowth: [],
        deviceProcessing: []
      };
    }

    const { overview, userAnalytics } = analyticsData;

    // Generate user growth data from monthly_growth
    const userGrowth: ChartDataPoint[] = overview.monthly_growth.map((item: any) => ({
      month: new Date(item.month).toLocaleDateString('en', { month: 'short' }),
      users: item.users,
      ngos: item.ngos
    }));

    // Generate device processing data from device_trends
    const deviceProcessing: DeviceData[] = overview.device_trends.map((item: any) => ({
      category: item.device_type,
      count: item.count,
      percentage: item.percentage
    }));

    return {
      userGrowth,
      deviceProcessing
    };
  };

  // Generate regional data from API response
  const getRegionalData = (): RegionalData[] => {
    if (!analyticsData) {
      return [];
    }

    return analyticsData.overview.regional_data.map((item: any) => ({
      region: item.state,
      users: item.user_count,
      ngos: item.ngo_count,
      devices: item.device_count
    }));
  };

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
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Analytics</h2>
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

  const kpiData = getKpiData();
  const chartData = getChartData();
  const regionalData = getRegionalData();

  const getColorClass = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      yellow: 'bg-yellow-100 text-yellow-600'
    };
    return colors[color as keyof typeof colors] || 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Comprehensive platform insights and performance metrics</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            title="Refresh Analytics"
          >
            {refreshing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh
          </button>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button className="btn-secondary flex items-center">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
          <button className="btn-primary flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </button>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => {
          const IconComponent = kpi.icon;
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.6 }}
              className="card"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${getColorClass(kpi.color)}`}>
                  <IconComponent className="h-6 w-6" />
                </div>
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                  kpi.changeType === 'positive' 
                    ? 'text-green-600 bg-green-100' 
                    : kpi.changeType === 'negative'
                    ? 'text-red-600 bg-red-100'
                    : 'text-gray-600 bg-gray-100'
                }`}>
                  {kpi.changePercent}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{kpi.value}</h3>
              <p className="text-gray-600 text-sm mb-2">{kpi.label}</p>
              <p className="text-sm text-gray-500">{kpi.change} from last period</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">User Growth Trends</h2>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span>Users</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span>NGOs</span>
              </div>
            </div>
          </div>
          
          <div className="h-64 flex items-end space-x-4 mb-4">
            {chartData.userGrowth.length > 0 ? (
              chartData.userGrowth.map((data, index) => (
                <div key={data.month} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex flex-col justify-end h-48 space-y-1">
                    <div 
                      className="bg-red-500 rounded-t"
                      style={{ height: `${(data.users / 13000) * 100}%` }}
                    ></div>
                    <div 
                      className="bg-blue-500 rounded-t"
                      style={{ height: `${(data.ngos / 160) * 30}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600 mt-2">{data.month}</span>
                </div>
              ))
            ) : (
              <div className="w-full flex items-center justify-center h-48">
                <div className="text-center text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Growth Data</h3>
                  <p className="text-gray-600">User and NGO growth data will appear here</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Device Categories */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="card"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Device Categories</h2>
          
          <div className="space-y-4">
            {chartData.deviceProcessing.length > 0 ? (
              chartData.deviceProcessing.map((device, index) => (
                <div key={device.category} className="flex items-center">
                  <div className="w-24 text-sm text-gray-600">{device.category}</div>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${device.percentage}%` }}
                        transition={{ delay: 0.8 + index * 0.1, duration: 0.8 }}
                        className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full"
                      ></motion.div>
                    </div>
                  </div>
                  <div className="w-20 text-right">
                    <div className="text-sm font-medium text-gray-900">{device.count.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">{device.percentage}%</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Device Data</h3>
                <p className="text-gray-600">Device processing data will appear here</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Regional Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Regional Distribution</h2>
          <button className="text-red-600 hover:text-red-700 font-medium text-sm">
            View Map
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Region
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Users
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NGOs
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Devices Processed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Market Share
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {regionalData.length > 0 ? (
                regionalData.map((region, index) => {
                  const totalUsers = regionalData.reduce((sum, r) => sum + r.users, 0);
                  const marketShare = totalUsers > 0 ? ((region.users / totalUsers) * 100).toFixed(1) : '0';
                  
                  return (
                    <tr key={region.region} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-2 w-2 bg-red-500 rounded-full mr-3"></div>
                          <span className="text-sm font-medium text-gray-900">{region.region}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {region.users.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {region.ngos}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {region.devices.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                            <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${marketShare}%` }}
                            transition={{ delay: 1.0 + index * 0.1, duration: 0.8 }}
                            className="bg-red-500 h-2 rounded-full"
                          ></motion.div>
                        </div>
                        <span className="text-sm text-gray-600 w-12">{marketShare}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center">
                    <div className="text-gray-500">
                      <Globe className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Regional Data</h3>
                      <p className="text-gray-600">Regional distribution data will appear here</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* System Performance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
            <div className="bg-green-100 p-2 rounded-lg">
              <Activity className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Uptime</span>
              <span className="text-sm font-medium text-green-600">99.8%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Response Time</span>
              <span className="text-sm font-medium text-gray-900">142ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Error Rate</span>
              <span className="text-sm font-medium text-red-600">0.02%</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Environmental Impact</h3>
            <div className="bg-green-100 p-2 rounded-lg">
              <Recycle className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">CO₂ Saved</span>
              <span className="text-sm font-medium text-green-600">12.4 tons</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">E-waste Diverted</span>
              <span className="text-sm font-medium text-gray-900">45.8 tons</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Recycling Rate</span>
              <span className="text-sm font-medium text-blue-600">94.2%</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.6 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Platform Goals</h3>
            <div className="bg-blue-100 p-2 rounded-lg">
              <Target className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">User Target</span>
                <span className="text-sm font-medium text-gray-900">85.6%</span>
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85.6%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">NGO Network</span>
                <span className="text-sm font-medium text-gray-900">78.0%</span>
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Device Processing</span>
                <span className="text-sm font-medium text-gray-900">92.3%</span>
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '92.3%' }}></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminAnalytics;