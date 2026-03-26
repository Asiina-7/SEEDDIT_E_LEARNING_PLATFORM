const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer config for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Create unique filenames
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB limit max for basic uploads
    }
});

// @desc    Upload a file
// @route   POST /api/upload
// @access  Public (or protect based on your needs)
router.post('/', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        
        // Return the path for the frontend to access the file
        const fileUrl = `/uploads/${req.file.filename}`;
        
        res.status(200).json({
            message: 'File uploaded successfully',
            url: fileUrl,
            fileName: req.file.filename,
        });
    } catch (error) {
        console.error('File upload error:', error);
        res.status(500).json({ message: 'Error uploading file' });
    }
});

module.exports = router;
