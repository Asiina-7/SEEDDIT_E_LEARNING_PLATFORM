const express = require('express');
const router = express.Router();
const { handleChat } = require('../controllers/aiController');
// const { protect } = require('../middleware/authMiddleware'); // Uncomment to require login for AI tutor

router.post('/chat', handleChat);

module.exports = router;
