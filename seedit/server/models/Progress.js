const mongoose = require('mongoose');

const progressSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: true,
        },
        completedVideos: [
            {
                videoId: String,
                completedAt: { type: Date, default: Date.now }
            }
        ],
        quizPassed: {
            type: Boolean,
            default: false,
        },
        quizScore: {
            type: Number,
            default: 0,
        },
        certificateGenerated: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true,
    }
);

// Unique index to ensure only one progress record per user per course
progressSchema.index({ user: 1, course: 1 }, { unique: true });

const Progress = mongoose.model('Progress', progressSchema);

module.exports = Progress;
