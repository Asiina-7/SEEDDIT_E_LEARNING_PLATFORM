# APPENDIX

## Source Code Listing – Seedit E-Learning Platform

This appendix contains the complete source code for the **Seedit E-Learning Platform**, organized by architectural layer. The platform is built using **React (Vite)** for the frontend and **Node.js (Express)** for the backend, with **MongoDB** as the database and integrations for **Razorpay** (payments), **Groq AI** (tutoring), and **Nodemailer** (email).

---

## A.1 Project Configuration

### A.1.1 Frontend – package.json
**File:** `seedit/package.json`

```json
{
  "name": "seedit-elearning",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest"
  },
  "dependencies": {
    "@emailjs/browser": "^4.4.1",
    "@types/canvas-confetti": "^1.9.0",
    "axios": "^1.13.6",
    "canvas-confetti": "^1.9.4",
    "framer-motion": "^12.35.2",
    "groq-sdk": "^0.5.0",
    "lucide-react": "^0.453.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^7.1.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.2",
    "@testing-library/user-event": "^14.6.1",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "jsdom": "^29.0.0",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.14",
    "typescript": "^5.6.3",
    "vite": "^6.0.0",
    "vitest": "^4.1.0"
  }
}
```

### A.1.2 Vite Configuration
**File:** `seedit/vite.config.js`

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './setupTests.js',
  }
});
```

---

## A.2 Backend – Server Entry Point

### A.2.1 Express Server
**File:** `seedit/server/server.js`

```javascript
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const fs = require('fs');

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
app.use(cors());
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
const aiRoutes = require('./routes/aiRoutes');
const courseRoutes = require('./routes/courseRoutes');
const progressRoutes = require('./routes/progressRoutes');
const adminRoutes = require('./routes/adminRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend is working!', timestamp: new Date() });
});

const startServer = async () => {
    try {
        await connectDB();
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
```

### A.2.2 Database Configuration
**File:** `seedit/server/config/db.js`

```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {});
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
```

---

## A.3 Database Models

### A.3.1 User Model
**File:** `seedit/server/models/User.js`

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: {
            type: String,
            enum: ['student', 'mentor', 'admin'],
            default: 'student',
        },
        isVerified: { type: Boolean, default: false },
        verificationCode: { type: String, default: null },
        verificationCodeExpires: { type: Date, default: null },
        bio: { type: String, default: "Learner at Seedit E-Learning Platform" },
        skills: { type: [String], default: [] },
        certificates: [
            {
                courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
                courseTitle: String,
                issueDate: { type: Date, default: Date.now },
                certificateId: String,
                type: String
            }
        ],
    },
    { timestamps: true }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
module.exports = User;
```

### A.3.2 Course Model
**File:** `seedit/server/models/Course.js`

```javascript
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
        title: { type: String, required: true },
        slug: { type: String, required: true, unique: true, index: true },
        category: { type: String, required: true },
        description: { type: String, required: true },
        instructor: { type: String, required: true },
        instructorId: {
            type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true
        },
        price: { type: Number, default: 0 },
        isFree: { type: Boolean, default: false },
        rating: { type: Number, default: 4.5 },
        students: { type: Number, default: 0 },
        duration: { type: String, default: '10h 00m' },
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
    { timestamps: true }
);

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
```

### A.3.3 Payment Model
**File:** `seedit/server/models/Payment.js`

```javascript
const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        userName: String,
        course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
        courseTitle: String,
        amount: { type: Number, required: true },
        utr: { type: String, required: true, unique: true },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
        verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true }
);

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
```

### A.3.4 Progress Model
**File:** `seedit/server/models/Progress.js`

```javascript
const mongoose = require('mongoose');

const progressSchema = mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
        completedVideos: [
            {
                videoId: String,
                completedAt: { type: Date, default: Date.now }
            }
        ],
        quizPassed: { type: Boolean, default: false },
        quizScore: { type: Number, default: 0 },
        certificateGenerated: { type: Boolean, default: false }
    },
    { timestamps: true }
);

progressSchema.index({ user: 1, course: 1 }, { unique: true });

const Progress = mongoose.model('Progress', progressSchema);
module.exports = Progress;
```

### A.3.5 Notification Model
**File:** `seedit/server/models/Notification.js`

```javascript
const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        title: { type: String, required: true },
        message: { type: String, required: true },
        type: {
            type: String,
            enum: ['payment', 'system', 'course', 'user'],
            default: 'system',
        },
        isRead: { type: Boolean, default: false },
        link: { type: String, default: '' },
    },
    { timestamps: true }
);

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
```

---

## A.4 Middleware

### A.4.1 Authentication Middleware
**File:** `seedit/server/middleware/authMiddleware.js`

```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { protect, admin };
```
