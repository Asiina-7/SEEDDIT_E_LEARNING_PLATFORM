const express = require('express');
const router = express.Router();
const { initiatePayment, verifyPayment, getMyPayments } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/initiate', protect, initiatePayment);
router.post('/verify', protect, verifyPayment);
router.get('/my-payments', protect, getMyPayments);

module.exports = router;
