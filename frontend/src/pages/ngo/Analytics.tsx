import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Package, 
  Users,
  Recycle,
  Target,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Leaf,
  Award,
  Clock,
  MapPin,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

const NGOAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('all');

  // Mock data - in real app, this would come from API
  const kpiData = [
    {
      label: 'Devices Collected',
      value: '1,247',
      change: '+123',
      changePercent: '+10.9%',
      changeType: 'positive' as const,
      icon: Package,
      color: 'blue'
    },
    {
      label: 'Active Requests',
      value: '23',
      change: '+5',
      changePercent: '+27.8%',
      changeType: 'positive' as const,
      icon: Clock,
      color: 'yellow'
    },
    {
      label: 'Users Served',
      value: '892',
      change: '+67',
      changePercent: '+8.1%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'green'
    },
    {
      label: 'Recycling Rate',
      value: '94.2%',
      change: '+2.1%',
      changePercent: '+2.3%',
      changeType: 'positive' as const,
      icon: Recycle,
      color: 'purple'
    }
  ];

  const monthlyData = [
    { month: 'Jan', devices: 89, users: 45, co2Saved: 12.4 },
    { month: 'Feb', devices: 112, users: 58, co2Saved: 15.8 },
    { month: 'Mar', devices: 134, users: 72, co2Saved: 18.9 },
    { month: 'Apr', devices: 156, users: 89, co2Saved: 22.1 },
    { month: 'May', devices: 178, users: 95, co2Saved: 25.3 },
    { month: 'Jun', devices: 201, users: 108, co2Saved: 28.7 },
    { month: 'Jul', devices: 225, users: 124, co2Saved: 32.1 }
  ];

  const deviceTypes = [
    { type: 'Smartphones', count: 456, percentage: 37, trend: '+12%' },
    { type: 'Laptops', count: 234, percentage: 19, trend: '+8%' },
    { type: 'Tablets', count: 189, percentage: 15, trend: '+15%' },
    { type: 'Desktop PCs', count: 167, percentage: 13, trend: '+5%' },
    { type: 'Other', count: 201, percentage: 16, trend: '+10%' }
  ];

  const impactMetrics = [
    {
      title: 'CO₂ Emissions Saved',
      value: '32.1 tons',
      description: 'Equivalent to planting 147 trees',
      icon: Leaf,
      color: 'green'
    },
    {
      title: 'E-waste Processed',
      value: '2.4 tons',
      description: 'Diverted from landfills',
      icon: Recycle,
      color: 'blue'
    },
    {
      title: 'Devices Refurbished',
      value: '156',
      description: 'Given new life and donated',
      icon: Award,
      color: 'purple'
    },
    {
      title: 'Energy Saved',
      value: '1,247 kWh',
      description: 'Through efficient processing',
      icon: Zap,
      color: 'yellow'
    }
  ];

  const regionalPerformance = [
    { region: 'Manhattan', devices: 342, users: 189, efficiency: 94 },
    { region: 'Brooklyn', devices: 298, users: 156, efficiency: 89 },
    { region: 'Queens', devices: 234, users: 134, efficiency: 92 },
    { region: 'Bronx', devices: 189, users: 98, efficiency: 87 },
    { region: 'Staten Island', devices: 145, users: 87, efficiency: 91 }
  ];

  const getColorClass = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      yellow: 'bg-yellow-100 text-yellow-600'
    };
    return colors[color as keyof typeof colors] || 'bg-gray-100 text-gray-600';
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-red-500';
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
          <p className="text-gray-600 mt-1">Track your environmental impact and collection performance</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    : 'text-red-600 bg-red-100'
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
        {/* Monthly Performance Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Monthly Performance</h2>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span>Devices</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span>CO₂ Saved</span>
              </div>
            </div>
          </div>
          
          <div className="h-64 flex items-end space-x-3 mb-4">
            {monthlyData.map((data, index) => (
              <div key={data.month} className="flex-1 flex flex-col items-center">
                <div className="w-full flex flex-col justify-end h-48 space-y-1">
                  <div 
                    className="bg-blue-500 rounded-t"
                    style={{ height: `${(data.devices / 250) * 100}%` }}
                  ></div>
                  <div 
                    className="bg-green-500 rounded-t"
                    style={{ height: `${(data.co2Saved / 35) * 30}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-600 mt-2">{data.month}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Device Types Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="card"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Device Types Collected</h2>
          
          <div className="space-y-4">
            {deviceTypes.map((device, index) => (
              <div key={device.type} className="flex items-center">
                <div className="w-20 text-sm text-gray-600">{device.type}</div>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${device.percentage}%` }}
                      transition={{ delay: 0.8 + index * 0.1, duration: 0.8 }}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full"
                    ></motion.div>
                  </div>
                </div>
                <div className="w-24 text-right">
                  <div className="text-sm font-medium text-gray-900">{device.count}</div>
                  <div className="text-xs text-green-600">{device.trend}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Environmental Impact */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="card"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-6">Environmental Impact</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {impactMetrics.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 + index * 0.1, duration: 0.6 }}
                className="text-center p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
              >
                <div className={`inline-flex p-3 rounded-xl mb-3 ${getColorClass(metric.color)}`}>
                  <IconComponent className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{metric.title}</h3>
                <p className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</p>
                <p className="text-sm text-gray-600">{metric.description}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Regional Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Regional Performance</h2>
          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
            View Details
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
                  Devices Collected
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Users Served
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Efficiency
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {regionalPerformance.map((region, index) => (
                <tr key={region.region} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">{region.region}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {region.devices}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {region.users}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${region.efficiency}%` }}
                          transition={{ delay: 1.2 + index * 0.1, duration: 0.8 }}
                          className={`h-2 rounded-full ${getProgressColor(region.efficiency)}`}
                        ></motion.div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-12">
                        {region.efficiency}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Goals and Targets */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Monthly Goal</h3>
            <div className="bg-blue-100 p-2 rounded-lg">
              <Target className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Devices Target</span>
                <span className="text-sm font-medium text-gray-900">78.3%</span>
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78.3%' }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">1,247 / 1,600 devices</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Quality Score</h3>
            <div className="bg-green-100 p-2 rounded-lg">
              <Award className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">94.2%</div>
            <p className="text-sm text-gray-600">Processing Quality</p>
            <p className="text-xs text-gray-500 mt-2">Above industry average</p>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Next Milestone</h3>
            <div className="bg-purple-100 p-2 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">1,500 Devices Collected</p>
            <div className="bg-gray-200 rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: '83.1%' }}></div>
            </div>
            <p className="text-xs text-gray-500">253 devices remaining</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NGOAnalytics;