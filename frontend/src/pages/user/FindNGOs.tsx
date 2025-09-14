import React from 'react';
import { MapPin, Navigation, Phone, Star, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const FindNGOs: React.FC = () => {
  // Mock NGO data
  const ngos = [
    {
      id: 1,
      name: 'GreenTech Recyclers',
      address: '123 Environmental Way, Green City',
      distance: '2.3 km',
      rating: 4.8,
      services: ['Electronics', 'Batteries', 'Computers'],
      phone: '+1 (555) 123-4567',
      hours: 'Mon-Fri: 9AM-6PM',
      verified: true
    },
    {
      id: 2,
      name: 'EcoCenter Foundation',
      address: '456 Sustainability Blvd, Eco Town',
      distance: '3.1 km',
      rating: 4.6,
      services: ['All Electronics', 'Pickup Service'],
      phone: '+1 (555) 987-6543',
      hours: 'Mon-Sat: 8AM-7PM',
      verified: true
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h1 className="text-3xl font-display font-bold text-neutral-800 mb-4">
          Find NGOs & Recycling Centers
        </h1>
        <p className="text-lg text-neutral-600">
          Locate verified organizations near you for device donation and recycling
        </p>
      </div>

      {/* Map Placeholder */}
      <div className="card">
        <div className="h-64 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-16 h-16 text-primary-400 mx-auto mb-4" />
            <p className="text-neutral-600">Interactive Map Integration</p>
            <p className="text-sm text-neutral-500">Google Maps API integration coming soon</p>
          </div>
        </div>
      </div>

      {/* NGO List */}
      <div className="space-y-6">
        <h2 className="text-2xl font-display font-semibold text-neutral-800">
          Nearby Organizations
        </h2>
        <div className="grid gap-6">
          {ngos.map((ngo) => (
            <div key={ngo.id} className="card-hover">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-xl font-semibold text-neutral-800">{ngo.name}</h3>
                    {ngo.verified && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-neutral-600 mb-2">{ngo.address}</p>
                  <div className="flex items-center space-x-4 text-sm text-neutral-500">
                    <span className="flex items-center space-x-1">
                      <Navigation className="w-4 h-4" />
                      <span>{ngo.distance}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>{ngo.rating}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{ngo.hours}</span>
                    </span>
                  </div>
                </div>
                <button className="btn-primary">
                  Select NGO
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {ngo.services.map((service, index) => (
                  <span key={index} className="bg-primary-100 text-primary-700 text-sm px-3 py-1 rounded-lg">
                    {service}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center space-x-4">
                <a href={`tel:${ngo.phone}`} className="btn-secondary text-sm">
                  <Phone className="w-4 h-4 mr-2" />
                  Call
                </a>
                <button className="btn-outline text-sm">
                  <Navigation className="w-4 h-4 mr-2" />
                  Directions
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default FindNGOs;