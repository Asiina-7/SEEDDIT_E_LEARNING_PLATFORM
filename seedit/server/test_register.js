const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const User = require('./models/User');
const { registerUser } = require('./controllers/authController');

// Mock req and res
const req = {
    body: {
        name: 'Test Artist',
        email: 'test' + Date.now() + '@example.com',
        password: 'password123',
        role: 'student'
    }
};

const res = {
    status: function (code) {
        this.statusCode = code;
        return this;
    },
    json: function (data) {
        console.log('Response Status:', this.statusCode || 200);
        console.log('Response Data:', JSON.stringify(data, null, 2));
    }
};

const testRegistration = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        await registerUser(req, res);

        process.exit(0);
    } catch (error) {
        console.error('Test Script Error:', error);
        process.exit(1);
    }
};

testRegistration();
