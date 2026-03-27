const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const fs = require('fs');

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');


const app = express();
const allowedOrigins = (process.env.CLIENT_URLS || process.env.CLIENT_URL || '')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean);

app.use(cors({
    origin(origin, callback) {
        // Allow server-to-server requests, health checks, and local tools without an Origin header.
        if (!origin) {
            return callback(null, true);
        }

        if (
            allowedOrigins.length === 0 ||
            allowedOrigins.includes(origin)
        ) {
            return callback(null, true);
        }

        return callback(new Error(`CORS blocked for origin: ${origin}`));
    }
}));
app.use(express.json());

// Serve uploads statically
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
    next();
});

const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');
const aiRoutes = require('./routes/aiRoutes');
const courseRoutes = require('./routes/courseRoutes');
const progressRoutes = require('./routes/progressRoutes');
const adminRoutes = require('./routes/adminRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notifications', notificationRoutes);

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend is working!', timestamp: new Date() });
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});




// Connect to MongoDB & Start Server
const startServer = async () => {
    try {
        await connectDB();

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`Allowed client origins: ${allowedOrigins.length > 0 ? allowedOrigins.join(', ') : 'all origins'}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
