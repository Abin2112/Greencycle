import React from 'react';
import { Calendar, Clock, MapPin, Package, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Pickups: React.FC = () => {
  const pickups = [
    {
      id: 1,
      date: '2024-01-25',
      time: '10:00 AM - 12:00 PM',
      address: '123 Main Street, Apt 4B',
      status: 'scheduled',
      items: ['iPhone 12', 'iPad Air'],
      ngo: 'GreenTech Recyclers',
      pickupPerson: 'John Smith',
      phone: '+1 (555) 123-4567'
    },
    {
      id: 2,
      date: '2024-01-20',
      time: '2:00 PM - 4:00 PM',
      address: '456 Oak Avenue',
      status: 'completed',
      items: ['MacBook Pro'],
      ngo: 'EcoCenter Foundation',
      pickupPerson: 'Sarah Johnson',
      phone: '+1 (555) 987-6543'
    }
  ];

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
        {pickups.map((pickup) => (
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
        ))}
      </div>
    </motion.div>
  );
};

export default Pickups;