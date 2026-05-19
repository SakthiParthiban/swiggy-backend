const Restaurant = require('../models/Restaurant');

// Get All Restaurants
const getAllRestaurants = async (req, res, next) => {
    try {

        const restaurants = await Restaurant.find();

        res.status(200).json({
            success: true,
            count: restaurants.length,
            data: restaurants
        });

    } catch (err) {
        next(err);
    }
};

// Get Restaurant By ID
const getRestaurantById = async (req, res, next) => {
    try {

        const restaurant = await Restaurant.findById(req.params.id);

        if (!restaurant) {
            const err = new Error("Restaurant not found");
            err.statusCode = 404;
            return next(err);
        }

        res.status(200).json({
            success: true,
            data: restaurant
        });

    } catch (err) {
        next(err);
    }
};

// Create New Restaurant
const createRestaurant = async (req, res, next) => {
    try {

        const { name, rating, location, cuisine } = req.body;

        // Validation
        if (!name || !rating || !location || !cuisine) {
            const err = new Error("All fields are required");
            err.statusCode = 400;
            return next(err);
        }

        // Create restaurant
        const restaurant = await Restaurant.create({
            name,
            rating,
            location,
            cuisine
        });

        res.status(201).json({
            success: true,
            message: "Restaurant created successfully",
            data: restaurant
        });

    } catch (err) {
        next(err);
    }
};

// Update Restaurant
const updateRestaurant = async (req, res, next) => {
    try {

        const restaurant = await Restaurant.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!restaurant) {
            const err = new Error("Restaurant not found");
            err.statusCode = 404;
            return next(err);
        }

        res.status(200).json({
            success: true,
            message: "Restaurant updated successfully",
            data: restaurant
        });

    } catch (err) {
        next(err);
    }
};

// Delete Restaurant
const deleteRestaurant = async (req, res, next) => {
    try {

        const restaurant = await Restaurant.findByIdAndDelete(req.params.id);

        if (!restaurant) {
            const err = new Error("Restaurant not found");
            err.statusCode = 404;
            return next(err);
        }

        res.status(200).json({
            success: true,
            message: "Restaurant deleted successfully"
        });

    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAllRestaurants,
    getRestaurantById,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant
};