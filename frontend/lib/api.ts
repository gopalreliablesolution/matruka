import axios from 'axios';
import Cookies from 'js-cookie';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export const publicApi = axios.create({
  baseURL: `${BACKEND_URL}/api/v1/public`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const adminApi = axios.create({
  baseURL: `${BACKEND_URL}/api/v1/admin`,
  timeout: 15000,
});

// Interceptor to automatically attach JWT token from cookies
adminApi.interceptors.request.use(
  (config) => {
    const token = Cookies.get('matruka_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle unauthorized / expired session
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      if (!window.location.pathname.includes('/admin/login')) {
        Cookies.remove('matruka_admin_token');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default publicApi;

