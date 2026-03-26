const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../services/emailService');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// Generate verification code
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please add all required fields' });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Generate verification code
        const verificationCode = generateVerificationCode();
        const verificationCodeExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role: role || 'student',
            verificationCode,
            verificationCodeExpires,
            isVerified: false,
        });

        console.log(`[TESTING] Verification code for ${email}: ${verificationCode}`);

        if (user) {
            // Send verification email (disabled for testing)
            try {
                await sendVerificationEmail(user.email, user.name, verificationCode);
                console.log('Verification email sent successfully');
            } catch (emailError) {
                console.error('Email sending failed:', emailError);
                // Continue anyway for testing
            }

            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
                message: 'Registration successful! Please check your email for verification code.',
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Registration Error Details:', error);
        res.status(500).json({
            message: 'Server error: ' + error.message,
            error: error.message,
            stack: error.stack
        });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        // Check if user exists and password matches
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check if user is verified
        if (!user.isVerified) {
            return res.status(403).json({
                message: 'Please verify your email before logging in',
                requiresVerification: true,
                email: user.email,
            });
        }

        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Verify email with code
// @route   POST /api/auth/verify-email
// @access  Public
const verifyEmail = async (req, res) => {
    try {
        const { email, verificationCode } = req.body;

        if (!email || !verificationCode) {
            return res.status(400).json({ message: 'Email and verification code are required' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'User is already verified' });
        }

        // Check if code matches and is not expired
        if (user.verificationCode !== verificationCode) {
            return res.status(400).json({ message: 'Invalid verification code' });
        }

        if (new Date() > user.verificationCodeExpires) {
            return res.status(400).json({ message: 'Verification code has expired' });
        }

        // Mark user as verified
        user.isVerified = true;
        user.verificationCode = null;
        user.verificationCodeExpires = null;
        await user.save();

        res.json({
            message: 'Email verified successfully! You can now login.',
            _id: user.id,
            name: user.name,
            email: user.email,
            isVerified: user.isVerified,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Resend verification code
// @route   POST /api/auth/resend-verification
// @access  Public
const resendVerificationCode = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'User is already verified' });
        }

        // Generate new verification code
        const verificationCode = generateVerificationCode();
        const verificationCodeExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

        user.verificationCode = verificationCode;
        user.verificationCodeExpires = verificationCodeExpires;
        await user.save();

        console.log(`[TESTING] Resent Verification code for ${email}: ${verificationCode}`);

        // Send verification email
        try {
            await sendVerificationEmail(user.email, user.name, verificationCode);
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            return res.status(500).json({ message: 'Failed to send verification email' });
        }

        res.json({
            message: 'Verification code sent to your email',
            email: user.email,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/update
// @access  Private
const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            // Bio isn't in the schema currently, but for now we'll just handle name.
            // If the user provided a new password, we could handle it here too.

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                isVerified: updatedUser.isVerified,
                token: generateToken(updatedUser._id),
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete user account
// @route   DELETE /api/auth/delete
// @access  Private
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            await User.deleteOne({ _id: req.user._id });
            res.json({ message: 'User removed successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate verification code 
        const verificationCode = generateVerificationCode();
        // Sets expiry for 15 mins for password resets
        const verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000);

        user.verificationCode = verificationCode;
        user.verificationCodeExpires = verificationCodeExpires;
        await user.save();

        console.log(`[TESTING] Reset Password code for ${email}: ${verificationCode}`);

        // Send reset email
        try {
            await sendPasswordResetEmail(user.email, user.name, verificationCode);
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            return res.status(500).json({ message: 'Failed to send reset code email' });
        }

        res.json({
            message: 'A reset code has been sent to your email',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;

        if (!email || !code || !newPassword) {
            return res.status(400).json({ message: 'Email, code, and new password are required' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if code matches and is not expired
        if (user.verificationCode !== code) {
            return res.status(400).json({ message: 'Invalid reset code' });
        }

        if (new Date() > user.verificationCodeExpires) {
            return res.status(400).json({ message: 'Reset code has expired' });
        }

        // Update user's password
        user.password = newPassword;
        // Clear verification fields
        user.verificationCode = null;
        user.verificationCodeExpires = null;
        await user.save();

        res.json({
            message: 'Password has been reset successfully. You can now login.',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    verifyEmail,
    resendVerificationCode,
    updateUser,
    deleteUser,
    forgotPassword,
    resetPassword,
};
