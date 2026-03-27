import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const API_BASE_URL = rawApiUrl.replace(/\/+$/, '');
export const BACKEND_BASE_URL = API_BASE_URL.replace(/\/api$/, '');

export const toBackendUrl = (path = '') => {
    if (!path) return BACKEND_BASE_URL;
    if (/^https?:\/\//i.test(path)) return path;

    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${BACKEND_BASE_URL}${normalizedPath}`;
};

const API = axios.create({
    baseURL: API_BASE_URL,
});

// Add a request interceptor to include the auth token in every request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;
