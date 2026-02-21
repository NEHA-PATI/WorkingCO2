import axios from "axios";
import { fireToast } from "./toastService";
import { ENV } from "@config/env";

// Get base URLs from environment or use defaults
const API_CONFIG = {
  // Asset Service (port 5000)
  ASSET_API:
    (import.meta.env.VITE_ASSET_SERVICE_URL || "http://localhost:5000") +
    "/api/v1",

  // Auth Service (port 5002)
  AUTH_API: import.meta.env.VITE_AUTH_SERVICE_URL || "http://localhost:5002",

  // Notification Service (port 5001)
  NOTIFICATION_API:
    import.meta.env.VITE_NOTIFICATION_SERVICE_URL || "http://localhost:5001",


  // Contact Service (port 5005)
  CONTACT_API: import.meta.env.VITE_CONTACT_API || "http://localhost:5005",

  // Carbon Footprint Service (port 5003 for example)
CFC_API:
  import.meta.env.VITE_CFC_SERVICE_URL || "http://localhost:8004/api",
};

/**
 * Create API client with common configuration
 */
const createApiClient = (baseURL, serviceName = "API") => {
  const client = axios.create({
    baseURL,
    timeout: 15000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Request Interceptor - Add JWT Token
  client.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("authToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      console.log(
        `📤 [${serviceName}] ${config.method.toUpperCase()} ${config.url}`,
      );
      return config;
    },
    (error) => {
      console.error(`❌ [${serviceName}] Request error:`, error);
      return Promise.reject(error);
    },
  );

  // Response Interceptor - Handle Errors
  client.interceptors.response.use(
    (response) => {
      console.log(
        `✅ [${serviceName}] Response:`,
        response.status,
        response.statusText,
      );
      return response;
    },
    (error) => {
      console.error(
        `❌ [${serviceName}] Response error:`,
        error.response?.status,
        error.message,
      );

      // Handle 401 Unauthorized
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("authUser");
        // Let ProtectedRoute handle redirect - don't force navigation here
        return Promise.reject(
          new Error("Session expired. Please login again."),
        );
      }

      // Handle 403 Forbidden
      if (error.response?.status === 403) {
        return Promise.reject(
          new Error("You do not have permission to access this resource."),
        );
      }

      // Handle 404 Not Found
      if (error.response?.status === 404) {
        return Promise.reject(
          new Error(`Endpoint not found: ${error.config?.url}`),
        );
      }

      // Handle 500 Server Error
      if (error.response?.status === 500) {
        return Promise.reject(
          new Error("Server error. Please try again later."),
        );
      }

      // Handle network error
      if (!error.response) {
        return Promise.reject(
          new Error(
            "Network error. Please check your connection and server status.",
          ),
        );
      }

      if (error.response?.status === 401) {
        fireToast("API.UNAUTHORIZED", "error");
      } else {
        fireToast("API.SERVER", "error");
      }

      return Promise.reject(error);
    },
  );

  return client;
};

// Export individual clients for different services
export const assetApiClient = createApiClient(
  API_CONFIG.ASSET_API,
  "Asset Service",
);
export const authApiClient = createApiClient(
  API_CONFIG.AUTH_API,
  "Auth Service",
);
export const notificationApiClient = createApiClient(
  API_CONFIG.NOTIFICATION_API,
  "Notification Service",
);

// Career Service (port 5006)
export const careerApiClient = createApiClient(
  ENV.CAREER_SERVICE_URL,
  "Career Service",
);

// Blog Service (port 4000)
export const blogApiClient = createApiClient(
  import.meta.env.VITE_BLOG_API_URL || "http://localhost:4000/api/blog",
  "Blog Service",
);

export const carbonApiClient = createApiClient(
  API_CONFIG.CFC_API,
  "Carbon Footprint Service",
);
export const contactApiClient = createApiClient(
  API_CONFIG.CONTACT_API ,
  "Contact Service",
);

export const ticketApiClient = createApiClient(
  import.meta.env.VITE_TICKET_API || "http://localhost:5004",
  "Ticket Service",
);


// Default export
export default assetApiClient;

// Export config for reference
export { API_CONFIG };

export const calculateCarbonFootprint = async (payload) => {
  const response = await carbonApiClient.post('/v1/calculate', payload);
  return response.data;
};

export const fetchAirportCodes = async (search = "", limit = 300) => {
  const response = await carbonApiClient.get('/v1/airports', {
    params: { q: search, limit },
  });
  return response.data?.data || [];
};

