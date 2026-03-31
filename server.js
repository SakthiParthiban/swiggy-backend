const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const restaurantRoutes = require('./routes/restaurantRoutes');

const app = express();
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected ✅"))
    .catch((err) => console.log("DB connection failed ❌"));

app.use('/api', restaurantRoutes);

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`);
})