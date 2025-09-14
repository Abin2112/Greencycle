// Authentication API Service
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

// Helper function to handle API requests
const apiRequest = async (endpoint: string, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'An error occurred');
  }

  return response.json();
};

// User login
export const loginUser = async (email: string, password: string) => {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

// User registration
export const registerUser = async (userData: {
  firebase_uid?: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  role?: string;
}) => {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

// Admin login
export const loginAdmin = async (email: string, password: string) => {
  return apiRequest('/auth/admin/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

// NGO registration
export const registerNGO = async (ngoData: {
  firebase_uid?: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  ngo_name: string;
  ngo_address: string;
  latitude?: number;
  longitude?: number;
  services?: string[];
  contact_info?: object;
  operating_hours?: object;
}) => {
  return apiRequest('/auth/ngo/register', {
    method: 'POST',
    body: JSON.stringify(ngoData),
  });
};

// Get user profile
export const getUserProfile = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_BASE_URL}/auth/profile`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'An error occurred');
  }

  return response.json();
};

// Update user profile
export const updateUserProfile = async (userData: any) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_BASE_URL}/auth/profile`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'An error occurred');
  }

  return response.json();
};

// Logout
export const logoutUser = async () => {
  const token = localStorage.getItem('token');
  
  if (token) {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Logout API call failed:', error);
    }
  }
  
  // Always clear local storage
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Verify token
export const verifyToken = async () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('No token found');
  }

  const response = await fetch(`${API_BASE_URL}/auth/verify`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Token verification failed');
  }

  return response.json();
};