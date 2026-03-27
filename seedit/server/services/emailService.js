const nodemailer = require('nodemailer');

// Create transporter for sending emails
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

/**
 * Send verification email with code
 * @param {string} email - Recipient email address
 * @param {string} name - Recipient name
 * @param {string} verificationCode - 6-digit verification code
 */
const sendVerificationEmail = async (email, name, verificationCode) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
            to: email,
            subject: 'Verify your Seedit Account',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background-color: #f35c2c; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                        <h1 style="color: white; margin: 0;">Seedit</h1>
                    </div>
                    <div style="padding: 40px; background-color: #f9f9f9; border-radius: 0 0 8px 8px;">
                        <p style="font-size: 16px; color: #333;">Hi ${name},</p>
                        <p style="font-size: 16px; color: #555;">Welcome to Seedit! To complete your registration, please verify your email address by entering the code below:</p>
                        
                        <div style="background-color: white; padding: 30px; text-align: center; border-radius: 8px; margin: 30px 0; border: 2px solid #f35c2c;">
                            <p style="font-size: 14px; color: #999; margin: 0 0 15px 0;">Verification Code</p>
                            <p style="font-size: 36px; font-weight: bold; color: #f35c2c; letter-spacing: 5px; margin: 0;">${verificationCode}</p>
                        </div>
                        
                        <p style="font-size: 14px; color: #777;">
                            <strong>Note:</strong> This code will expire in 24 hours. If you didn't create this account, please ignore this email.
                        </p>
                        
                        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
                        
                        <p style="font-size: 12px; color: #999; text-align: center;">
                            If you have any questions, contact us at support@seedit.academy
                        </p>
                    </div>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Verification email sent to ${email}`);
        return true;
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw error;
    }
};

/**
 * Send password reset email with code
 * @param {string} email - Recipient email address
 * @param {string} name - Recipient name
 * @param {string} verificationCode - 6-digit reset code
 */
const sendPasswordResetEmail = async (email, name, verificationCode) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
            to: email,
            subject: 'Reset your Seedit Account Password',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background-color: #f35c2c; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                        <h1 style="color: white; margin: 0;">Seedit</h1>
                    </div>
                    <div style="padding: 40px; background-color: #f9f9f9; border-radius: 0 0 8px 8px;">
                        <p style="font-size: 16px; color: #333;">Hi ${name},</p>
                        <p style="font-size: 16px; color: #555;">We received a request to reset your password. Use the code below to set up a new password:</p>
                        
                        <div style="background-color: white; padding: 30px; text-align: center; border-radius: 8px; margin: 30px 0; border: 2px solid #f35c2c;">
                            <p style="font-size: 14px; color: #999; margin: 0 0 15px 0;">Reset Code</p>
                            <p style="font-size: 36px; font-weight: bold; color: #f35c2c; letter-spacing: 5px; margin: 0;">${verificationCode}</p>
                        </div>
                        
                        <p style="font-size: 14px; color: #777;">
                            <strong>Note:</strong> This code will expire in 15 minutes. If you didn't request a password reset, please ignore this email.
                        </p>
                        
                        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
                        
                        <p style="font-size: 12px; color: #999; text-align: center;">
                            If you have any questions, contact us at support@seedit.academy
                        </p>
                    </div>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Password reset email sent to ${email}`);
        return true;
    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw error;
    }
};

/**
 * Send contact form email to admin
 * @param {string} name - Sender name
 * @param {string} email - Sender email
 * @param {string} subject - Message subject
 * @param {string} message - Message content
 */
const sendContactEmail = async (name, email, subject, message) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Send TO the admin
            replyTo: email, // Reply-to the student
            subject: `[Contact Form] ${subject} - from ${name}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                    <div style="background-color: #10b981; padding: 20px; text-align: center;">
                        <h1 style="color: white; margin: 0;">New Contact Message</h1>
                    </div>
                    <div style="padding: 30px; background-color: #fff;">
                        <p><strong>From:</strong> ${name} (${email})</p>
                        <p><strong>Subject:</strong> ${subject}</p>
                        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin: 20px 0;">
                            <p style="margin: 0; white-space: pre-wrap;">${message}</p>
                        </div>
                        <p style="font-size: 12px; color: #9ca3af; text-align: center; margin-top: 30px;">
                            This message was sent from the Seedit Contact Form.
                        </p>
                    </div>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Contact email from ${email} sent to admin`);
        return true;
    } catch (error) {
        console.error('Error sending contact email:', error);
        throw error;
    }
};

module.exports = {
    sendVerificationEmail,
    sendPasswordResetEmail,
    sendContactEmail,
};
