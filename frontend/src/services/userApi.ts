import { User } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

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

// Dashboard data
export const getDashboardData = async () => {
  return apiRequest('/user/dashboard');
};

// User devices
export const getUserDevices = async () => {
  return apiRequest('/user/devices');
};

// Device details
export const getDeviceDetails = async (deviceId: string) => {
  return apiRequest(`/user/devices/${deviceId}`);
};

// Environmental impact
export const getUserImpact = async () => {
  return apiRequest('/user/impact');
};

// Pickups
export const getUserPickups = async () => {
  return apiRequest('/user/pickups');
};

// Schedule pickup
export const schedulePickup = async (pickupData: any) => {
  return apiRequest('/user/pickups', {
    method: 'POST',
    body: JSON.stringify(pickupData),
  });
};

// Gamification
export const getUserGamification = async () => {
  return apiRequest('/user/gamification');
};

// Get user achievements and badges
export const getUserAchievements = async () => {
  return apiRequest('/user/achievements');
};

// Get challenges
export const getChallenges = async () => {
  return apiRequest('/user/challenges');
};

// Get leaderboard
export const getLeaderboard = async () => {
  return apiRequest('/user/leaderboard');
};

// Upload a new device
export const uploadDevice = async (deviceData: FormData) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_BASE_URL}/user/devices`, {
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
    ? `/user/ngos?location=${encodeURIComponent(location)}`
    : '/user/ngos';
    
  return apiRequest(endpoint);
};

// Update user profile
export const updateUserProfile = async (userData: Partial<User>) => {
  return apiRequest('/user/profile', {
    method: 'PUT',
    body: JSON.stringify(userData),
  });
};