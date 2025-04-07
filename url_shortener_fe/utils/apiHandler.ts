import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// Define the base API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
  withCredentials: true, // Important for cookies
});

// Interface for API response
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
  isSuccess: boolean;
}

// Flag to prevent multiple refresh token requests
let isRefreshing = false;
// Store pending requests that should be retried after token refresh
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

// Process the queue of failed requests
const processQueue = (error: any = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  
  failedQueue = [];
};

// Request interceptor - useful for adding auth tokens
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage when in browser environment
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle common responses
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    
    // If error is not 401 or request has already been retried, reject
    if (!originalRequest || error.response?.status !== 401 || (originalRequest as any)._retry) {
      // Handle specific error codes
      if (error.response?.status === 401) {
        // Handle unauthorized (e.g., redirect to login)
        if (typeof window !== 'undefined') {
          // Clear token
          localStorage.removeItem('authToken');
          // Optionally redirect to login
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
    
    // Mark request as retried
    (originalRequest as any)._retry = true;
    
    // If already refreshing, add request to queue
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => apiClient(originalRequest))
        .catch(err => Promise.reject(err));
    }
    
    isRefreshing = true;
    
    try {
      // Call refresh token endpoint
      const response = await apiClient.post('/auth/refresh-token');
      
      if (response.data && response.data.accessToken) {
        // Update token in localStorage
        localStorage.setItem('authToken', response.data.accessToken);
        
        // Update Authorization header
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
        }
        
        // Process queue and retry original request
        processQueue();
        return apiClient(originalRequest);
      }
    } catch (refreshError) {
      // If refresh token fails, clear token and redirect to login
      processQueue(refreshError);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
    
    return Promise.reject(error);
  }
);

// Generic request function
export async function apiRequest<T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  try {
    let response: AxiosResponse;

    switch (method) {
      case 'GET':
        response = await apiClient.get<T>(url, config);
        break;
      case 'POST':
        response = await apiClient.post<T>(url, data, config);
        break;
      case 'PUT':
        response = await apiClient.put<T>(url, data, config);
        break;
      case 'DELETE':
        response = await apiClient.delete<T>(url, { ...config, data });
        break;
      case 'PATCH':
        response = await apiClient.patch<T>(url, data, config);
        break;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }

    return {
      data: response.data,
      error: null,
      status: response.status,
      isSuccess: true,
    };
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string; error?: string; url?: any }>;
    
    // For 409 Conflict (URL already exists), we want to return the data
    if (axiosError.response?.status === 409) {
      return {
        data: axiosError.response.data as unknown as T,
        error: axiosError.response.data?.error || axiosError.message || 'URL already exists',
        status: axiosError.response.status,
        isSuccess: false,
      };
    }
    
    return {
      data: null,
      error: axiosError.response?.data?.message || axiosError.response?.data?.error || axiosError.message || 'Unknown error occurred',
      status: axiosError.response?.status || 500,
      isSuccess: false,
    };
  }
}

// Convenience methods
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) => 
    apiRequest<T>('GET', url, undefined, config),
  
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    apiRequest<T>('POST', url, data, config),
  
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    apiRequest<T>('PUT', url, data, config),
  
  delete: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    apiRequest<T>('DELETE', url, data, config),
  
  patch: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    apiRequest<T>('PATCH', url, data, config)
};

export default api;