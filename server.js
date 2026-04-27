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

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected ✅"))
    .catch((err) => console.log("DB connection failed ❌"));

app.use('/api', restaurantRoutes);
app.use('/api/auth', authRoutes);

// Error middlware
app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`);
})