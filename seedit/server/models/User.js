const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['student', 'mentor', 'admin'],
            default: 'student',
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        verificationCode: {
            type: String,
            default: null,
        },
        verificationCodeExpires: {
            type: Date,
            default: null,
        },
        bio: {
            type: String,
            default: "Learner at Seedit E-Learning Platform",
        },
        skills: {
            type: [String],
            default: [],
        },
        certificates: [
            {
                courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
                courseTitle: String,
                issueDate: { type: Date, default: Date.now },
                certificateId: String,
                type: String
            }
        ],
    },
    {
        timestamps: true,
    }
);

// Method to match entered password with hashed password in DB
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware to hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

module.exports = User;
