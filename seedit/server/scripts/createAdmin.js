const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const User = require('../models/User');

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const adminEmail = 'admin@seedit.edu';
        const adminExists = await User.findOne({ email: adminEmail });

        if (adminExists) {
            console.log('Admin already exists.');
            process.exit(0);
        }

        const admin = new User({
            name: 'System Admin',
            email: adminEmail,
            password: 'Admin@123',
            role: 'admin',
            isVerified: true
        });

        await admin.save();
        console.log('Admin user created successfully!');
        console.log('Email: admin@seedit.edu');
        console.log('Password: Admin@123');

        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
