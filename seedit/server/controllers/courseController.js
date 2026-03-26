const Course = require('../models/Course');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res) => {
    try {
        const courses = await Course.find({});
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get course by ID
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = async (req, res) => {
    try {
        const { id } = req.params;
        let course;

        // Check if id is a valid MongoDB ObjectId
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            course = await Course.findById(id);
        } else {
            // If not an ObjectId, try to find by slug
            course = await Course.findOne({ slug: id });
        }

        if (course) {
            res.json(course);
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        console.error('Get Course Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create a course
// @route   POST /api/courses
// @access  Private/Mentor
const createCourse = async (req, res) => {
    try {
        const {
            title,
            category,
            description,
            price,
            videos,
            resources,
            certificateType,
            thumbnail
        } = req.body;

        // Generate a slug from the title
        const generatedSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();

        const course = new Course({
            title,
            slug: generatedSlug,
            category,
            description,
            instructor: req.user.name,
            instructorId: req.user._id,
            price,
            isFree: price === 0,
            videos: videos || [],
            resources: resources || [],
            certificateType: certificateType || 'Professional',
            thumbnail: thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80'
        });

        const createdCourse = await course.save();
        res.status(201).json(createdCourse);
    } catch (error) {
        console.error('Create Course Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get courses by instructor
// @route   GET /api/courses/instructor/:name
// @access  Public
const getCoursesByInstructor = async (req, res) => {
    try {
        const courses = await Course.find({ instructor: req.params.name });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getCourses,
    getCourseById,
    createCourse,
    getCoursesByInstructor
};
