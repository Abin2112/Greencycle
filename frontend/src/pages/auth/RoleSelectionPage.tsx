import React from 'react';
import { Link } from 'react-router-dom';
import { User, Building2, Shield, Leaf, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const RoleSelectionPage: React.FC = () => {
  const roleCards = [
    {
      role: 'user',
      title: 'User Login',
      description: 'Individual users managing e-waste',
      icon: User,
      color: 'primary',
      bgGradient: 'from-primary-400 to-primary-600',
      path: '/login/user',
      features: [
        'Upload and track your devices',
        'Connect with certified NGOs',
        'Earn points and badges',
        'Track environmental impact'
      ]
    },
    {
      role: 'ngo',
      title: 'NGO/Recycler Login',
      description: 'Organizations handling e-waste collection',
      icon: Building2,
      color: 'blue',
      bgGradient: 'from-blue-400 to-blue-600',
      path: '/login/ngo',
      features: [
        'Manage collection requests',
        'QR scanner for device tracking',
        'View analytics and reports',
        'Update organization profile'
      ]
    },
    {
      role: 'admin',
      title: 'Admin Login',
      description: 'Platform administrators',
      icon: Shield,
      color: 'red',
      bgGradient: 'from-red-400 to-red-600',
      path: '/login/admin',
      features: [
        'Monitor global analytics',
        'Manage users and organizations',
        'View system heatmaps',
        'Configure platform settings'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex justify-center mb-8">
              <div className="bg-white bg-opacity-20 rounded-full p-4">
                <Leaf className="h-16 w-16 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Welcome to GreenCycle
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto">
              Choose your login type to access the smart e-waste management platform
            </p>
          </motion.div>
        </div>
      </div>

      {/* Role Selection Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Select Your Login Type
          </h2>
          <p className="text-lg text-gray-600">
            Different portals for different user types
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {roleCards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <motion.div
                key={card.role}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.2, duration: 0.8 }}
                className="group"
              >
                <Link to={card.path} className="block">
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group-hover:scale-105">
                    {/* Card Header */}
                    <div className={`bg-gradient-to-r ${card.bgGradient} p-8 text-white`}>
                      <div className="flex items-center justify-center mb-4">
                        <div className="bg-white bg-opacity-20 rounded-full p-3">
                          <IconComponent className="h-8 w-8" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-center mb-2">
                        {card.title}
                      </h3>
                      <p className="text-center opacity-90">
                        {card.description}
                      </p>
                    </div>

                    {/* Card Body */}
                    <div className="p-8">
                      <ul className="space-y-3 mb-8">
                        {card.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center text-gray-600">
                            <div className={`w-2 h-2 bg-${card.color}-500 rounded-full mr-3`}></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      
                      <div className={`flex items-center justify-center text-${card.color}-600 font-semibold group-hover:text-${card.color}-700 transition-colors`}>
                        <span>Login Now</span>
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="text-center mt-16"
        >
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              New to GreenCycle?
            </h3>
            <p className="text-gray-600 mb-6">
              Join our platform to make a positive environmental impact through responsible e-waste management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register/user"
                className="btn-primary inline-flex items-center justify-center"
              >
                Register as User
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
              <Link
                to="/register/ngo"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 hover:shadow-lg inline-flex items-center justify-center"
              >
                Register as NGO
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RoleSelectionPage;