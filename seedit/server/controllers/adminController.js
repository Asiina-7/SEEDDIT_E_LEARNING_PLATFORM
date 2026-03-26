const Progress = require('../models/Progress');
const User = require('../models/User');
const Payment = require('../models/Payment');
const mongoose = require('mongoose');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get system stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = async (req, res) => {
    try {
        const studentCount = await User.countDocuments({ role: 'student' });
        const mentorCount = await User.countDocuments({ role: 'mentor' });
        const courseCount = await mongoose.model('Course').countDocuments({});

        const payments = await Payment.find({ status: 'approved' });
        const revenue = payments.reduce((acc, p) => acc + p.amount, 0);

        res.json({
            studentCount,
            mentorCount,
            courseCount,
            revenue
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get pending payments
// @route   GET /api/admin/payments/pending
// @access  Private/Admin
const getPendingPayments = async (req, res) => {
    try {
        const payments = await Payment.find({ status: 'pending' });
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Verify payment
// @route   PUT /api/admin/payments/:id/verify
// @access  Private/Admin
const verifyPayment = async (req, res) => {
    try {
        const { status } = req.body; // 'approved' or 'rejected'
        const payment = await Payment.findById(req.params.id);

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        payment.status = status;
        payment.verifiedBy = req.user._id;
        await payment.save();

        if (status === 'approved') {
            // Logic to grant course access
            let progress = await Progress.findOne({ user: payment.user, course: payment.course });
            if (!progress) {
                await Progress.create({
                    user: payment.user,
                    course: payment.course,
                    completedVideos: []
                });
            }
        }

        res.json(payment);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getAllUsers,
    getStats,
    getPendingPayments,
    verifyPayment
};
