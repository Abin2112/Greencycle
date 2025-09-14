// NGO API Service
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

// Get all NGOs
export const getAllNGOs = async (location?: string) => {
  const endpoint = location 
    ? `/ngos?location=${encodeURIComponent(location)}`
    : '/ngos';
  return apiRequest(endpoint);
};

// Get NGO details
export const getNGODetails = async (ngoId: string) => {
  return apiRequest(`/ngos/${ngoId}`);
};

// Find nearest NGOs
export const findNearestNGOs = async (latitude: number, longitude: number, radius?: number) => {
  return apiRequest('/ngos/nearest', {
    method: 'POST',
    body: JSON.stringify({ latitude, longitude, radius }),
  });
};

// Get NGO profile (for logged-in NGO)
export const getNGOProfile = async () => {
  return apiRequest('/ngos/profile/me');
};

// Update NGO profile
export const updateNGOProfile = async (ngoData: any) => {
  return apiRequest('/ngos/profile/me', {
    method: 'PUT',
    body: JSON.stringify(ngoData),
  });
};

// Get assigned pickups for NGO
export const getNGOPickups = async () => {
  return apiRequest('/pickups/ngo/assigned');
};

// Update pickup status
export const updatePickupStatus = async (pickupId: string, status: string, notes?: string) => {
  return apiRequest(`/pickups/${pickupId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status, notes }),
  });
};

// Get assigned devices for NGO
export const getNGODevices = async () => {
  return apiRequest('/devices/ngo/assigned');
};

// Update device status
export const updateDeviceStatus = async (deviceId: string, status: string, notes?: string) => {
  return apiRequest(`/devices/${deviceId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status, notes }),
  });
};