const express = require('express');
const router = express.Router();
const { updateProgress, getMyProgress, getCourseProgress } = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

router.post('/update', protect, updateProgress);
router.get('/me', protect, getMyProgress);
router.get('/course/:courseId', protect, getCourseProgress);

module.exports = router;
