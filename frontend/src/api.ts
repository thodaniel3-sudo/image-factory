import axios from 'axios';

// Use the environment variable if it exists (for production), otherwise fallback to localhost
const baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const checkHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};
