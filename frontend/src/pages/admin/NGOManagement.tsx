import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Edit,
  Trash2,
  Download,
  Plus,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Users,
  Package
} from 'lucide-react';
import { motion } from 'framer-motion';

interface NGO {
  id: string;
  name: string;
  email: string;
  phone: string;
  registrationNumber: string;
  status: 'active' | 'pending' | 'rejected' | 'suspended';
  joinDate: string;
  lastActive: string;
  devicesProcessed: number;
  location: string;
  services: string[];
  contactPerson: string;
  certifications: string[];
}

const NGOManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedNGOs, setSelectedNGOs] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Mock data - in real app, this would come from API
  const ngos: NGO[] = [
    {
      id: '1',
      name: 'EcoRecycle Solutions',
      email: 'contact@ecorecycle.org',
      phone: '+1 (555) 123-4567',
      registrationNumber: 'NGO-2023-001',
      status: 'active',
      joinDate: '2023-01-15',
      lastActive: '2 hours ago',
      devicesProcessed: 1247,
      location: 'San Francisco, CA',
      services: ['Device Collection', 'Data Destruction', 'Refurbishment'],
      contactPerson: 'Sarah Johnson',
      certifications: ['ISO 14001', 'R2 Certified']
    },
    {
      id: '2',
      name: 'GreenTech Initiative',
      email: 'admin@greentech.com',
      phone: '+1 (555) 987-6543',
      registrationNumber: 'NGO-2024-012',
      status: 'pending',
      joinDate: '2024-09-01',
      lastActive: '1 day ago',
      devicesProcessed: 0,
      location: 'Austin, TX',
      services: ['Device Collection', 'Recycling'],
      contactPerson: 'Mike Chen',
      certifications: ['Pending Review']
    },
    {
      id: '3',
      name: 'Digital Waste Warriors',
      email: 'info@digitalwarriors.org',
      phone: '+1 (555) 456-7890',
      registrationNumber: 'NGO-2023-087',
      status: 'active',
      joinDate: '2023-08-20',
      lastActive: '5 minutes ago',
      devicesProcessed: 892,
      location: 'New York, NY',
      services: ['Device Collection', 'Education Programs', 'Data Destruction'],
      contactPerson: 'Emma Rodriguez',
      certifications: ['ISO 14001', 'NAID AAA']
    },
    {
      id: '4',
      name: 'TechCycle Foundation',
      email: 'hello@techcycle.org',
      phone: '+1 (555) 321-0987',
      registrationNumber: 'NGO-2024-003',
      status: 'rejected',
      joinDate: '2024-03-10',
      lastActive: '2 weeks ago',
      devicesProcessed: 0,
      location: 'Los Angeles, CA',
      services: ['Device Collection'],
      contactPerson: 'David Kim',
      certifications: ['None']
    },
    {
      id: '5',
      name: 'Planet Protectors NGO',
      email: 'contact@planetprotectors.org',
      phone: '+1 (555) 654-3210',
      registrationNumber: 'NGO-2023-156',
      status: 'suspended',
      joinDate: '2023-11-05',
      lastActive: '1 month ago',
      devicesProcessed: 423,
      location: 'Seattle, WA',
      services: ['Device Collection', 'Recycling', 'Refurbishment'],
      contactPerson: 'Lisa Thompson',
      certifications: ['R2 Certified']
    }
  ];

  const filteredNGOs = ngos.filter(ngo => {
    const matchesSearch = ngo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ngo.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ngo.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || ngo.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'suspended': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'suspended': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleSelectNGO = (ngoId: string) => {
    setSelectedNGOs(prev => 
      prev.includes(ngoId) 
        ? prev.filter(id => id !== ngoId)
        : [...prev, ngoId]
    );
  };

  const handleSelectAll = () => {
    if (selectedNGOs.length === filteredNGOs.length) {
      setSelectedNGOs([]);
    } else {
      setSelectedNGOs(filteredNGOs.map(ngo => ngo.id));
    }
  };

  const handleApprove = (ngoId: string) => {
    console.log('Approving NGO:', ngoId);
    // Implementation for approving NGO
  };

  const handleReject = (ngoId: string) => {
    console.log('Rejecting NGO:', ngoId);
    // Implementation for rejecting NGO
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
          <h1 className="text-3xl font-bold text-gray-900">NGO Management</h1>
          <p className="text-gray-600 mt-1">Manage NGO registrations, approvals, and monitoring</p>
        </div>
        <div className="flex space-x-3">
          <button className="btn-secondary flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export NGOs
          </button>
          <button className="btn-primary flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Add NGO
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
            <div className="bg-blue-100 p-3 rounded-xl">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-gray-600 text-sm">Total NGOs</p>
              <p className="text-2xl font-bold text-gray-900">156</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-xl">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-gray-600 text-sm">Active NGOs</p>
              <p className="text-2xl font-bold text-gray-900">142</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-xl">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-gray-600 text-sm">Pending</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-xl">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-gray-600 text-sm">Suspended</p>
              <p className="text-2xl font-bold text-gray-900">6</p>
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
                placeholder="Search NGOs by name, email, or registration..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent w-full md:w-80"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            {selectedNGOs.length > 0 && (
              <>
                <span className="text-sm text-gray-600">{selectedNGOs.length} selected</span>
                <button className="btn-secondary text-sm">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve
                </button>
                <button className="btn-secondary text-sm">
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </button>
              </>
            )}
            <div className="flex border rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-2 text-sm ${viewMode === 'table' ? 'bg-red-600 text-white' : 'bg-white text-gray-600'}`}
              >
                Table
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-2 text-sm ${viewMode === 'cards' ? 'bg-red-600 text-white' : 'bg-white text-gray-600'}`}
              >
                Cards
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* NGOs Table/Cards Display */}
      {viewMode === 'table' ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="card overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedNGOs.length === filteredNGOs.length && filteredNGOs.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    NGO Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Devices Processed
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Services
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredNGOs.map((ngo) => (
                  <tr key={ngo.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedNGOs.includes(ngo.id)}
                        onChange={() => handleSelectNGO(ngo.id)}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{ngo.name}</div>
                          <div className="text-sm text-gray-500">{ngo.email}</div>
                          <div className="text-xs text-gray-400 flex items-center mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            {ngo.location}
                          </div>
                          <div className="text-xs text-gray-400">Reg: {ngo.registrationNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ngo.status)}`}>
                        {getStatusIcon(ngo.status)}
                        <span className="ml-1 capitalize">{ngo.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{ngo.devicesProcessed}</div>
                      <div className="text-xs text-gray-500">devices</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {ngo.services.slice(0, 2).map((service, index) => (
                          <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                            {service}
                          </span>
                        ))}
                        {ngo.services.length > 2 && (
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                            +{ngo.services.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        {ngo.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleApprove(ngo.id)}
                              className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleReject(ngo.id)}
                              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredNGOs.map((ngo, index) => (
            <motion.div
              key={ngo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.6 }}
              className="card hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-gray-900">{ngo.name}</h3>
                    <p className="text-sm text-gray-500">{ngo.registrationNumber}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ngo.status)}`}>
                  {getStatusIcon(ngo.status)}
                  <span className="ml-1 capitalize">{ngo.status}</span>
                </span>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  {ngo.email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  {ngo.phone}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {ngo.location}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  Contact: {ngo.contactPerson}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Package className="h-4 w-4 mr-2" />
                  {ngo.devicesProcessed} devices processed
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Services:</p>
                <div className="flex flex-wrap gap-1">
                  {ngo.services.map((service, index) => (
                    <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                      {service}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="h-3 w-3 mr-1" />
                  Joined {new Date(ngo.joinDate).toLocaleDateString()}
                </div>
                <div className="flex space-x-2">
                  {ngo.status === 'pending' && (
                    <>
                      <button 
                        onClick={() => handleApprove(ngo.id)}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200 transition-colors"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleReject(ngo.id)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200 transition-colors"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default NGOManagement;