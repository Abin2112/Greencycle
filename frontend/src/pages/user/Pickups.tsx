import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Package, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { getUserPickups, schedulePickup } from '../../services/userApi';

interface PickupItem {
  id: number;
  date: string;
  time: string;
  address: string;
  status: string;
  items: string[];
  ngo: string;
  pickupPerson: string;
  phone: string;
}

const Pickups: React.FC = () => {
  const [pickups, setPickups] = useState<PickupItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchPickups = async () => {
      try {
        setLoading(true);
        const data = await getUserPickups();
        setPickups(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching pickups:', err);
        setError('Failed to load pickup data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPickups();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-neutral-800 mb-2">
            Pickup Schedule
          </h1>
          <p className="text-neutral-600">
            Manage your device pickup appointments
          </p>
        </div>
        <button className="btn-primary">
          <Calendar className="w-5 h-5 mr-2" />
          Schedule Pickup
        </button>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-neutral-300 mx-auto mb-4 animate-pulse" />
            <h3 className="text-lg font-medium text-neutral-800 mb-2">Loading pickups...</h3>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-red-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-800 mb-2">Error loading pickups</h3>
            <p className="text-neutral-600 mb-6">{error}</p>
          </div>
        ) : pickups.length > 0 ? (
          pickups.map((pickup) => (
            <div key={pickup.id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    pickup.status === 'completed' ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    {pickup.status === 'completed' ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <Calendar className="w-6 h-6 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-800">
                      Pickup #{pickup.id.toString().padStart(3, '0')}
                    </h3>
                    <p className="text-neutral-600">{pickup.ngo}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  pickup.status === 'completed' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {pickup.status}
                </span>
              </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-neutral-400" />
                <span className="text-neutral-700">{pickup.date}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-neutral-400" />
                <span className="text-neutral-700">{pickup.time}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-neutral-400" />
                <span className="text-neutral-700">{pickup.address}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Package className="w-5 h-5 text-neutral-400" />
                <span className="text-neutral-700">
                  {pickup.items.length} items: {pickup.items.join(', ')}
                </span>
              </div>
              {pickup.status === 'scheduled' && (
                <div className="flex space-x-2">
                  <button className="btn-secondary text-sm">Reschedule</button>
                  <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
          ))
        ) : (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-800 mb-2">No pickups scheduled</h3>
            <p className="text-neutral-600 mb-6">
              Schedule a pickup to recycle or donate your devices
            </p>
            <button className="btn-primary">
              <Calendar className="w-5 h-5 mr-2" />
              Schedule Pickup
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Pickups;