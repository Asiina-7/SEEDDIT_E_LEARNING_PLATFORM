import API from './api';

class PaymentService {
    async initiatePayment(data) {
        try {
            const response = await API.post('/payments/initiate', data);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to process payment');
        }
    }

    async verifyPayment(data) {
        try {
            const response = await API.post('/payments/verify', data);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to verify payment');
        }
    }

    async getMyPayments() {
        try {
            const response = await API.get('/payments/my-payments');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch payment history');
        }
    }
}

export default new PaymentService();
