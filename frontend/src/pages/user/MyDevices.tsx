import React, { useState, useEffect } from 'react';
import { Search, Filter, Smartphone, Eye, Download, MapPin, Calendar, MoreVertical, X, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import QRCode from 'react-qr-code';
import { getUserDevices, getDeviceDetails } from '../../services/userApi';

// Define device and related types
interface DeviceImpact {
  waterSaved: number;
  co2Reduced: number;
  toxicPrevented: number;
}

interface DeviceValuation {
  suggestion: string;
  estimatedValue: number;
  reason: string;
}

interface Device {
  id: string;
  name: string;
  type: string;
  brand: string;
  model: string;
  serialNumber: string;
  status: string;
  condition: string;
  uploadDate: string;
  processedDate: string | null;
  qrCode: string;
  valuation: DeviceValuation | null;
  impact: DeviceImpact | null;
  images: string[];
}

const MyDevices: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deviceDetail, setDeviceDetail] = useState<Device | null>(null);
  
  // Fetch user devices on component mount
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        setLoading(true);
        const data = await getUserDevices();
        setDevices(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching devices:', err);
        setError('Failed to load devices. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDevices();
  }, []);
  
  // Fetch device details when a device is selected
  useEffect(() => {
    if (selectedDevice) {
      const fetchDeviceDetails = async () => {
        try {
          const data = await getDeviceDetails(selectedDevice);
          setDeviceDetail(data);
        } catch (err) {
          console.error('Error fetching device details:', err);
        }
      };
      
      fetchDeviceDetails();
    } else {
      setDeviceDetail(null);
    }
  }, [selectedDevice]);

  const statusColors = {
    uploaded: 'bg-blue-100 text-blue-800',
    pending_pickup: 'bg-yellow-100 text-yellow-800',
    picked_up: 'bg-orange-100 text-orange-800',
    received: 'bg-purple-100 text-purple-800',
    processing: 'bg-indigo-100 text-indigo-800',
    refurbished: 'bg-green-100 text-green-800',
    donated: 'bg-emerald-100 text-emerald-800',
    recycled: 'bg-gray-100 text-gray-800'
  };

  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || device.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const DeviceCard = ({ device }: { device: typeof devices[0] }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-hover"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-neutral-800">{device.name}</h3>
            <p className="text-sm text-neutral-600">{device.brand} • {device.model}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-lg text-xs font-medium ${statusColors[device.status as keyof typeof statusColors]}`}>
            {device.status.replace('_', ' ')}
          </span>
          <button className="p-1 hover:bg-neutral-100 rounded">
            <MoreVertical className="w-4 h-4 text-neutral-400" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-neutral-500">Condition</p>
          <p className="font-medium text-neutral-700 capitalize">{device.condition}</p>
        </div>
        <div>
          <p className="text-xs text-neutral-500">Upload Date</p>
          <p className="font-medium text-neutral-700">{device.uploadDate}</p>
        </div>
        <div>
          <p className="text-xs text-neutral-500">Serial Number</p>
          <p className="font-medium text-neutral-700 font-mono text-sm">{device.serialNumber}</p>
        </div>
        <div>
          <p className="text-xs text-neutral-500">QR Code</p>
          <p className="font-medium text-neutral-700 font-mono text-sm">{device.qrCode}</p>
        </div>
      </div>

      {device.impact && (
        <div className="bg-green-50 rounded-xl p-4 mb-4">
          <p className="text-sm font-medium text-green-800 mb-2">Environmental Impact</p>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-lg font-bold text-green-700">{device.impact.waterSaved}L</p>
              <p className="text-xs text-green-600">Water Saved</p>
            </div>
            <div>
              <p className="text-lg font-bold text-green-700">{device.impact.co2Reduced}kg</p>
              <p className="text-xs text-green-600">CO₂ Reduced</p>
            </div>
            <div>
              <p className="text-lg font-bold text-green-700">{device.impact.toxicPrevented}kg</p>
              <p className="text-xs text-green-600">Toxic Prevented</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSelectedDevice(device.id)}
            className="text-sm text-primary-600 hover:text-primary-500 font-medium flex items-center space-x-1"
          >
            <Eye className="w-4 h-4" />
            <span>View Details</span>
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg">
            <Download className="w-4 h-4" />
          </button>
          <button className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg">
            <MapPin className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-neutral-800 mb-2">
            My Devices
          </h1>
          <p className="text-neutral-600">
            Track and manage all your uploaded devices
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <span className="text-sm text-neutral-500">
            {filteredDevices.length} of {devices.length} devices
          </span>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-neutral-400" />
            </div>
            <input
              type="text"
              placeholder="Search devices..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="sm:w-48">
            <select
              className="input-field"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="uploaded">Uploaded</option>
              <option value="pending_pickup">Pending Pickup</option>
              <option value="processing">Processing</option>
              <option value="donated">Donated</option>
              <option value="recycled">Recycled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Devices Grid */}
      {loading ? (
        <div className="text-center py-12">
          <Smartphone className="w-16 h-16 text-neutral-300 mx-auto mb-4 animate-pulse" />
          <h3 className="text-lg font-medium text-neutral-800 mb-2">Loading devices...</h3>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-red-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-neutral-800 mb-2">Error loading devices</h3>
          <p className="text-neutral-600 mb-6">{error}</p>
        </div>
      ) : filteredDevices.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredDevices.map((device) => (
            <DeviceCard key={device.id} device={device} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Smartphone className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-neutral-800 mb-2">No devices found</h3>
          <p className="text-neutral-600 mb-6">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filters' 
              : 'Upload your first device to get started'
            }
          </p>
        </div>
      )}

      {/* Device Detail Modal */}
      {selectedDevice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display font-bold text-neutral-800">
                  Device Details
                </h2>
                <button
                  onClick={() => setSelectedDevice(null)}
                  className="p-2 hover:bg-neutral-100 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {(() => {
                const device = devices.find(d => d.id === selectedDevice);
                if (!device) return null;

                return (
                  <div className="space-y-6">
                    {/* QR Code */}
                    <div className="text-center p-6 bg-neutral-50 rounded-xl">
                      <div className="w-32 h-32 mx-auto mb-4 bg-white p-4 rounded-lg">
                        <QRCode value={device.qrCode} size={96} />
                      </div>
                      <p className="font-mono text-sm text-neutral-600">{device.qrCode}</p>
                    </div>

                    {/* Device Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-neutral-500">Device</p>
                        <p className="font-medium text-neutral-800">{device.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-500">Status</p>
                        <span className={`inline-block px-2 py-1 rounded-lg text-xs font-medium ${statusColors[device.status as keyof typeof statusColors]}`}>
                          {device.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-500">Brand & Model</p>
                        <p className="font-medium text-neutral-800">{device.brand} {device.model}</p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-500">Condition</p>
                        <p className="font-medium text-neutral-800 capitalize">{device.condition}</p>
                      </div>
                    </div>

                    {/* Valuation */}
                    {device.valuation && (
                      <div className="p-4 bg-blue-50 rounded-xl">
                        <h3 className="font-medium text-blue-800 mb-2">AI Valuation</h3>
                        <p className="text-sm text-blue-700 mb-2">
                          <strong>Suggestion:</strong> {device.valuation.suggestion}
                        </p>
                        {device.valuation.estimatedValue > 0 && (
                          <p className="text-sm text-blue-700 mb-2">
                            <strong>Estimated Value:</strong> ${device.valuation.estimatedValue}
                          </p>
                        )}
                        <p className="text-sm text-blue-700">
                          <strong>Reason:</strong> {device.valuation.reason}
                        </p>
                      </div>
                    )}

                    {/* Impact */}
                    {device.impact && (
                      <div className="p-4 bg-green-50 rounded-xl">
                        <h3 className="font-medium text-green-800 mb-3">Environmental Impact</h3>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-green-700">{device.impact.waterSaved}L</p>
                            <p className="text-sm text-green-600">Water Saved</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-green-700">{device.impact.co2Reduced}kg</p>
                            <p className="text-sm text-green-600">CO₂ Reduced</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-green-700">{device.impact.toxicPrevented}kg</p>
                            <p className="text-sm text-green-600">Toxic Prevented</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MyDevices;