const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Send Email Function
const sendEmail = async (to, subject, html) => {
    try {
        const mailOptions = {
            from: `"Swiggy App" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to} ✅`);
    }
    
    catch (err) {
        console.error('Email send failed:', err.message);
        const error = new Error('Email sending failed');
        error.statusCode = 500;
        throw error;
    }
};

module.exports = sendEmail;