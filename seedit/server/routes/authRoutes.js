const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, verifyEmail, resendVerificationCode, updateUser, deleteUser, forgotPassword, resetPassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerificationCode);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', protect, getMe);
router.put('/update', protect, updateUser);
router.delete('/delete', protect, deleteUser);

module.exports = router;
