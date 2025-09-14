import { User, DashboardResponse } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

// Helper function to handle API requests
const apiRequest = async (endpoint: string, options = {}) => {
  const token = localStorage.getItem('token');
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...defaultOptions,
    ...options,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'An error occurred');
  }

  return response.json();
};

// Dashboard data - mock endpoint for now
export const getDashboardData = async (): Promise<DashboardResponse> => {
  // This would need to be implemented in backend or use existing endpoints
  try {
    const [devices, pickups, impact] = await Promise.all([
      getUserDevices(),
      getUserPickups(), 
      getUserImpact()
    ]);
    return { 
      devices: devices?.data || devices || [], 
      pickups: pickups?.data || pickups || [], 
      impact: impact?.data || impact || {
        totalWaterSaved: 0,
        totalCo2Reduced: 0,
        totalToxicPrevented: 0,
        totalDevicesProcessed: 0,
        totalPoints: 0
      }
    };
  } catch (error) {
    console.error('Error in getDashboardData:', error);
    return {
      devices: [],
      pickups: [],
      impact: {
        totalWaterSaved: 0,
        totalCo2Reduced: 0,
        totalToxicPrevented: 0,
        totalDevicesProcessed: 0,
        totalPoints: 0
      }
    };
  }
};

// User devices
export const getUserDevices = async () => {
  return apiRequest('/devices/my-devices');
};

// Device details
export const getDeviceDetails = async (deviceId: string) => {
  return apiRequest(`/devices/${deviceId}`);
};

// Environmental impact
export const getUserImpact = async () => {
  return apiRequest('/impact/dashboard');
};

// Pickups
export const getUserPickups = async () => {
  return apiRequest('/pickups/my-pickups');
};

// Schedule pickup
export const schedulePickup = async (pickupData: any) => {
  return apiRequest('/pickups/schedule', {
    method: 'POST',
    body: JSON.stringify(pickupData),
  });
};

// Gamification
export const getUserGamification = async () => {
  return apiRequest('/gamification/profile');
};

// Get user achievements and badges
export const getUserAchievements = async () => {
  return apiRequest('/gamification/badges');
};

// Get challenges
export const getChallenges = async () => {
  return apiRequest('/gamification/challenges');
};

// Get leaderboard
export const getLeaderboard = async () => {
  return apiRequest('/gamification/leaderboard');
};

// Upload a new device
export const uploadDevice = async (deviceData: FormData) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_BASE_URL}/devices/upload`, {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: deviceData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'An error occurred');
  }

  return response.json();
};

// Find NGOs
export const findNGOs = async (location?: string) => {
  const endpoint = location 
    ? `/ngos?location=${encodeURIComponent(location)}`
    : '/ngos';
    
  return apiRequest(endpoint);
};

// Update user profile
export const updateUserProfile = async (userData: Partial<User>) => {
  return apiRequest('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(userData),
  });
};