const User = require('../models/User.js');
const sendEmail = require('../config/emailConfig')
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Signup
const signup = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // Validation
        if (!name || !email || !password) {
            const err = new Error("All fields are required");
            err.statusCode = 400;
            return next(err);
        }

        // Check existing user
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            const err = new Error("User already exists");
            err.statusCode = 400;
            return next(err);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'user' // Admin role only via DB — intentional security
        });

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRE
            }
        );

        res.status(201).json({
            success: true,
            message: "Signup successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        next(err);
    }
};

// Login
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            const err = new Error("All fields are required");
            err.statusCode = 400;
            return next(err);
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            const err = new Error("Invalid credentials");
            err.statusCode = 401;
            return next(err);
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            const err = new Error("Invalid credentials");
            err.statusCode = 401;
            return next(err);
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRE
            }
        );

        res.status(200).json({
            success: true,
            message: "Login successful ✅",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        next(err);
    }
};

// Forgot password
const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            const err = new Error("Email required");
            err.statusCode = 400;
            return next(err);
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(200).json({
                success: true,
                message: "If account exists, OTP sent successfully"
            });
        }


        // generate OTP
        const otp = crypto.randomInt(100000, 999999).toString();

        // hash OTP
        const hashedOTP = crypto
            .createHash('sha256')
            .update(otp)
            .digest('hex');

        // save and reset OTP
        user.resetOTP = hashedOTP;
        user.resetOTPExpire = Date.now() + 10 * 60 * 1000;
        await user.save();

        // Email template 
        const html = `
        <h2>Password Reset OTP</h2>
        <p>Your OTP is:<strong>${otp}</strong></p>
        <p>Valid for 10 minutes only</p>`
        try {
            await sendEmail(
                email,
                'Password Reset OTP - Swiggy',
                html
            );
        } catch (emailError) {
            // Log email error internally, but don't break the client response
            console.error("Email delivery failed:", emailError);
        }
        res.status(200).json({
            success: true,
            message: "If account exists, OTP send successfully"
        });
    }
    catch (err) {
        next(err);
    }
}

// Reset password
const resetPassword = async (req, res, next) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            const err = new Error("All fields are required");
            err.statusCode = 400;
            return next(err);
        }

        const user = await User.findOne({ email });

        if (!user) {
            const err = new Error("Invalid request");
            err.statusCode = 400;
            return next(err);
        }

        // Hash otp
        const otpString = String(otp).trim();
        const hashedOTP = crypto
            .createHash('sha256')
            .update(otpString)
            .digest('hex');

        // verify otp
        if (user.resetOTP !== hashedOTP) {
            const err = new Error("Invalid OTP");
            err.statusCode = 400;
            return next(err);
        }

        // check expiration
        if (user.resetOTPExpire < Date.now()) {
            const err = new Error("OTP expired");
            err.statusCode = 400;
            return next(err);
        }

        // hashed password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // update password
        user.password = hashedPassword;

        // clear OTP
        user.resetOTP = undefined;
        user.resetOTPExpire = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Password reset successful"
        });
    }
    catch (err) {
        next(err);
    }
};

module.exports = { signup, login, forgotPassword, resetPassword };