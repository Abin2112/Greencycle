import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  MapPin,
  Clock,
  User,
  Phone,
  Mail,
  Eye,
  CheckCircle,
  XCircle,
  Truck,
  Calendar,
  AlertCircle,
  MoreHorizontal,
  Download,
  Plus,
  Navigation
} from 'lucide-react';
import { motion } from 'framer-motion';

interface CollectionRequest {
  id: string;
  requestNumber: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  address: string;
  city: string;
  devices: Array<{
    type: string;
    brand: string;
    model: string;
    condition: string;
    quantity: number;
  }>;
  status: 'pending' | 'approved' | 'in_transit' | 'collected' | 'processed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  requestDate: string;
  scheduledDate?: string;
  notes: string;
  estimatedValue: number;
  distance: number;
}

const RequestManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  // Mock data - in real app, this would come from API
  const requests: CollectionRequest[] = [
    {
      id: '1',
      requestNumber: 'REQ-2024-001',
      userName: 'John Doe',
      userEmail: 'john.doe@email.com',
      userPhone: '+1 (555) 123-4567',
      address: '123 Main St, Apt 4B',
      city: 'New York, NY 10001',
      devices: [
        { type: 'Laptop', brand: 'Dell', model: 'XPS 13', condition: 'Good', quantity: 1 },
        { type: 'Mobile Phone', brand: 'iPhone', model: '12 Pro', condition: 'Fair', quantity: 1 }
      ],
      status: 'pending',
      priority: 'medium',
      requestDate: '2024-09-12',
      notes: 'Available weekdays after 5 PM',
      estimatedValue: 450,
      distance: 2.3
    },
    {
      id: '2',
      requestNumber: 'REQ-2024-002',
      userName: 'Sarah Wilson',
      userEmail: 'sarah.wilson@email.com',
      userPhone: '+1 (555) 987-6543',
      address: '456 Oak Avenue',
      city: 'Brooklyn, NY 11201',
      devices: [
        { type: 'Desktop PC', brand: 'HP', model: 'Pavilion', condition: 'Poor', quantity: 1 },
        { type: 'Monitor', brand: 'Samsung', model: '24"', condition: 'Good', quantity: 2 }
      ],
      status: 'approved',
      priority: 'high',
      requestDate: '2024-09-10',
      scheduledDate: '2024-09-15',
      notes: 'Heavy items - need assistance',
      estimatedValue: 280,
      distance: 4.7
    },
    {
      id: '3',
      requestNumber: 'REQ-2024-003',
      userName: 'Mike Johnson',
      userEmail: 'mike.johnson@email.com',
      userPhone: '+1 (555) 456-7890',
      address: '789 Pine Street',
      city: 'Queens, NY 11375',
      devices: [
        { type: 'Tablet', brand: 'iPad', model: 'Air 2', condition: 'Excellent', quantity: 1 },
        { type: 'Chargers', brand: 'Various', model: 'Mixed', condition: 'Good', quantity: 5 }
      ],
      status: 'in_transit',
      priority: 'low',
      requestDate: '2024-09-08',
      scheduledDate: '2024-09-14',
      notes: 'Contactless pickup preferred',
      estimatedValue: 320,
      distance: 6.2
    },
    {
      id: '4',
      requestNumber: 'REQ-2024-004',
      userName: 'Emily Davis',
      userEmail: 'emily.davis@email.com',
      userPhone: '+1 (555) 321-0987',
      address: '321 Elm Street',
      city: 'Manhattan, NY 10002',
      devices: [
        { type: 'Smartphone', brand: 'Samsung', model: 'Galaxy S20', condition: 'Good', quantity: 2 },
        { type: 'Headphones', brand: 'Sony', model: 'WH-1000XM4', condition: 'Excellent', quantity: 1 }
      ],
      status: 'collected',
      priority: 'medium',
      requestDate: '2024-09-05',
      scheduledDate: '2024-09-12',
      notes: 'All original packaging included',
      estimatedValue: 680,
      distance: 1.8
    }
  ];

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.requestNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || request.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'approved': return 'text-blue-600 bg-blue-100';
      case 'in_transit': return 'text-purple-600 bg-purple-100';
      case 'collected': return 'text-green-600 bg-green-100';
      case 'processed': return 'text-gray-600 bg-gray-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'in_transit': return <Truck className="h-4 w-4" />;
      case 'collected': return <Package className="h-4 w-4" />;
      case 'processed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleSelectRequest = (requestId: string) => {
    setSelectedRequests(prev => 
      prev.includes(requestId) 
        ? prev.filter(id => id !== requestId)
        : [...prev, requestId]
    );
  };

  const handleSelectAll = () => {
    if (selectedRequests.length === filteredRequests.length) {
      setSelectedRequests([]);
    } else {
      setSelectedRequests(filteredRequests.map(request => request.id));
    }
  };

  const handleApproveRequest = (requestId: string) => {
    console.log('Approving request:', requestId);
    // Implementation for approving request
  };

  const handleSchedulePickup = (requestId: string) => {
    console.log('Scheduling pickup for:', requestId);
    // Implementation for scheduling pickup
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
          <h1 className="text-3xl font-bold text-gray-900">Collection Requests</h1>
          <p className="text-gray-600 mt-1">Manage and process e-waste collection requests</p>
        </div>
        <div className="flex space-x-3">
          <button className="btn-secondary flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button className="btn-primary flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            New Request
          </button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="card">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-xl">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-gray-600 text-sm">Pending</p>
              <p className="text-2xl font-bold text-gray-900">23</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-xl">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-gray-600 text-sm">Approved</p>
              <p className="text-2xl font-bold text-gray-900">15</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-xl">
              <Truck className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-gray-600 text-sm">In Transit</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-xl">
              <Package className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-gray-600 text-sm">Collected</p>
              <p className="text-2xl font-bold text-gray-900">142</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="card"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, request number, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-80"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="in_transit">In Transit</option>
              <option value="collected">Collected</option>
              <option value="processed">Processed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            {selectedRequests.length > 0 && (
              <>
                <span className="text-sm text-gray-600">{selectedRequests.length} selected</span>
                <button className="btn-secondary text-sm">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve
                </button>
                <button className="btn-secondary text-sm">
                  <Calendar className="h-4 w-4 mr-1" />
                  Schedule
                </button>
              </>
            )}
            <div className="flex border rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 text-sm ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
              >
                List
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-3 py-2 text-sm ${viewMode === 'map' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
              >
                Map
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Requests List */}
      {viewMode === 'list' ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="space-y-4"
        >
          {filteredRequests.map((request, index) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.6 }}
              className="card hover:shadow-lg transition-all border-l-4 border-blue-500"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedRequests.includes(request.id)}
                    onChange={() => handleSelectRequest(request.id)}
                    className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{request.requestNumber}</h3>
                        <p className="text-sm text-gray-600">{request.userName}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                          {request.priority.toUpperCase()}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {getStatusIcon(request.status)}
                          <span className="ml-1 capitalize">{request.status.replace('_', ' ')}</span>
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                          <User className="h-4 w-4 mr-2" />
                          Contact Information
                        </div>
                        <p className="text-sm text-gray-900">{request.userEmail}</p>
                        <p className="text-sm text-gray-900">{request.userPhone}</p>
                      </div>
                      
                      <div>
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                          <MapPin className="h-4 w-4 mr-2" />
                          Location
                        </div>
                        <p className="text-sm text-gray-900">{request.address}</p>
                        <p className="text-sm text-gray-900">{request.city}</p>
                        <p className="text-xs text-gray-500">{request.distance} km away</p>
                      </div>
                      
                      <div>
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                          <Calendar className="h-4 w-4 mr-2" />
                          Dates
                        </div>
                        <p className="text-sm text-gray-900">Requested: {new Date(request.requestDate).toLocaleDateString()}</p>
                        {request.scheduledDate && (
                          <p className="text-sm text-gray-900">Scheduled: {new Date(request.scheduledDate).toLocaleDateString()}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Devices:</h4>
                      <div className="flex flex-wrap gap-2">
                        {request.devices.map((device, deviceIndex) => (
                          <span key={deviceIndex} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                            {device.quantity}x {device.type} - {device.brand} {device.model} ({device.condition})
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">Estimated Value: ${request.estimatedValue}</p>
                    </div>
                    
                    {request.notes && (
                      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-start">
                          <AlertCircle className="h-4 w-4 text-yellow-600 mr-2 mt-0.5" />
                          <p className="text-sm text-yellow-800">{request.notes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                    <Navigation className="h-4 w-4" />
                  </button>
                  {request.status === 'pending' && (
                    <button 
                      onClick={() => handleApproveRequest(request.id)}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200 transition-colors"
                    >
                      Approve
                    </button>
                  )}
                  {(request.status === 'approved' || request.status === 'pending') && (
                    <button 
                      onClick={() => handleSchedulePickup(request.id)}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors"
                    >
                      Schedule
                    </button>
                  )}
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="card h-96 flex items-center justify-center"
        >
          <div className="text-center">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Map View</h3>
            <p className="text-gray-600">Interactive map showing collection request locations</p>
            <p className="text-sm text-gray-500 mt-2">Map integration would be implemented here</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default RequestManagement;