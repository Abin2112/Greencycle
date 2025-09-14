import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Auth Components
import RoleSelectionPage from './pages/auth/RoleSelectionPage';
import UserLoginPage from './pages/auth/UserLoginPage';
import NGOLoginPage from './pages/auth/NGOLoginPage';
import AdminLoginPage from './pages/auth/AdminLoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import NGORegisterPage from './pages/auth/NGORegisterPage';
import AdminRegisterPage from './pages/auth/AdminRegisterPage';

// User Portal
import UserLayout from './components/user/Layout';
import UserDashboard from './pages/user/Dashboard';
import DeviceUpload from './pages/user/DeviceUpload';
import MyDevices from './pages/user/MyDevices';
import FindNGOs from './pages/user/FindNGOs';
import Pickups from './pages/user/Pickups';
import ImpactDashboard from './pages/user/ImpactDashboard';
import Gamification from './pages/user/Gamification';

// NGO Portal
import NGOLayout from './components/ngo/Layout';
import NGODashboard from './pages/ngo/Dashboard';
import RequestManagement from './pages/ngo/RequestManagement';
import QRScanner from './pages/ngo/QRScanner';
import NGOProfile from './pages/ngo/Profile';
import NGOAnalytics from './pages/ngo/Analytics';

// Admin Portal
import AdminLayout from './components/admin/Layout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminAnalytics from './pages/admin/Analytics';
import AdminSettings from './pages/admin/Settings';
import UserManagement from './pages/admin/UserManagement';
import NGOManagement from './pages/admin/NGOManagement';

// Protected Route Component
import ProtectedRoute from './components/auth/ProtectedRoute';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<RoleSelectionPage />} />
            <Route path="/login/user" element={<UserLoginPage />} />
            <Route path="/login/ngo" element={<NGOLoginPage />} />
            <Route path="/login/admin" element={<AdminLoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/register/user" element={<RegisterPage />} />
            <Route path="/register/ngo" element={<NGORegisterPage />} />
            <Route path="/register/admin" element={<AdminRegisterPage />} />
              
            {/* User Portal Routes */}
            <Route path="/user" element={
              <ProtectedRoute allowedRoles={['user']}>
                <UserLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/user/dashboard" replace />} />
              <Route path="dashboard" element={<UserDashboard />} />
              <Route path="upload" element={<DeviceUpload />} />
              <Route path="devices" element={<MyDevices />} />
              <Route path="ngos" element={<FindNGOs />} />
              <Route path="pickups" element={<Pickups />} />
              <Route path="impact" element={<ImpactDashboard />} />
              <Route path="gamification" element={<Gamification />} />
            </Route>
            
            {/* NGO Portal Routes */}
            <Route path="/ngo" element={
              <ProtectedRoute allowedRoles={['ngo']}>
                <NGOLayout />
              </ProtectedRoute>
            }>
              <Route index element={<NGODashboard />} />
              <Route path="requests" element={<RequestManagement />} />
              <Route path="scanner" element={<QRScanner />} />
              <Route path="profile" element={<NGOProfile />} />
              <Route path="analytics" element={<NGOAnalytics />} />
            </Route>
            
            {/* Admin Portal Routes */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="ngos" element={<NGOManagement />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
              
              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              
              {/* Catch all - redirect to login */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
            
            {/* Toast notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#fff',
                  color: '#374151',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                },
                success: {
                  style: {
                    border: '1px solid #68bf68',
                  },
                  iconTheme: {
                    primary: '#68bf68',
                    secondary: '#fff',
                  },
                },
                error: {
                  style: {
                    border: '1px solid #ef4444',
                  },
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
