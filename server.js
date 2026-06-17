const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const cors = require('cors');
const helmet = require('helmet');

const restaurantRoutes = require('./routes/restaurantRoutes');
const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const{apiLimiter} = require('./middleware/rateLimiter');
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();

// Global middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Routes
app.use('/api',apiLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/reviews', reviewRoutes);


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

module.exports = app;

// DB + Server start
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected ✅");

        app.listen(PORT, () => {
            console.log(`Server running on Port ${PORT}`);
        });
    })
    .catch((err) => console.log("DB connection failed ❌"));