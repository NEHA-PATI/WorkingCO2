import { authApiClient, assetApiClient, notificationApiClient } from './apiClient';

/**
 * Authentication Service APIs
 */
export const authService = {
  login: async (email, password) => {
    try {
      const response = await authApiClient.post('/api/auth/login', {
        email,
        password
      });
      console.log('🟢 Login Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Login Error:', error);
      throw error;
    }
  },

  register: async (email, password, name) => {
    try {
      const response = await authApiClient.post('/api/auth/register', {
        email,
        password,
        name
      });
      return response.data;
    } catch (error) {
      console.error('❌ Register Error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await authApiClient.post('/api/auth/logout');
      localStorage.removeItem('authToken');
      return response.data;
    } catch (error) {
      console.error('❌ Logout Error:', error);
      // Clear token anyway
      localStorage.removeItem('authToken');
      throw error;
    }
  },

  refreshToken: async () => {
    try {
      const response = await authApiClient.post('/api/auth/refresh');
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('❌ Token Refresh Error:', error);
      throw error;
    }
  }
};

/**
 * Asset Service APIs
 */
export const assetService = {
  getAllAssetStatuses: async (userId) => {
    try {
      const response = await assetApiClient.get(`/api/assets/user/${userId}/status`);
      return response.data;
    } catch (error) {
      console.error('❌ Get Asset Statuses Error:', error);
      throw error;
    }
  },

  getHealthCheck: async () => {
    try {
      const response = await assetApiClient.get('/health');
      return response.data;
    } catch (error) {
      console.error('❌ Health Check Error:', error);
      throw error;
    }
  },

  createAsset: async (assetData) => {
    try {
      const response = await assetApiClient.post('/api/assets', assetData);
      return response.data;
    } catch (error) {
      console.error('❌ Create Asset Error:', error);
      throw error;
    }
  },

  updateAsset: async (assetId, assetData) => {
    try {
      const response = await assetApiClient.put(`/api/assets/${assetId}`, assetData);
      return response.data;
    } catch (error) {
      console.error('❌ Update Asset Error:', error);
      throw error;
    }
  }
};

/**
 * Notification Service APIs
 */
export const notificationService = {
  getNotifications: async (filters = {}) => {
    try {
      const response = await notificationApiClient.get('/api/notifications', {
        params: filters
      });
      return response.data;
    } catch (error) {
      console.error('❌ Get Notifications Error:', error);
      throw error;
    }
  },

  getUnreadCount: async () => {
    try {
      const response = await notificationApiClient.get('/api/notifications/unread');
      return response.data;
    } catch (error) {
      console.error('❌ Get Unread Count Error:', error);
      throw error;
    }
  },

  markAsRead: async (notificationId) => {
    try {
      const response = await notificationApiClient.patch(`/api/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error('❌ Mark As Read Error:', error);
      throw error;
    }
  },

  markAllAsRead: async () => {
    try {
      const response = await notificationApiClient.patch('/api/notifications/read/all');
      return response.data;
    } catch (error) {
      console.error('❌ Mark All As Read Error:', error);
      throw error;
    }
  }
};

export default {
  authService,
  assetService,
  notificationService
};
