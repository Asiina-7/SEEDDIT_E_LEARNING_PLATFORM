const mongoose = require('mongoose');

const videoSchema = mongoose.Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    duration: { type: String, required: true },
    url: { type: String, required: true },
    isCompleted: { type: Boolean, default: false }
});

const resourceSchema = mongoose.Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    type: { type: String, enum: ['pdf', 'link', 'video', 'zip'], required: true },
    url: { type: String, required: true }
});

const courseSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        category: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        instructor: {
            type: String,
            required: true,
        },
        instructorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        price: {
            type: Number,
            default: 0,
        },
        isFree: {
            type: Boolean,
            default: false,
        },
        rating: {
            type: Number,
            default: 4.5,
        },
        students: {
            type: Number,
            default: 0,
        },
        duration: {
            type: String,
            default: '10h 00m',
        },
        thumbnail: {
            type: String,
            default: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
        },
        videos: [videoSchema],
        resources: [resourceSchema],
        certificateType: {
            type: String,
            enum: ['Professional', 'Foundational', 'Expert'],
            default: 'Professional',
        },
    },
    {
        timestamps: true,
    }
);

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
