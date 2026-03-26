const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'server', '.env') });
const Notification = require('./server/models/Notification');
const User = require('./server/models/User');

async function seedTestNotification() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const admin = await User.findOne({ role: 'admin' });
        if (!admin) {
            console.error('No admin found');
            process.exit(1);
        }

        await Notification.create({
            user: admin._id,
            title: 'Test Notification',
            message: 'This is a test notification to verify the system works.',
            type: 'system'
        });

        const count = await Notification.countDocuments({});
        console.log(`Notification created. Total: ${count}`);
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seedTestNotification();
