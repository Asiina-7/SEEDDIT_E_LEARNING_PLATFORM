import API from './api';

class ProgressService {
    async updateProgress(data) {
        try {
            const response = await API.post('/progress/update', data);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to update progress');
        }
    }

    async getMyProgress() {
        try {
            const response = await API.get('/progress/me');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch progress');
        }
    }

    async getCourseProgress(courseId) {
        try {
            const response = await API.get(`/progress/course/${courseId}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch course progress');
        }
    }
}

export default new ProgressService();
