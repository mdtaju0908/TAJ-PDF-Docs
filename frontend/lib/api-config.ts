// Centralized API Configuration
// Use this file for all API calls - never hardcode URLs!

import axios from "axios";

// Get API URL from environment with proper fallbacks
const getApiBaseUrl = (): string => {
  // Priority 1: NEXT_PUBLIC_API_URL environment variable
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // Priority 2: NEXT_PUBLIC_BACKEND_URL environment variable  
  if (process.env.NEXT_PUBLIC_BACKEND_URL) {
    return process.env.NEXT_PUBLIC_BACKEND_URL;
  }
  
  // Priority 3: Default based on environment
  if (typeof window !== 'undefined') {
    // Browser environment - base is empty because we use interceptor to add /api
    return '';
  }
  
  // Server-side environment with no explicit backend URL:
  // Use relative base to hit Next.js route handlers (proxy) instead of hardcoding any URL
  return '';
};

// Create axios instance with centralized configuration
export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 60000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens/headers and enforcing /api prefix
apiClient.interceptors.request.use(
  (config) => {
    // Add API key if available
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    if (apiKey && config.headers) {
      config.headers['X-API-Key'] = apiKey;
    }
    
    // Ensure all relative endpoints include /api prefix unless exempt
    const rawUrl = config.url || '';
    const isAbsolute = /^https?:\/\//i.test(rawUrl);
    if (!isAbsolute) {
      let nextUrl = rawUrl.startsWith('/') ? rawUrl : `/${rawUrl}`;
      const exemptPaths = ['/health']; // do not prefix these
      if (!nextUrl.startsWith('/api/') && !exemptPaths.includes(nextUrl)) {
        nextUrl = `/api${nextUrl}`;
      }
      config.url = nextUrl;
    }
    
    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.debug('API Request:', config.method?.toUpperCase(), config.url);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (process.env.NODE_ENV === 'development') {
      console.debug('API Response:', response.status, response.config.url);
    }
    return response;
  },
  (error) => {
    const status = error.response?.status;
    
    // Enhanced error handling
    if (status === 401) {
      console.error('Authentication error - check API keys');
    } else if (status === 404) {
      console.error('API endpoint not found - check backend deployment');
    } else if (status >= 500) {
      console.error('Server error - backend may be down');
    }
    
    // Format consistent error response
    return Promise.reject({
      message: error.response?.data?.message || error.message || 'API request failed',
      status: error.response?.status,
      data: error.response?.data,
    });
  }
);

// Utility function for file uploads
export const uploadFile = async (endpoint: string, formData: FormData) => {
  return apiClient.post(endpoint, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 120000, // Longer timeout for file uploads
  });
};

// Utility function for file downloads
export const downloadFile = async (endpoint: string) => {
  return apiClient.get(endpoint, {
    responseType: 'blob',
    timeout: 120000,
  });
};

// Health check utility
export const checkApiHealth = async () => {
  try {
    const response = await apiClient.get('/health');
    return response.status === 200;
  } catch {
    return false;
  }
};

// Export the base URL for external use
export const API_BASE_URL = getApiBaseUrl();

export default apiClient;
