import API from './api';

export class UnverifiedError extends Error {
    constructor(message, email) {
        super(message);
        this.email = email;
        this.name = 'UnverifiedError';
    }
}

class AuthService {
    /**
     * Register a new user
     */
    async register(data) {
        try {
            const response = await API.post('/auth/register', data);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Registration failed');
        }
    }

    /**
     * Login a user
     */
    async login(data) {
        try {
            const response = await API.post('/auth/login', data);
            const authData = response.data;

            localStorage.setItem('user', JSON.stringify(authData));
            localStorage.setItem('authToken', authData.token);

            return authData;
        } catch (error) {
            if (error.response?.status === 403 && error.response?.data?.requiresVerification) {
                throw new UnverifiedError(error.response.data.message, error.response.data.email);
            }
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    }

    /**
     * Check current user data from backend
     */
    async getMe() {
        try {
            const response = await API.get('/auth/me');
            return response.data;
        } catch (error) {
            this.logout();
            throw new Error(error.response?.data?.message || 'Session expired');
        }
    }

    /**
     * Logout user
     */
    logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
    }

    /**
     * Get stored user from localStorage
     */
    getStoredUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    /**
     * Get auth token from localStorage
     */
    getToken() {
        return localStorage.getItem('authToken');
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return !!localStorage.getItem('authToken');
    }

    /**
     * Verify email with verification code
     */
    async verifyEmail(email, verificationCode) {
        try {
            const response = await API.post('/auth/verify-email', { email, verificationCode });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Verification failed');
        }
    }

    /**
     * Resend verification code
     */
    async resendVerificationCode(email) {
        try {
            const response = await API.post('/auth/resend-verification', { email });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to resend code');
        }
    }

    /**
     * Forgot Password
     */
    async forgotPassword(email) {
        try {
            const response = await API.post('/auth/forgot-password', { email });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Request failed');
        }
    }

    /**
     * Reset Password
     */
    async resetPassword(email, code, newPassword) {
        try {
            const response = await API.post('/auth/reset-password', { email, code, newPassword });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Reset failed');
        }
    }

    /**
     * Update user profile
     */
    async updateUser(data) {
        try {
            const response = await API.put('/auth/update', data);
            const updatedUser = response.data;

            // Update stored user in localStorage
            const currentUser = this.getStoredUser();
            if (currentUser) {
                const newUser = { ...currentUser, ...updatedUser };
                localStorage.setItem('user', JSON.stringify(newUser));
            }

            return updatedUser;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Update failed');
        }
    }

    /**
     * Delete user account
     */
    async deleteUser(email) {
        try {
            const response = await API.delete('/auth/delete');
            this.logout();
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Delete failed');
        }
    }
}

export default new AuthService();
