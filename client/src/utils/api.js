import axios from 'axios';

export const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Using Bearer prefix for standard JWT
  }
  return config;
});

export default api;
