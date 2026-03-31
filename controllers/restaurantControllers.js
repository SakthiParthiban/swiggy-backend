const Restaurant = require('../models/Restaurants');

// Get All Restaurants
const getAllRestaurants = async (req, res) => {
    try {
        const restaurant = await Restaurant.find();
        res.status(200).json(restaurant)
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// Create New Restaurant
const createRestaurant = async (req, res) => {
    try {
        const { name, rating, location, cuisine } = req.body;

        if (!name || !rating || !location || !cuisine) {
            return res.status(400).json({ message: "All feilds are Require" });
        }
        const restaurant = await Restaurant.create({
            name,
            rating,
            location,
            cuisine
        })
        res.status(201).json({ message: "Restaurant created successfully", data: restaurant });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}
// Delete Restaurant
const deleteRestaurant = async (req, res) => {
    try {
        const restaurantId = req.params.id
        const restaurant = await Restaurant.findByIdAndDelete(restaurantId)
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" })
        }
        res.status(200).json({ message: "Restaurant deleted successfully" })
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
}
// Update Restaurant
const updateRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (restaurant) {
            res.status(200).json({ message: "Restaurant details update successfully" });
        }
        else {
            res.status(404).json({ message: "Restaurant not found" });
        }
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
}
module.exports = { getAllRestaurants, createRestaurant, deleteRestaurant, updateRestaurant };