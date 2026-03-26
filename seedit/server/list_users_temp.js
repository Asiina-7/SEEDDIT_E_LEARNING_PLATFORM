const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const User = require('./models/User');

const listUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const users = await User.find({});
        console.log('Total Users:', users.length);
        users.forEach(user => {
            console.log(`- Email: ${user.email}, Role: ${user.role}, Name: ${user.name}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error listing users:', error);
        process.exit(1);
    }
};

listUsers();
