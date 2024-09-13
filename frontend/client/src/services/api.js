import axios from 'axios';

const API_BASE_URL = '/api';

// Create an axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
});

// Add a request interceptor to attach the token to authorized requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Authentication
export const login = (email, password) => api.post('/auth/login', { email, password });
export const register = (username, email, password, timeZone) => api.post('/auth/register', { username, email, password, timeZone });
export const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
};

// User
export const getCurrentUser = () => api.get('/auth/user');

// Events
export const getEvents = () => api.get('/events');
export const createEvent = (eventData) => api.post('/events', eventData);
export const updateEvent = (eventId, eventData) => api.put(`/events/${eventId}`, eventData);
export const deleteEvent = (eventId) => api.delete(`/events/${eventId}`);

// Error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            logout();
            // Redirect to login page or show an unauthorized message
        }
        return Promise.reject(error);
    }
);

export default api;
