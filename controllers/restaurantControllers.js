const Restaurant = require('../models/Restaurant');

// Get All Restaurants
const getAllRestaurants = async (req, res, next) => {
    try {

        // Query params 
        const { search, location, cuisine, page = 1, limit = 5 } = req.query;

        // dynamic query object
        let query = {};

        // search by restaurant name
        if (search) {
            query.name = {
                $regex: search,
                $options: 'i'
            };
        }

        // filter by location
        if (location) {
            query.location = {
                $regex: location,
                $options: 'i'
            }
        }

        // filter by cuisine
        if (cuisine) {
            query.cuisine = {
                $regex: "cuisine",
                $options: "i"
            }
        }

        // pagination calculation
        const pageNumber = Number(page);
        const limitNumber = Number(limit);
        const skip = (pageNumber - 1) * limitNumber;

        // fetch restaurant
        const restaurants = await Restaurant.find(query)
            .skip(skip)
            .limit(limitNumber);

        // total documents count
        const totalRestaurants = await Restaurant.countDocuments(query)
        res.status(200).json({
            success: true,
            totalRestaurants,
            currentPage: pageNumber,
            totalPages: Math.ceil(totalRestaurants / limitNumber),
            restaurants
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
    console.log('req.file:', req.file)      // ← add this
    console.log('req.body:', req.body)
    try {

        const { name, rating, location, cuisine } = req.body;

        // Validation
        if (!name || !rating || !location || !cuisine) {
            const err = new Error("All fields are required");
            err.statusCode = 400;
            return next(err);
        }

        // image url from cloudinary
        const imageUrl = req.file ? req.file.path : '';

        // Create restaurant
        const restaurant = await Restaurant.create({
            name,
            rating,
            location,
            cuisine,
            image: imageUrl
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