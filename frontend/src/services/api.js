import axios from 'axios';
import toast from 'react-hot-toast';

// ============================================
// 1. BASE CONFIGURATION
// ============================================

const API = axios.create({
    baseURL: 'http://localhost:5000/api',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// ============================================
// 2. REQUEST INTERCEPTOR
// ============================================

API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        config.headers['X-Request-ID'] = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);

        if (process.env.NODE_ENV === 'development') {
            console.log(`📤 ${config.method.toUpperCase()} ${config.url}`, config.data || '');
        }

        return config;
    },
    (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// ============================================
// 3. RESPONSE INTERCEPTOR
// ============================================

API.interceptors.response.use(
    (response) => {
        if (process.env.NODE_ENV === 'development') {
            console.log(`📥 ${response.config.method.toUpperCase()} ${response.config.url} - ${response.status}`);
        }
        return response;
    },
    (error) => {
        // Network errors (no response from server)
        if (!error.response) {
            if (!navigator.onLine) {
                toast.error('You are offline. Please check your internet connection.', {
                    duration: 5000,
                    icon: '📡',
                });
            } else {
                toast.error('Network error. Please check your connection and try again.', {
                    duration: 5000,
                    icon: '🔌',
                });
            }
            return Promise.reject(error);
        }

        const { status, data, config } = error.response;
        const requestId = config.headers['X-Request-ID'] || 'unknown';

        if (process.env.NODE_ENV === 'development') {
            console.error(`❌ ${config.method.toUpperCase()} ${config.url} - ${status} [${requestId}]`, data);
        }

        // ============================================
        // 4. HANDLE SPECIFIC STATUS CODES
        // ============================================

        // 400 Bad Request - Validation errors
        if (status === 400) {
            const message = data?.message || 'Invalid request. Please check your input.';
            toast.error(message, {
                duration: 4000,
                icon: '⚠️',
            });
            
            if (data?.errors) {
                return Promise.reject({
                    ...error,
                    validationErrors: data.errors,
                });
            }
        }

        // 401 Unauthorized - Token expired or invalid
        if (status === 401) {
            const token = localStorage.getItem('token');
            
            if (token) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('userData');
                
                const message = data?.message || 'Session expired. Please login again.';
                toast.error(message, {
                    duration: 4000,
                    icon: '🔐',
                });
                
                setTimeout(() => {
                    window.location.href = '/login';
                }, 1500);
            } else {
                toast.error('Please login to continue.', {
                    duration: 3000,
                    icon: '🔑',
                });
                window.location.href = '/login';
            }
        }

        // 403 Forbidden - Insufficient permissions
        if (status === 403) {
            const message = data?.message || 'You do not have permission to perform this action.';
            toast.error(message, {
                duration: 4000,
                icon: '🚫',
            });
        }

        // 404 Not Found - Resource doesn't exist
        if (status === 404) {
            const message = data?.message || 'Resource not found.';
            toast.error(message, {
                duration: 3000,
                icon: '🔍',
            });
        }

        // 409 Conflict - Duplicate entry
        if (status === 409) {
            const message = data?.message || 'Duplicate entry detected.';
            toast.error(message, {
                duration: 4000,
                icon: '🔁',
            });
        }

        // 422 Unprocessable Entity
        if (status === 422) {
            const message = data?.message || 'Validation failed. Please check your input.';
            toast.error(message, {
                duration: 4000,
                icon: '⚠️',
            });
            
            if (data?.errors) {
                return Promise.reject({
                    ...error,
                    validationErrors: data.errors,
                });
            }
        }

        // 429 Too Many Requests
        if (status === 429) {
            toast.error('Too many requests. Please wait a moment and try again.', {
                duration: 5000,
                icon: '⏳',
            });
        }

        // 500+ Server Errors
        if (status >= 500) {
            const message = status === 503 
                ? 'Service unavailable. Please try again later.' 
                : 'Server error. Please try again later.';
            
            toast.error(message, {
                duration: 5000,
                icon: '🔧',
            });
            
            console.error('Server Error Details:', {
                status,
                url: config.url,
                method: config.method,
                requestId,
                data: data,
            });
        }

        return Promise.reject(error);
    }
);

// ============================================
// 5. AUTH TOKEN MANAGEMENT
// ============================================

API.setAuthToken = (token) => {
    if (token) {
        localStorage.setItem('token', token);
        API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        localStorage.removeItem('token');
        delete API.defaults.headers.common['Authorization'];
    }
};

API.getAuthToken = () => {
    return localStorage.getItem('token');
};

API.isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token;
};

API.getCurrentUser = () => {
    try {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    } catch {
        return null;
    }
};

API.logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userData');
    delete API.defaults.headers.common['Authorization'];
    toast.success('Logged out successfully');
};

// ============================================
// 6. EXPORT
// ============================================

export default API;