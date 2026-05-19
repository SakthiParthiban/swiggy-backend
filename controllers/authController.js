const User = require('../models/User.js');
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
            role: 'user'
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

module.exports = { signup, login };