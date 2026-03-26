const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });


const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const Course = mongoose.model('Course', new mongoose.Schema({ title: String }));
        const courses = await Course.find({});
        console.log('Courses count:', courses.length);
        console.log('Courses:', JSON.stringify(courses, null, 2));

        const User = mongoose.model('User', new mongoose.Schema({ email: String }));
        const users = await User.find({});
        console.log('Users count:', users.length);

        process.exit(0);
    } catch (error) {
        console.error('DB Check Error:', error);
        process.exit(1);
    }
};

checkDB();
