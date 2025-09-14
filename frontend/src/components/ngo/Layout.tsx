import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  ClipboardList, 
  QrCode, 
  User, 
  BarChart3, 
  Bell, 
  LogOut,
  Menu,
  X,
  Building2,
  Package,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const NGOLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const location = useLocation();
  const { userProfile, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/ngo', icon: Home, current: location.pathname === '/ngo' },
    { name: 'Requests', href: '/ngo/requests', icon: ClipboardList, current: location.pathname === '/ngo/requests' },
    { name: 'QR Scanner', href: '/ngo/scanner', icon: QrCode, current: location.pathname === '/ngo/scanner' },
    { name: 'Analytics', href: '/ngo/analytics', icon: BarChart3, current: location.pathname === '/ngo/analytics' },
    { name: 'Profile', href: '/ngo/profile', icon: User, current: location.pathname === '/ngo/profile' },
  ];

  const mockNotifications = [
    { id: 1, title: 'New Collection Request', message: 'New device pickup request from Manhattan area', time: '30 min ago', unread: true },
    { id: 2, title: 'Device Processed', message: '15 smartphones have been successfully processed', time: '2 hours ago', unread: true },
    { id: 3, title: 'Monthly Goal', message: 'You are 78% towards your monthly goal', time: '1 day ago', unread: false },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl z-50 lg:hidden"
          >
            <div className="flex flex-col h-full">
              {/* Logo */}
              <div className="flex items-center h-16 px-6 border-b border-neutral-200">
                <Link to="/ngo" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-display font-bold text-blue-600">NGO Portal</span>
                </Link>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="ml-auto lg:hidden"
                >
                  <X className="w-6 h-6 text-neutral-400" />
                </button>
              </div>

              {/* User info */}
              <div className="p-6 border-b border-neutral-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-neutral-800">{userProfile?.name}</div>
                    <div className="text-sm text-blue-600">NGO Organization</div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 py-6 space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        item.current
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-800'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Logout */}
              <div className="p-4 border-t border-neutral-200">
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 w-full px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50 hover:text-neutral-800 rounded-xl transition-all duration-200"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col h-full bg-white shadow-xl">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b border-neutral-200">
            <Link to="/ngo" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-display font-bold text-blue-600">NGO Portal</span>
            </Link>
          </div>

          {/* User info */}
          <div className="p-6 border-b border-neutral-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-medium text-neutral-800">{userProfile?.name}</div>
                <div className="text-sm text-blue-600">NGO Organization</div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    item.current
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-neutral-200">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50 hover:text-neutral-800 rounded-xl transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-neutral-200">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="ml-4 lg:ml-0">
                <h1 className="text-xl font-semibold text-neutral-800">
                  {navigation.find(item => item.current)?.name || 'NGO Dashboard'}
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50 relative"
                >
                  <Bell className="w-6 h-6" />
                  {mockNotifications.some(n => n.unread) && (
                    <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full"></span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                <AnimatePresence>
                  {notificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-neutral-200 z-50"
                    >
                      <div className="p-4 border-b border-neutral-200">
                        <h3 className="text-sm font-semibold text-neutral-800">Notifications</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {mockNotifications.map((notification) => (
                          <div key={notification.id} className="p-4 border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50">
                            <div className="flex items-start space-x-3">
                              <div className={`w-2 h-2 rounded-full mt-2 ${notification.unread ? 'bg-blue-500' : 'bg-neutral-300'}`}></div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-neutral-800">{notification.title}</p>
                                <p className="text-sm text-neutral-600 mt-1">{notification.message}</p>
                                <p className="text-xs text-neutral-400 mt-2">{notification.time}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-white" />
                </div>
                <span className="hidden md:block text-sm font-medium text-neutral-700">{userProfile?.name}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-neutral-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default NGOLayout;