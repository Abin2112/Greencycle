import React, { useState, useRef } from 'react';
import { 
  QrCode, 
  Camera, 
  ScanLine, 
  CheckCircle, 
  AlertCircle,
  Package,
  Smartphone,
  Laptop,
  Monitor,
  HardDrive,
  RotateCcw,
  Save,
  Plus,
  FileText,
  MapPin,
  Calendar,
  User,
  Weight,
  Zap,
  Download,
  Upload
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ScannedDevice {
  id: string;
  qrCode: string;
  deviceType: string;
  brand: string;
  model: string;
  serialNumber: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  estimatedValue: number;
  weight: number;
  scannedAt: string;
  location: string;
  user: string;
}

const QRScanner: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [scannedDevices, setScannedDevices] = useState<ScannedDevice[]>([
    {
      id: '1',
      qrCode: 'QR001234567',
      deviceType: 'Smartphone',
      brand: 'iPhone',
      model: '12 Pro',
      serialNumber: 'F2LDN3QG8H6K',
      condition: 'good',
      estimatedValue: 450,
      weight: 0.164,
      scannedAt: '2024-01-15 14:30',
      location: 'Manhattan Collection Center',
      user: 'John Doe'
    },
    {
      id: '2',
      qrCode: 'QR001234568',
      deviceType: 'Laptop',
      brand: 'MacBook',
      model: 'Air M1',
      serialNumber: 'FVFCM3QG8H6K',
      condition: 'excellent',
      estimatedValue: 850,
      weight: 1.29,
      scannedAt: '2024-01-15 14:25',
      location: 'Manhattan Collection Center',
      user: 'Sarah Smith'
    }
  ]);
  const [selectedDevice, setSelectedDevice] = useState<ScannedDevice | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingNotes, setProcessingNotes] = useState('');
  
  const videoRef = useRef<HTMLVideoElement>(null);

  const deviceIcons = {
    Smartphone: Smartphone,
    Laptop: Laptop,
    Monitor: Monitor,
    HardDrive: HardDrive,
    default: Package
  };

  const conditionColors = {
    excellent: 'bg-green-100 text-green-800 border-green-200',
    good: 'bg-blue-100 text-blue-800 border-blue-200',
    fair: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    poor: 'bg-red-100 text-red-800 border-red-200'
  };

  const startScanning = async () => {
    try {
      setIsScanning(true);
      // In real app, this would access camera
      setTimeout(() => {
        const mockQRCode = `QR00123456${Math.floor(Math.random() * 1000)}`;
        setScanResult(mockQRCode);
        setIsScanning(false);
        // Auto-process the scanned QR code
        processQRCode(mockQRCode);
      }, 2000);
    } catch (error) {
      console.error('Error starting camera:', error);
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    setIsScanning(false);
    setScanResult(null);
  };

  const processQRCode = (qrCode: string) => {
    // Mock device data retrieval
    const mockDevice: ScannedDevice = {
      id: Date.now().toString(),
      qrCode,
      deviceType: ['Smartphone', 'Laptop', 'Monitor', 'HardDrive'][Math.floor(Math.random() * 4)],
      brand: ['Apple', 'Samsung', 'Dell', 'HP'][Math.floor(Math.random() * 4)],
      model: 'Model ' + Math.floor(Math.random() * 100),
      serialNumber: 'SN' + Math.random().toString(36).substring(2, 15).toUpperCase(),
      condition: ['excellent', 'good', 'fair', 'poor'][Math.floor(Math.random() * 4)] as any,
      estimatedValue: Math.floor(Math.random() * 1000) + 100,
      weight: Math.random() * 2 + 0.1,
      scannedAt: new Date().toLocaleString(),
      location: 'Manhattan Collection Center',
      user: 'Walk-in Customer'
    };

    setScannedDevices(prev => [mockDevice, ...prev]);
    setSelectedDevice(mockDevice);
  };

  const handleProcessDevice = () => {
    if (!selectedDevice) return;
    
    setIsProcessing(true);
    // Mock processing
    setTimeout(() => {
      setIsProcessing(false);
      setSelectedDevice(null);
      setProcessingNotes('');
      // In real app, update device status in backend
    }, 2000);
  };

  const exportData = () => {
    // Mock export functionality
    const dataStr = JSON.stringify(scannedDevices, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'scanned_devices.json';
    link.click();
  };

  const getDeviceIcon = (deviceType: string) => {
    const IconComponent = deviceIcons[deviceType as keyof typeof deviceIcons] || deviceIcons.default;
    return IconComponent;
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
          <h1 className="text-3xl font-bold text-gray-900">QR Scanner</h1>
          <p className="text-gray-600 mt-1">Scan device QR codes for tracking and processing</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={exportData}
            className="btn-secondary flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </button>
          <button
            onClick={isScanning ? stopScanning : startScanning}
            className={`flex items-center px-4 py-2 rounded-lg font-medium ${
              isScanning 
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isScanning ? (
              <>
                <ScanLine className="h-4 w-4 mr-2" />
                Stop Scanning
              </>
            ) : (
              <>
                <QrCode className="h-4 w-4 mr-2" />
                Start Scanning
              </>
            )}
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scanner Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="lg:col-span-1"
        >
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">QR Code Scanner</h2>
            
            <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-square mb-4">
              {isScanning ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="relative">
                      <motion.div
                        animate={{ 
                          y: [0, 100, 0],
                          opacity: [0.3, 1, 0.3]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="absolute inset-0 border-2 border-blue-500"
                      />
                      <div className="w-48 h-48 border border-white/30 rounded-lg flex items-center justify-center">
                        <Camera className="h-12 w-12 text-white/50" />
                      </div>
                    </div>
                    <p className="mt-4 text-sm">Scanning for QR codes...</p>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-center">
                    <QrCode className="h-16 w-16 text-white/50 mx-auto mb-4" />
                    <p className="text-sm">Click "Start Scanning" to begin</p>
                  </div>
                </div>
              )}
            </div>

            {scanResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 border border-green-200 rounded-lg p-4"
              >
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <span className="font-medium text-green-800">Scan Successful!</span>
                </div>
                <p className="text-sm text-green-600 mt-1">QR Code: {scanResult}</p>
              </motion.div>
            )}

            <div className="mt-4 space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Position QR code within the frame
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                Ensure good lighting
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                Hold camera steady
              </div>
            </div>
          </div>

          {/* Today's Stats */}
          <div className="card mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Devices Scanned</span>
                <span className="font-medium text-gray-900">{scannedDevices.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Value</span>
                <span className="font-medium text-gray-900">
                  ${scannedDevices.reduce((sum, device) => sum + device.estimatedValue, 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Weight</span>
                <span className="font-medium text-gray-900">
                  {scannedDevices.reduce((sum, device) => sum + device.weight, 0).toFixed(2)} kg
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Device List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="lg:col-span-2"
        >
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Scanned Devices</h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {scannedDevices.length} devices
                </span>
                <button className="text-blue-600 hover:text-blue-700">
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {scannedDevices.map((device, index) => {
                const DeviceIcon = getDeviceIcon(device.deviceType);
                return (
                  <motion.div
                    key={device.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.6 }}
                    className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${
                      selectedDevice?.id === device.id ? 'ring-2 ring-blue-500 border-blue-300' : ''
                    }`}
                    onClick={() => setSelectedDevice(device)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <DeviceIcon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-gray-900">
                              {device.brand} {device.model}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${conditionColors[device.condition]}`}>
                              {device.condition}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            QR: {device.qrCode} • SN: {device.serialNumber}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {device.scannedAt}
                            </div>
                            <div className="flex items-center">
                              <User className="h-3 w-3 mr-1" />
                              {device.user}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">${device.estimatedValue}</div>
                        <div className="text-sm text-gray-600">{device.weight.toFixed(2)} kg</div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Device Processing Modal */}
      {selectedDevice && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Device Processing</h2>
                <button
                  onClick={() => setSelectedDevice(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <AlertCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Device Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">{selectedDevice.deviceType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Brand:</span>
                      <span className="font-medium">{selectedDevice.brand}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Model:</span>
                      <span className="font-medium">{selectedDevice.model}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Serial:</span>
                      <span className="font-medium">{selectedDevice.serialNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Condition:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${conditionColors[selectedDevice.condition]}`}>
                        {selectedDevice.condition}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Collection Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">QR Code:</span>
                      <span className="font-medium">{selectedDevice.qrCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Scanned:</span>
                      <span className="font-medium">{selectedDevice.scannedAt}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium">{selectedDevice.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Customer:</span>
                      <span className="font-medium">{selectedDevice.user}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Est. Value:</span>
                      <span className="font-medium text-green-600">${selectedDevice.estimatedValue}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Processing Notes</h3>
                <textarea
                  value={processingNotes}
                  onChange={(e) => setProcessingNotes(e.target.value)}
                  placeholder="Add processing notes, observations, or special instructions..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setSelectedDevice(null)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProcessDevice}
                  disabled={isProcessing}
                  className="btn-primary flex-1 flex items-center justify-center"
                >
                  {isProcessing ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="mr-2"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </motion.div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Process Device
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default QRScanner;