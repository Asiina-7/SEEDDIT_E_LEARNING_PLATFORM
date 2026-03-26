const Progress = require('../models/Progress');
const Course = require('../models/Course');
const User = require('../models/User');

// @desc    Update course progress
// @route   POST /api/progress/update
// @access  Private
const updateProgress = async (req, res) => {
    try {
        const { courseId, videoId, quizPassed, quizScore } = req.body;
        const userId = req.user._id;

        let progress = await Progress.findOne({ user: userId, course: courseId });

        if (!progress) {
            progress = new Progress({
                user: userId,
                course: courseId,
                completedVideos: []
            });
        }

        if (videoId) {
            // Check if video already marked as completed
            const alreadyCompleted = progress.completedVideos.find(v => v.videoId === videoId);
            if (!alreadyCompleted) {
                progress.completedVideos.push({ videoId });
            }
        }

        if (quizPassed !== undefined) {
            progress.quizPassed = quizPassed;
        }

        if (quizScore !== undefined) {
            progress.quizScore = quizScore;
        }

        const updatedProgress = await progress.save();

        // If course is completed (all videos + quiz), we could trigger certificate generation logic here
        // For now, we'll just return the progress
        res.json(updatedProgress);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get user progress for all courses
// @route   GET /api/progress/me
// @access  Private
const getMyProgress = async (req, res) => {
    try {
        const progress = await Progress.find({ user: req.user._id }).populate('course');
        res.json(progress);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get progress for a specific course
// @route   GET /api/progress/course/:courseId
// @access  Private
const getCourseProgress = async (req, res) => {
    try {
        const progress = await Progress.findOne({
            user: req.user._id,
            course: req.params.courseId
        });

        if (!progress) {
            return res.json({ completedVideos: [], quizPassed: false, quizScore: 0 });
        }

        res.json(progress);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    updateProgress,
    getMyProgress,
    getCourseProgress
};
