try {
    console.log('Loading Course model...');
    const Course = require('./models/Course');
    console.log('Course model loaded.');

    console.log('Loading User model...');
    const User = require('./models/User');
    console.log('User model loaded.');

    process.exit(0);
} catch (error) {
    console.error('Model Load Error:', error);
    process.exit(1);
}
