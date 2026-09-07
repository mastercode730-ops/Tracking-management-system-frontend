import axios from 'axios';

const apiBase = import.meta.env.VITE_API_URL 
  ? ${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api
  : '/api';

const api = axios.create({
  baseURL: apiBase
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tracker_token');
  if (token) {
    config.headers.Authorization = Bearer ;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('tracker_token');
      localStorage.removeItem('tracker_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
