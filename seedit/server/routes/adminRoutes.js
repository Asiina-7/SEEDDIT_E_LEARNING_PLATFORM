const express = require('express');
const router = express.Router();
const { getAllUsers, getStats, getPendingPayments, verifyPayment } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/users', protect, admin, getAllUsers);
router.get('/stats', protect, admin, getStats);
router.get('/payments/pending', protect, admin, getPendingPayments);
router.put('/payments/:id/verify', protect, admin, verifyPayment);

module.exports = router;
