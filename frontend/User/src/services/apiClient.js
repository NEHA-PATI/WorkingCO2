import axios from 'axios';

// Get base URLs from environment or use defaults
const API_CONFIG = {
  // Asset Service (port 5000)
  ASSET_API: (import.meta.env.VITE_ASSET_SERVICE_URL || 'http://localhost:5000') + '/api/v1',
  
  // Auth Service (port 5002)
  AUTH_API: import.meta.env.VITE_AUTH_SERVICE_URL || 'http://localhost:5002',
  
  // Notification Service (port 5001)
  NOTIFICATION_API: import.meta.env.VITE_NOTIFICATION_SERVICE_URL || 'http://localhost:5001'
};

/**
 * Create API client with common configuration
 */
const createApiClient = (baseURL, serviceName = 'API') => {
  const client = axios.create({
    baseURL,
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Request Interceptor - Add JWT Token
  client.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      console.log(`📤 [${serviceName}] ${config.method.toUpperCase()} ${config.url}`);
      return config;
    },
    (error) => {
      console.error(`❌ [${serviceName}] Request error:`, error);
      return Promise.reject(error);
    }
  );

  // Response Interceptor - Handle Errors
  client.interceptors.response.use(
    (response) => {
      console.log(`✅ [${serviceName}] Response:`, response.status, response.statusText);
      return response;
    },
    (error) => {
      console.error(`❌ [${serviceName}] Response error:`, error.response?.status, error.message);

      // Handle 401 Unauthorized
      if (error.response?.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        // Let ProtectedRoute handle redirect - don't force navigation here
        return Promise.reject(new Error('Session expired. Please login again.'));
      }

      // Handle 403 Forbidden
      if (error.response?.status === 403) {
        return Promise.reject(new Error('You do not have permission to access this resource.'));
      }

      // Handle 404 Not Found
      if (error.response?.status === 404) {
        return Promise.reject(new Error(`Endpoint not found: ${error.config?.url}`));
      }

      // Handle 500 Server Error
      if (error.response?.status === 500) {
        return Promise.reject(new Error('Server error. Please try again later.'));
      }

      // Handle network error
      if (!error.response) {
        return Promise.reject(new Error('Network error. Please check your connection and server status.'));
      }

      return Promise.reject(error);
    }
  );

  return client;
};

// Export individual clients for different services
export const assetApiClient = createApiClient(API_CONFIG.ASSET_API, 'Asset Service');
export const authApiClient = createApiClient(API_CONFIG.AUTH_API, 'Auth Service');
export const notificationApiClient = createApiClient(API_CONFIG.NOTIFICATION_API, 'Notification Service');

// Default export
export default assetApiClient;

// Export config for reference
export { API_CONFIG };
