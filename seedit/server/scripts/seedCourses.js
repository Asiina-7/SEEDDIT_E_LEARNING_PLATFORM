const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Course = require('../models/Course');

const seedCourses = [
    {
        title: 'Understanding AI',
        slug: 'understanding-ai-datacamp',
        category: 'Artificial Intelligence',
        description: 'A comprehensive guide to understanding AI from scratch. Learn the basics of machine learning, neural networks, and more.',
        instructor: 'yourname',
        instructorId: '65e9f1a2b3c4d5e6f7a8b9c0', // Placeholder valid ObjectId
        price: 0,
        isFree: true,
        rating: 4.8,
        students: 1250,
        duration: '12h 30m',
        thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
        videos: [
            { id: 'v1', title: 'Introduction to AI', duration: '15:00', url: 'https://example.com/v1' },
            { id: 'v2', title: 'Neural Networks Basics', duration: '25:00', url: 'https://example.com/v2' }
        ],
        resources: [
            { id: 'r1', title: 'AI Roadmap PDF', type: 'pdf', url: 'https://example.com/r1' }
        ],
        certificateType: 'Professional'
    },
    {
        title: 'Web Development Bootcamp',
        slug: 'web-development-bootcamp',
        category: 'Web Development',
        description: 'Complete web development bootcamp teaching HTML, CSS, JavaScript, React, and Node.js.',
        instructor: 'John Doe',
        instructorId: '65e9f1a2b3c4d5e6f7a8b9c1',
        price: 49.99,
        isFree: false,
        rating: 4.9,
        students: 3500,
        duration: '45h 00m',
        thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
        videos: [],
        resources: [],
        certificateType: 'Expert'
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing courses
        await Course.deleteMany({});
        console.log('Cleared existing courses.');

        // Insert seed data
        await Course.insertMany(seedCourses);
        console.log('Seed data inserted successfully!');

        process.exit(0);
    } catch (error) {
        console.error('Seeding Error:', error);
        process.exit(1);
    }
};

seedDB();
