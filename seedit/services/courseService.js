import API from './api';

const mapCourse = (data) => {
    if (!data) return data;
    return {
        ...data,
        id: data._id || data.id
    };
};

class CourseService {
    /**
     * Get all courses from backend
     */
    async getAllCourses() {
        try {
            const response = await API.get('/courses');
            return response.data.map(mapCourse);
        } catch (error) {
            console.error('Failed to fetch courses:', error);
            return [];
        }
    }

    /**
     * Get course by ID
     */
    async getCourseById(id) {
        try {
            const response = await API.get(`/courses/${id}`);
            return mapCourse(response.data);
        } catch (error) {
            console.error(`Failed to fetch course ${id}:`, error);
            return undefined;
        }
    }

    /**
     * Get courses by instructor
     */
    async getCoursesByInstructor(instructor) {
        try {
            const response = await API.get(`/courses/instructor/${instructor}`);
            return response.data.map(mapCourse);
        } catch (error) {
            console.error(`Failed to fetch courses for instructor ${instructor}:`, error);
            return [];
        }
    }

    /**
     * Create a new course
     */
    async createCourse(courseData) {
        try {
            const response = await API.post('/courses', courseData);
            return mapCourse(response.data);
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to create course');
        }
    }

    /**
     * Update an existing course
     */
    async updateCourse(id, updates) {
        try {
            const response = await API.put(`/courses/${id}`, updates);
            return mapCourse(response.data);
        } catch (error) {
            console.error(`Failed to update course ${id}:`, error);
            return undefined;
        }
    }

    /**
     * Delete a course
     */
    async deleteCourse(id) {
        try {
            await API.delete(`/courses/${id}`);
            return true;
        } catch (error) {
            console.error(`Failed to delete course ${id}:`, error);
            return false;
        }
    }

    /**
     * Upload a media file
     */
    async uploadFile(file) {
        try {
            const formData = new FormData();
            formData.append('file', file);
            
            // Note: Content-Type is intentionally not set here;
            // axios will automatically set multipart/form-data with boundaries
            const response = await API.post('/upload', formData);
            return response.data.url;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to upload file');
        }
    }
}

export default new CourseService();
