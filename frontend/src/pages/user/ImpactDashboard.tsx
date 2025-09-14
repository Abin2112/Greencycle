import React, { useState, useEffect } from 'react';
import { BarChart3, Droplets, Leaf, Zap, TrendingUp, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { getUserImpact } from '../../services/userApi';

interface MonthlyData {
  month: string;
  water: number;
  co2: number;
  toxic: number;
}

interface ImpactData {
  totalWaterSaved: number;
  totalCO2Reduced: number;
  totalToxicPrevented: number;
  totalEnergySaved: number;
  devicesProcessed: number;
  monthlyData: MonthlyData[];
}

const ImpactDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [impactData, setImpactData] = useState<ImpactData>({
    totalWaterSaved: 0,
    totalCO2Reduced: 0,
    totalToxicPrevented: 0,
    totalEnergySaved: 0,
    devicesProcessed: 0,
    monthlyData: []
  });
  
  useEffect(() => {
    const fetchImpactData = async () => {
      try {
        setLoading(true);
        const data = await getUserImpact();
        setImpactData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching impact data:', err);
        setError('Failed to load environmental impact data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchImpactData();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h1 className="text-3xl font-display font-bold text-neutral-800 mb-4">
          Environmental Impact Dashboard
        </h1>
        <p className="text-lg text-neutral-600">
          Track your positive contribution to the environment
        </p>
      </div>

      {/* Impact Summary Cards */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-200 animate-pulse"></div>
          <div className="h-6 w-32 bg-neutral-200 mx-auto mb-2 rounded animate-pulse"></div>
          <div className="h-4 w-24 bg-neutral-200 mx-auto rounded animate-pulse"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-red-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-neutral-800 mb-2">Error loading impact data</h3>
          <p className="text-neutral-600 mb-6">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Droplets className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-neutral-800 mb-2">
              {impactData.totalWaterSaved.toLocaleString()}L
            </h3>
            <p className="text-neutral-600">Water Saved</p>
            <p className="text-sm text-green-600 mt-2">
              {impactData.monthlyData && impactData.monthlyData.length > 1 ? '+15% this month' : ''}
            </p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-neutral-800 mb-2">
              {impactData.totalCO2Reduced}kg
            </h3>
            <p className="text-neutral-600">CO₂ Reduced</p>
            <p className="text-sm text-green-600 mt-2">
              {impactData.monthlyData && impactData.monthlyData.length > 1 ? '+22% this month' : ''}
            </p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-neutral-800 mb-2">
              {impactData.totalToxicPrevented}kg
            </h3>
            <p className="text-neutral-600">Toxic Waste Prevented</p>
            <p className="text-sm text-green-600 mt-2">
              {impactData.monthlyData && impactData.monthlyData.length > 1 ? '+8% this month' : ''}
            </p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-neutral-800 mb-2">
              {impactData.totalEnergySaved}kWh
            </h3>
            <p className="text-neutral-600">Energy Saved</p>
            <p className="text-sm text-green-600 mt-2">
              {impactData.monthlyData && impactData.monthlyData.length > 1 ? '+12% this month' : ''}
            </p>
          </div>
        </div>
      )}

      {/* Charts Placeholder */}
      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card">
            <h3 className="text-xl font-display font-semibold text-neutral-800 mb-6">
              Monthly Impact Trend
            </h3>
            <div className="h-64 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 text-primary-400 mx-auto mb-4" />
                <p className="text-neutral-600">Chart.js Integration</p>
                <p className="text-sm text-neutral-500">Interactive charts coming soon</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-xl font-display font-semibold text-neutral-800 mb-6">
              Impact Breakdown
            </h3>
            <div className="h-64 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 text-primary-400 mx-auto mb-4" />
                <p className="text-neutral-600">Pie Chart Integration</p>
                <p className="text-sm text-neutral-500">Device type breakdown coming soon</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Impact */}
      <div className="card">
        <h3 className="text-xl font-display font-semibold text-neutral-800 mb-6">
          Recent Environmental Impact
        </h3>
        <div className="space-y-4">
          {[
            { device: 'iPhone 12 Pro', date: '2024-01-18', impact: { water: 520, co2: 15.6, toxic: 0.8 } },
            { device: 'MacBook Pro', date: '2024-01-15', impact: { water: 1200, co2: 35.2, toxic: 2.1 } },
            { device: 'iPad Air', date: '2024-01-12', impact: { water: 800, co2: 24.1, toxic: 1.3 } }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
              <div>
                <p className="font-medium text-neutral-800">{item.device}</p>
                <p className="text-sm text-neutral-600">{item.date}</p>
              </div>
              <div className="flex space-x-6 text-sm">
                <div className="text-center">
                  <p className="font-bold text-blue-600">{item.impact.water}L</p>
                  <p className="text-neutral-500">Water</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-green-600">{item.impact.co2}kg</p>
                  <p className="text-neutral-500">CO₂</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-purple-600">{item.impact.toxic}kg</p>
                  <p className="text-neutral-500">Toxic</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ImpactDashboard;