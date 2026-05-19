const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const cors = require('cors');
const helmet = require('helmet');

const restaurantRoutes = require('./routes/restaurantRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Global middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Routes
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/auth', authRoutes);

// 404 handler
app.use((req, res, next) => {
    const err = new Error("Route not found");
    err.statusCode = 404;
    next(err);
});

// Error middleware
app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Server Error"
    });
});

const PORT = process.env.PORT || 5000;

// DB + Server start
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected ✅");

        app.listen(PORT, () => {
            console.log(`Server running on Port ${PORT}`);
        });
    })
    .catch((err) => console.log("DB connection failed ❌"));