const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const User = require('../models/User');
const Course = require('../models/Course');
const Payment = require('../models/Payment');

const seedPayments = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const student = await User.findOne({ role: 'student' });
        const courses = await Course.find({}).limit(2);

        if (!student) {
            console.log('No student found to associate with payments. Please register a student first.');
            process.exit(1);
        }

        if (courses.length === 0) {
            console.log('No courses found. Please create courses first.');
            process.exit(1);
        }

        const pendingPayments = [
            {
                user: student._id,
                userName: student.name,
                course: courses[0]._id,
                courseTitle: courses[0].title,
                amount: courses[0].price || 499,
                utr: 'UTR' + Math.floor(Math.random() * 1000000000),
                status: 'pending'
            }
        ];

        if (courses.length > 1) {
            pendingPayments.push({
                user: student._id,
                userName: student.name,
                course: courses[1]._id,
                courseTitle: courses[1].title,
                amount: courses[1].price || 599,
                utr: 'UTR' + Math.floor(Math.random() * 1000000000),
                status: 'pending'
            });
        }

        await Payment.insertMany(pendingPayments);
        console.log('Successfully seeded pending payments!');
        console.log(`Associated with Student: ${student.name} (${student.email})`);
        
        process.exit(0);
    } catch (error) {
        console.error('Error seeding payments:', error);
        process.exit(1);
    }
};

seedPayments();
