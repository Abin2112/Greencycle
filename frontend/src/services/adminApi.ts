import { auth } from '../firebase';

const API_BASE_URL = 'http://localhost:3001/api';

class AdminApiService {
  private async getAuthToken(): Promise<string | null> {
    const user = auth.currentUser;
    if (!user) return null;
    return await user.getIdToken();
  }

  private async makeRequest<T>(endpoint: string): Promise<T> {
    const token = await this.getAuthToken();
    
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Admin overview analytics
  async getAdminOverview() {
    try {
      const response = await this.makeRequest<{
        success: boolean;
        data: {
          overview: {
            total_users: number;
            total_ngos: number;
            total_devices: number;
            total_pickups: number;
            devices_processed: number;
            total_weight_processed: number;
            environmental_impact: {
              water_saved_liters: number;
              co2_saved_kg: number;
              toxic_waste_prevented_kg: number;
            };
          };
          monthly_growth: Array<{
            month: string;
            users: number;
            ngos: number;
            devices: number;
          }>;
          device_trends: Array<{
            device_type: string;
            count: number;
            percentage: number;
          }>;
          regional_data: Array<{
            state: string;
            user_count: number;
            ngo_count: number;
            device_count: number;
          }>;
        };
      }>('/analytics/admin/overview');
      
      return response.data;
    } catch (error) {
      console.error('Failed to fetch admin overview:', error);
      throw error;
    }
  }

  // User analytics
  async getUserAnalytics() {
    try {
      const response = await this.makeRequest<{
        success: boolean;
        data: {
          stats: {
            total_users: number;
            active_users: number;
            new_registrations_this_month: number;
            avg_devices_per_user: number;
          };
          growth_trends: Array<{
            month: string;
            new_users: number;
            active_users: number;
          }>;
          top_contributors: Array<{
            user_id: number;
            name: string;
            total_devices: number;
            total_points: number;
          }>;
        };
      }>('/analytics/admin/users');
      
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user analytics:', error);
      throw error;
    }
  }

  // NGO analytics
  async getNgoAnalytics() {
    try {
      const response = await this.makeRequest<{
        success: boolean;
        data: {
          stats: {
            total_ngos: number;
            verified_ngos: number;
            pending_verifications: number;
            avg_rating: number;
          };
          top_ngos: Array<{
            ngo_id: number;
            name: string;
            devices_processed: number;
            avg_rating: number;
          }>;
        };
      }>('/analytics/admin/ngos');
      
      return response.data;
    } catch (error) {
      console.error('Failed to fetch NGO analytics:', error);
      throw error;
    }
  }

  // Get recent activities (this might need a custom endpoint)
  async getRecentActivities() {
    try {
      // For now, we'll use a combination of existing endpoints
      // In a real app, you might want a dedicated activities endpoint
      const [userAnalytics, ngoAnalytics] = await Promise.all([
        this.getUserAnalytics(),
        this.getNgoAnalytics()
      ]);

      // Generate mock activities based on real data
      const activities = [
        {
          id: 1,
          type: 'user_registration',
          description: `${userAnalytics.stats.new_registrations_this_month} new users registered this month`,
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
          status: 'completed'
        },
        {
          id: 2,
          type: 'ngo_verification',
          description: `${ngoAnalytics.stats.pending_verifications} NGO verifications pending`,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
          status: 'pending'
        }
      ];

      return activities;
    } catch (error) {
      console.error('Failed to fetch recent activities:', error);
      throw error;
    }
  }

  // Get critical alerts (this might need a custom endpoint)
  async getCriticalAlerts() {
    try {
      const [overview, ngoAnalytics] = await Promise.all([
        this.getAdminOverview(),
        this.getNgoAnalytics()
      ]);

      const alerts = [];

      // Generate alerts based on actual data
      if (ngoAnalytics.stats.pending_verifications > 5) {
        alerts.push({
          id: 1,
          title: 'High NGO Verification Queue',
          description: `${ngoAnalytics.stats.pending_verifications} NGOs awaiting verification`,
          level: 'high',
          timestamp: new Date().toISOString()
        });
      }

      if (overview.overview.total_devices > 0 && overview.overview.devices_processed / overview.overview.total_devices < 0.7) {
        alerts.push({
          id: 2,
          title: 'Low Processing Rate',
          description: 'Device processing rate below 70%',
          level: 'medium',
          timestamp: new Date().toISOString()
        });
      }

      return alerts;
    } catch (error) {
      console.error('Failed to fetch critical alerts:', error);
      throw error;
    }
  }
}

export const adminApiService = new AdminApiService();
export default adminApiService;