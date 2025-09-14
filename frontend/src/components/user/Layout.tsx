import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Upload, 
  Smartphone, 
  MapPin, 
  Calendar, 
  BarChart3, 
  Trophy, 
  Bell, 
  User, 
  LogOut,
  Menu,
  X,
  Leaf
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const UserLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const location = useLocation();
  const { userProfile, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/user', icon: Home, current: location.pathname === '/user' },
    { name: 'Upload Device', href: '/user/upload', icon: Upload, current: location.pathname === '/user/upload' },
    { name: 'My Devices', href: '/user/devices', icon: Smartphone, current: location.pathname === '/user/devices' },
    { name: 'Find NGOs', href: '/user/ngos', icon: MapPin, current: location.pathname === '/user/ngos' },
    { name: 'Pickups', href: '/user/pickups', icon: Calendar, current: location.pathname === '/user/pickups' },
    { name: 'Impact', href: '/user/impact', icon: BarChart3, current: location.pathname === '/user/impact' },
    { name: 'Gamification', href: '/user/gamification', icon: Trophy, current: location.pathname === '/user/gamification' },
  ];

  const mockNotifications = [
    { id: 1, title: 'Pickup Scheduled', message: 'Your device pickup is scheduled for tomorrow', time: '2 hours ago', unread: true },
    { id: 2, title: 'Device Processed', message: 'Your laptop has been successfully recycled', time: '1 day ago', unread: true },
    { id: 3, title: 'Achievement Unlocked', message: 'You earned the "Eco Warrior" badge!', time: '3 days ago', unread: false },
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

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col h-full bg-white shadow-xl">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b border-neutral-200">
            <Link to="/user" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-display font-bold text-gradient">GreenCycle</span>
            </Link>
          </div>

          {/* User info */}
          <div className="p-6 border-b border-neutral-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-medium text-neutral-800">{userProfile?.name}</div>
                <div className="text-sm text-neutral-500">{userProfile?.points} points</div>
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
                      ? 'bg-primary-100 text-primary-700 shadow-soft'
                      : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-neutral-200 sticky bottom-0 bg-white">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800 transition-all duration-200 w-full"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <motion.div
        initial={false}
        animate={{ x: sidebarOpen ? 0 : '-100%' }}
        className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl lg:hidden"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-neutral-200">
            <Link to="/user" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-display font-bold text-gradient">GreenCycle</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-lg hover:bg-neutral-100"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* User info */}
          <div className="p-6 border-b border-neutral-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-medium text-neutral-800">{userProfile?.name}</div>
                <div className="text-sm text-neutral-500">{userProfile?.points} points</div>
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
                      ? 'bg-primary-100 text-primary-700 shadow-soft'
                      : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-neutral-200 sticky bottom-0 bg-white">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800 transition-all duration-200 w-full"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-0 bg-gradient-to-br from-primary-50 to-secondary-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-neutral-200 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-neutral-100"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="ml-4 lg:ml-0 text-xl font-display font-semibold text-neutral-800">
                {navigation.find(item => item.current)?.name || 'Dashboard'}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 rounded-lg hover:bg-neutral-100 relative"
                >
                  <Bell className="w-6 h-6 text-neutral-600" />
                  {mockNotifications.some(n => n.unread) && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                  )}
                </button>

                {/* Notifications dropdown */}
                <AnimatePresence>
                  {notificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-strong border border-neutral-200 z-50"
                    >
                      <div className="p-4 border-b border-neutral-200">
                        <h3 className="font-medium text-neutral-800">Notifications</h3>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {mockNotifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b border-neutral-100 hover:bg-neutral-50 ${
                              notification.unread ? 'bg-primary-50/50' : ''
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              {notification.unread && (
                                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2" />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-neutral-800">{notification.title}</p>
                                <p className="text-sm text-neutral-600 mt-1">{notification.message}</p>
                                <p className="text-xs text-neutral-500 mt-2">{notification.time}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-4 text-center">
                        <button className="text-sm text-primary-600 hover:text-primary-500 font-medium">
                          View all notifications
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User profile */}
              <div className="flex items-center space-x-3">
                <div className="hidden sm:block text-right">
                  <div className="text-sm font-medium text-neutral-800">{userProfile?.name}</div>
                  <div className="text-xs text-neutral-500">{userProfile?.email}</div>
                </div>
                <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserLayout;