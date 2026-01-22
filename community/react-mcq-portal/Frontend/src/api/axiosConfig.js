import axios from 'axios';

// base URL: Vite env var expected to not include trailing '/api' typically.
// We will call endpoints like `${baseURL}/api/...` from frontend. If your VITE_API_BASE_URL already includes '/api', adjust below.
const BASE = import.meta.env.VITE_API_BASE_URL || '';

// Create axios instance
const apiClient = axios.create({
  baseURL: BASE , // make client call e.g. /api/auth/login
  withCredentials: false,
});

// Request interceptor: read token from sessionStorage (per-tab)
apiClient.interceptors.request.use(
  (config) => {
    try {
      const token = sessionStorage.getItem('token');
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch (err) {
      // ignore
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: if 401 -> clear client storage and redirect to login
apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      try {
        // Clear sessionStorage, so next mount shows logged-out state
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
      } catch (e) {
        // ignore
      }
      // Force reload / navigate to login — safer than relying on router from here
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
