const Payment = require('../models/Payment');
const Course = require('../models/Course');
const Progress = require('../models/Progress');
const Notification = require('../models/Notification');
const User = require('../models/User');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder_key',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_placeholder_secret',
});

// @desc    Initiate payment (Creates a Razorpay Order)
// @route   POST /api/payments/initiate
// @access  Private
const initiatePayment = async (req, res) => {
    try {
        const { courseId, amount } = req.body;
        
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Razorpay receipt field has a max length of 40 characters
        const receipt = `rcpt_${courseId}_${req.user._id}`.substring(0, 40);

        const options = {
            amount: Math.round(amount * 100), // Razorpay amount is in paise, must be integer
            currency: "INR",
            receipt: receipt,
        };

        const order = await razorpayInstance.orders.create(options);

        // Pre-create a payment record as pending
        const payment = new Payment({
            user: req.user._id,
            userName: req.user.name,
            course: courseId,
            courseTitle: course.title,
            amount: amount,
            utr: order.id, // Using order ID as temporary reference before UTR is confirmed
            status: 'pending'
        });

        await payment.save();

        res.status(201).json({
            message: 'Order created',
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
        });
    } catch (error) {
        console.error('Payment Initiation Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Verify Razorpay payment callback
// @route   POST /api/payments/verify
// @access  Private
const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } = req.body;
        
        const key_secret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_placeholder_secret';
        
        const generated_signature = crypto
            .createHmac('sha256', key_secret)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest('hex');

        if (generated_signature !== razorpay_signature) {
            return res.status(400).json({ message: 'Invalid payment signature' });
        }

        // Signature is valid. Update payment status.
        // We find the payment record using the temporary 'utr' field where we stored the order_id, 
        // OR search by user and course if necessary. Here we search by order id:
        let payment = await Payment.findOne({ utr: razorpay_order_id, user: req.user._id });
        
        if (payment) {
            payment.status = 'approved';
            payment.utr = razorpay_payment_id; // Update to actual payment ID
            await payment.save();
        } else {
             // Fallback if not found by order id
             const course = await Course.findById(courseId);
             payment = new Payment({
                 user: req.user._id,
                 userName: req.user.name,
                 course: courseId,
                 courseTitle: course?.title || 'Unknown Course',
                 amount: course?.price || 0,
                 utr: razorpay_payment_id,
                 status: 'approved'
             });
             await payment.save();
        }

        // Automatically enroll the user since payment is successful
        let progress = await Progress.findOne({ user: req.user._id, course: courseId });
        if (!progress) {
            progress = new Progress({
                user: req.user._id,
                course: courseId,
                completedVideos: [],
                isCertified: false,
                enrollmentDate: new Date()
            });
            await progress.save();
            
            // Push to user enrolledCourses
            await User.findByIdAndUpdate(req.user._id, {
                $addToSet: { enrolledCourses: progress._id }
            });
            
            // Increment course student count
            await Course.findByIdAndUpdate(courseId, { $inc: { students: 1 } });
        }

        // Notify admins about successful payment
        try {
            const course = await Course.findById(courseId);
            const admins = await User.find({ role: 'admin' });
            const notifications = admins.map(admin => ({
                user: admin._id,
                title: 'Payment Successful',
                message: `Student ${req.user.name} has completed payment of ₹${payment.amount} for ${course?.title || 'a course'}. Payment ID: ${razorpay_payment_id}`,
                type: 'payment',
                link: '/admin/dashboard'
            }));
            await Notification.insertMany(notifications);
        } catch (noticeError) {
            console.error('Failed to create notification:', noticeError);
        }

        res.status(200).json({ message: 'Payment verified successfully' });

    } catch (error) {
        console.error('Payment Verification Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get user payments
// @route   GET /api/payments/my-payments
// @access  Private
const getMyPayments = async (req, res) => {
    try {
        const payments = await Payment.find({ user: req.user._id }).sort('-createdAt');
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    initiatePayment,
    verifyPayment,
    getMyPayments
};
