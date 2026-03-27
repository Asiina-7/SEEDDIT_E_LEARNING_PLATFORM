const { sendContactEmail } = require('../services/emailService');

/**
 * @desc    Send contact form email
 * @route   POST /api/contact
 * @access  Public
 */
const submitContactForm = async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({
            success: false,
            message: 'Please provide all required fields'
        });
    }

    try {
        await sendContactEmail(name, email, subject, message);
        res.status(200).json({
            success: true,
            message: 'Message sent successfully'
        });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while sending message'
        });
    }
};

module.exports = {
    submitContactForm
};
