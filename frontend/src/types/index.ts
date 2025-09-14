// User Types
export interface User {
  id: string;
  firebaseUid: string;
  name: string;
  email: string;
  role: 'user' | 'ngo' | 'admin';
  points: number;
  badges: string[];
  profileImage?: string;
  phone?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

// Device Types
export interface Device {
  id: string;
  userId: string;
  type: 'smartphone' | 'laptop' | 'tablet' | 'desktop' | 'battery' | 'other';
  brand?: string;
  model?: string;
  serialNumber?: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  status: 'uploaded' | 'pending_pickup' | 'picked_up' | 'received' | 'processing' | 'refurbished' | 'donated' | 'recycled';
  valuation: DeviceValuation;
  weight?: number;
  images: string[];
  qrCode: string;
  aiDetectionResult?: AIDetectionResult;
  ocrData?: OCRData;
  createdAt: string;
  updatedAt: string;
}

export interface DeviceValuation {
  suggestion: 'donate' | 'recycle' | 'resell';
  estimatedValue?: number;
  reason: string;
  confidence: number;
}

export interface AIDetectionResult {
  detectedType: string;
  confidence: number;
  alternatives: Array<{
    type: string;
    confidence: number;
  }>;
  modelUsed: string;
}

export interface OCRData {
  extractedText: string;
  detectedSerialNumbers: string[];
  detectedModelNumbers: string[];
  confidence: number;
}

// NGO Types
export interface NGO {
  id: string;
  userId: string;
  name: string;
  description?: string;
  address: string;
  latitude: number;
  longitude: number;
  services: string[];
  contactInfo: ContactInfo;
  operatingHours?: OperatingHours;
  verified: boolean;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface ContactInfo {
  phone?: string;
  email?: string;
  website?: string;
}

export interface OperatingHours {
  [key: string]: {
    open: string;
    close: string;
    closed?: boolean;
  };
}

// Pickup Types
export interface Pickup {
  id: string;
  deviceId: string;
  userId: string;
  ngoId: string;
  pickupDate: string;
  scheduledTimeSlot: string;
  pickupAddress: string;
  specialInstructions?: string;
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  pickupPersonName?: string;
  pickupPersonPhone?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Impact Types
export interface ImpactReport {
  id: string;
  userId: string;
  deviceId: string;
  waterSaved: number; // liters
  co2Saved: number; // kg
  toxicSaved: number; // kg
  energySaved: number; // kWh
  rawMaterialsSaved: RawMaterialsSaved;
  calculationMethod: string;
  createdAt: string;
}

export interface RawMaterialsSaved {
  metal: number; // kg
  plastic: number; // kg
  glass: number; // kg
  other?: number; // kg
}

// Community Types
export interface Community {
  id: string;
  name: string;
  description?: string;
  type: string;
  location: Location;
  adminUserId: string;
  memberCount: number;
  totalPoints: number;
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  city: string;
  state: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

// Challenge Types
export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'individual' | 'community' | 'global';
  targetValue: number;
  targetMetric: 'devices' | 'weight' | 'points';
  rewardPoints: number;
  rewardBadge?: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
}

export interface ChallengeParticipation {
  id: string;
  challengeId: string;
  userId: string;
  currentProgress: number;
  completed: boolean;
  completedAt?: string;
  createdAt: string;
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'user' | 'ngo';
  phone?: string;
}

export interface DeviceUploadFormData {
  type: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  condition: string;
  weight?: number;
  images: File[];
  description?: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

// Analytics Types
export interface Analytics {
  totalDevices: number;
  totalUsers: number;
  totalNGOs: number;
  totalImpact: {
    waterSaved: number;
    co2Saved: number;
    toxicSaved: number;
    energySaved: number;
  };
  monthlyStats: MonthlyStats[];
  deviceStatusDistribution: StatusDistribution[];
  topPerformingNGOs: NGOPerformance[];
}

export interface MonthlyStats {
  month: string;
  devicesProcessed: number;
  newUsers: number;
  totalImpact: number;
}

export interface StatusDistribution {
  status: string;
  count: number;
  percentage: number;
}

export interface NGOPerformance {
  ngoId: string;
  ngoName: string;
  devicesProcessed: number;
  averageProcessingTime: number;
  rating: number;
}

// Map Types
export interface MapLocation {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  type: 'ngo' | 'recycling_center' | 'user';
  distance?: number;
  services?: string[];
  rating?: number;
  contactInfo?: ContactInfo;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'pickup_reminder' | 'status_update' | 'achievement' | 'general';
  read: boolean;
  actionUrl?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export default {};