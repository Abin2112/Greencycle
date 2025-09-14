import React, { useState } from 'react';
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Calendar,
  Award,
  Users,
  FileText,
  Edit3,
  Save,
  X,
  Upload,
  CheckCircle,
  AlertCircle,
  Clock,
  Camera,
  Star,
  Badge
} from 'lucide-react';
import { motion } from 'framer-motion';

const NGOProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - in real app, this would come from API
  const [profileData, setProfileData] = useState({
    organizationName: 'EcoTech Solutions',
    registrationNumber: 'NGO-2021-00456',
    establishedYear: '2018',
    email: 'contact@ecotechsolutions.org',
    phone: '+1 (555) 123-4567',
    website: 'www.ecotechsolutions.org',
    address: '123 Green Street, Manhattan, NY 10001',
    description: 'We are a non-profit organization dedicated to sustainable e-waste management and environmental protection. Our mission is to create a circular economy for electronic devices through innovative recycling and refurbishment programs.',
    services: [
      'E-waste Collection',
      'Device Refurbishment',
      'Data Destruction',
      'Environmental Consulting',
      'Community Education'
    ],
    operatingHours: {
      monday: '9:00 AM - 6:00 PM',
      tuesday: '9:00 AM - 6:00 PM',
      wednesday: '9:00 AM - 6:00 PM',
      thursday: '9:00 AM - 6:00 PM',
      friday: '9:00 AM - 6:00 PM',
      saturday: '10:00 AM - 4:00 PM',
      sunday: 'Closed'
    },
    teamSize: 24,
    yearlyCapacity: '5,000 devices',
    specializations: ['Mobile Devices', 'Computers', 'Home Appliances', 'Industrial Equipment']
  });

  const certifications = [
    {
      title: 'ISO 14001 Environmental Management',
      issuer: 'International Organization for Standardization',
      issuedDate: '2023-03-15',
      expiryDate: '2026-03-15',
      status: 'active',
      icon: Award
    },
    {
      title: 'R2 (Responsible Recycling) Standard',
      issuer: 'SERI (Sustainable Electronics Recycling International)',
      issuedDate: '2022-11-20',
      expiryDate: '2025-11-20',
      status: 'active',
      icon: CheckCircle
    },
    {
      title: 'EPA Hazardous Waste Handler',
      issuer: 'Environmental Protection Agency',
      issuedDate: '2023-01-10',
      expiryDate: '2024-01-10',
      status: 'expiring_soon',
      icon: AlertCircle
    },
    {
      title: 'NAID AAA Data Destruction',
      issuer: 'National Association for Information Destruction',
      issuedDate: '2022-08-05',
      expiryDate: '2025-08-05',
      status: 'active',
      icon: Badge
    }
  ];

  const achievements = [
    {
      title: 'Top Performer 2023',
      description: 'Highest collection rate in Manhattan region',
      date: '2023-12-15',
      icon: Star,
      color: 'yellow'
    },
    {
      title: 'Environmental Excellence Award',
      description: 'Recognized for outstanding environmental impact',
      date: '2023-09-20',
      icon: Award,
      color: 'green'
    },
    {
      title: '1000+ Devices Milestone',
      description: 'Successfully processed over 1000 devices',
      date: '2023-06-10',
      icon: CheckCircle,
      color: 'blue'
    },
    {
      title: 'Community Champion',
      description: 'Outstanding community engagement and education',
      date: '2023-03-05',
      icon: Users,
      color: 'purple'
    }
  ];

  const stats = [
    { label: 'Devices Processed', value: '1,247', icon: FileText },
    { label: 'Active Partnerships', value: '28', icon: Users },
    { label: 'Years of Service', value: '5', icon: Calendar },
    { label: 'Customer Rating', value: '4.9', icon: Star }
  ];

  const handleSave = () => {
    // In real app, this would save to API
    setIsEditing(false);
  };

  const handleCancel = () => {
    // In real app, this would revert changes
    setIsEditing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'expiring_soon':
        return 'text-yellow-600 bg-yellow-100';
      case 'expired':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'expiring_soon':
        return 'Expiring Soon';
      case 'expired':
        return 'Expired';
      default:
        return 'Unknown';
    }
  };

  const getAchievementColor = (color: string) => {
    const colors = {
      yellow: 'bg-yellow-100 text-yellow-600',
      green: 'bg-green-100 text-green-600',
      blue: 'bg-blue-100 text-blue-600',
      purple: 'bg-purple-100 text-purple-600'
    };
    return colors[color as keyof typeof colors] || 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="card"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Building2 className="h-10 w-10 text-white" />
              </div>
              <button className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50">
                <Camera className="h-4 w-4 text-gray-600" />
              </button>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{profileData.organizationName}</h1>
              <p className="text-gray-600 mt-1">Registration: {profileData.registrationNumber}</p>
              <p className="text-gray-600">Established: {profileData.establishedYear}</p>
              <div className="flex items-center mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified NGO
                </span>
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-secondary flex items-center"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Profile
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleCancel}
                  className="btn-secondary flex items-center"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="btn-primary flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.6 }}
                className="text-center"
              >
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <IconComponent className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="border-b border-gray-200"
      >
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: Building2 },
            { id: 'contact', label: 'Contact & Operations', icon: MapPin },
            { id: 'certifications', label: 'Certifications', icon: Award },
            { id: 'achievements', label: 'Achievements', icon: Star }
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <IconComponent className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </motion.div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="space-y-6"
        >
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Organization Description</h2>
            {isEditing ? (
              <textarea
                value={profileData.description}
                onChange={(e) => setProfileData({ ...profileData, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-700 leading-relaxed">{profileData.description}</p>
            )}
          </div>

          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Services Offered</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {profileData.services.map((service, index) => (
                <div
                  key={index}
                  className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg"
                >
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-green-800 font-medium">{service}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Specializations</h2>
              <div className="space-y-2">
                {profileData.specializations.map((spec, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">{spec}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Capacity</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Team Size:</span>
                  <span className="font-medium text-gray-900">{profileData.teamSize} members</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Yearly Capacity:</span>
                  <span className="font-medium text-gray-900">{profileData.yearlyCapacity}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'contact' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="space-y-6"
        >
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-3" />
                  {isEditing ? (
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <span className="text-gray-700">{profileData.email}</span>
                  )}
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-400 mr-3" />
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <span className="text-gray-700">{profileData.phone}</span>
                  )}
                </div>
                <div className="flex items-center">
                  <Globe className="h-5 w-5 text-gray-400 mr-3" />
                  {isEditing ? (
                    <input
                      type="url"
                      value={profileData.website}
                      onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <a href={`https://${profileData.website}`} className="text-blue-600 hover:text-blue-700">
                      {profileData.website}
                    </a>
                  )}
                </div>
              </div>
              <div>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                  {isEditing ? (
                    <textarea
                      value={profileData.address}
                      onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                      rows={3}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <span className="text-gray-700">{profileData.address}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Operating Hours</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(profileData.operatingHours).map(([day, hours]) => (
                <div key={day} className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <span className="font-medium text-gray-900 capitalize">{day}</span>
                  <span className="text-gray-600">{hours}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'certifications' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="space-y-6"
        >
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Certifications & Licenses</h2>
              <button className="btn-primary flex items-center">
                <Upload className="h-4 w-4 mr-2" />
                Add Certificate
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certifications.map((cert, index) => {
                const IconComponent = cert.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.6 }}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <IconComponent className="h-5 w-5 text-blue-600" />
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(cert.status)}`}>
                        {getStatusText(cert.status)}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{cert.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{cert.issuer}</p>
                    <div className="flex items-center text-xs text-gray-500 space-x-4">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        Issued: {cert.issuedDate}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        Expires: {cert.expiryDate}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'achievements' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="space-y-6"
        >
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Awards & Achievements</h2>
            
            <div className="space-y-4">
              {achievements.map((achievement, index) => {
                const IconComponent = achievement.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.6 }}
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className={`p-3 rounded-xl mr-4 ${getAchievementColor(achievement.color)}`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                      <p className="text-gray-600">{achievement.description}</p>
                      <p className="text-sm text-gray-500 mt-1">{achievement.date}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default NGOProfile;