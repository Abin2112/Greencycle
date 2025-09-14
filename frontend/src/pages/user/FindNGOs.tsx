/// <reference types="@types/google.maps" />

import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Phone, Star, Clock, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

const FindNGOs: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoading, setMapLoading] = useState(true);
  const [mapError, setMapError] = useState(false);

  // Mumbai-based NGO data
  const ngos = [
    {
      id: 1,
      name: 'Saahas Zero Waste',
      address: 'Andheri East, Mumbai, Maharashtra 400069',
      latitude: 19.1136,
      longitude: 72.8697,
      distance: '3.2 km',
      rating: 4.7,
      services: ['Electronics Recycling', 'E-waste Collection', 'Data Destruction'],
      phone: '+91 80 4718 3015',
      hours: 'Mon-Sat: 9AM-6PM',
      verified: true
    },
    {
      id: 2,
      name: 'Attero Recycling',
      address: 'Lower Parel, Mumbai, Maharashtra 400013',
      latitude: 19.0176,
      longitude: 72.8383,
      distance: '5.1 km',
      rating: 4.5,
      services: ['Electronics', 'Mobile Phones', 'Computers', 'Batteries'],
      phone: '+91 22 6132 8000',
      hours: 'Mon-Fri: 10AM-7PM',
      verified: true
    },
    {
      id: 3,
      name: 'Green Yatra E-Waste Management',
      address: 'Bandra West, Mumbai, Maharashtra 400050',
      latitude: 19.0596,
      longitude: 72.8295,
      distance: '2.8 km',
      rating: 4.6,
      services: ['E-waste Collection', 'Refurbishment', 'Safe Disposal'],
      phone: '+91 22 2640 5050',
      hours: 'Mon-Sat: 9AM-6PM',
      verified: true
    },
    {
      id: 4,
      name: 'Mumbai Recycle Hub',
      address: 'Powai, Mumbai, Maharashtra 400076',
      latitude: 19.1197,
      longitude: 72.9056,
      distance: '6.5 km',
      rating: 4.4,
      services: ['All Electronics', 'Pickup Service', 'Corporate E-waste'],
      phone: '+91 22 4567 8900',
      hours: 'Mon-Fri: 8AM-8PM, Sat: 9AM-5PM',
      verified: true
    },
    {
      id: 5,
      name: 'EcoReco India',
      address: 'Malad West, Mumbai, Maharashtra 400064',
      latitude: 19.1864,
      longitude: 72.8493,
      distance: '4.7 km',
      rating: 4.3,
      services: ['Electronics', 'Home Appliances', 'IT Equipment'],
      phone: '+91 22 3456 7890',
      hours: 'Mon-Sat: 10AM-7PM',
      verified: true
    }
  ];

  useEffect(() => {
    const initializeMap = () => {
      if (mapRef.current && window.google) {
        try {
          setMapLoading(true);
          // Center the map on Mumbai, India
          const mumbaiCenter = { lat: 19.0760, lng: 72.8777 };
          
          const map = new google.maps.Map(mapRef.current, {
            center: mumbaiCenter,
            zoom: 11,
            styles: [
              {
                featureType: 'poi.business',
                stylers: [{ visibility: 'off' }]
              }
            ]
          });

          // Add markers for each NGO
          ngos.forEach((ngo) => {
            const marker = new google.maps.Marker({
              position: { lat: ngo.latitude, lng: ngo.longitude },
              map,
              title: ngo.name,
              icon: {
                url: 'data:image/svg+xml;base64,' + btoa(`
                  <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="16" cy="16" r="14" fill="#10b981" stroke="#ffffff" stroke-width="2"/>
                    <path d="M12 16l4 4 8-8" stroke="#ffffff" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                `),
                scaledSize: new google.maps.Size(32, 32)
              }
            });

            // Add info window
            const infoWindow = new google.maps.InfoWindow({
              content: `
                <div style="padding: 8px; max-width: 250px;">
                  <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 16px; font-weight: 600;">${ngo.name}</h3>
                  <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 14px;">${ngo.address}</p>
                  <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 12px;">⭐ ${ngo.rating} • ${ngo.distance}</p>
                  <p style="margin: 0; color: #059669; font-size: 12px; font-weight: 500;">${ngo.services.slice(0, 2).join(', ')}</p>
                </div>
              `
            });

            marker.addListener('click', () => {
              infoWindow.open(map, marker);
            });
          });
          
          setMapLoading(false);
          setMapError(false);
        } catch (error) {
          console.error('Error initializing map:', error);
          setMapLoading(false);
          setMapError(true);
        }
      } else if (!window.google) {
        // Google Maps not loaded yet, try again in a bit
        setTimeout(initializeMap, 100);
      }
    };

    initializeMap();
  }, [ngos]);

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

      {/* Google Map */}
      <div className="card">
        <div className="relative">
          {mapLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-xl z-10">
              <div className="flex items-center space-x-2">
                <Loader className="w-6 h-6 animate-spin text-primary-600" />
                <span className="text-neutral-600">Loading map...</span>
              </div>
            </div>
          )}
          {mapError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-xl z-10">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-neutral-600">Unable to load map</p>
                <p className="text-sm text-neutral-500">Please check your internet connection</p>
              </div>
            </div>
          )}
          <div ref={mapRef} className="h-64 rounded-xl" />
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