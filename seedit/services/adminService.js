import API from './api';

class AdminService {
    async getAllUsers() {
        const response = await API.get('/admin/users');
        return response.data;
    }

    async getStats() {
        const response = await API.get('/admin/stats');
        return response.data;
    }

    async getPendingPayments() {
        const response = await API.get('/admin/payments/pending');
        return response.data;
    }

    async verifyPayment(paymentId, status) {
        const response = await API.put(`/admin/payments/${paymentId}/verify`, { status });
        return response.data;
    }

    async getNotifications() {
        const response = await API.get('/notifications');
        return response.data;
    }

    async markNotificationAsRead(id) {
        const response = await API.put(`/notifications/${id}/read`);
        return response.data;
    }

    async markAllNotificationsAsRead() {
        const response = await API.put('/notifications/read-all');
        return response.data;
    }
}

export default new AdminService();
