const mongoose = require('mongoose');
const Menu = require('../models/Menu');
const Restaurant = require('../models/Restaurant');

const createMenuItem = async (req, res, next) => {
    try {
        const { name, description, price, category, restaurantId } = req.body;

        if (!name || !description || price === undefined || price <= 0 || !category || !restaurantId) {
            const err = new Error("All feilds are required");
            err.statusCode = 400;
            return next(err);
        }
        const imageUrl = req.file ? req.file.path : '';

        if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
            const err = new Error("Invalid Restaurant Id");
            err.statusCode = 400;
            return next(err);
        }

        // check restaurant exists in db
        const restaurant = await Restaurant.exists({ _id: restaurantId });

        if (!restaurant) {
            const err = new Error("Restaurant not found");
            err.statusCode = 404;
            return next(err);
        }

        const menu = await Menu.create({
            name,
            description,
            price,
            image: imageUrl,
            category,
            restaurantId,
        });

        res.status(201).json({
            success: true,
            message: "Menu item created successfully",
            data: menu
        })
    }
    catch (err) {
        next(err);
    }
}

// get menu
const getMenuByRestaurant = async (req, res, next) => {
    try {
        const { restaurantId } = req.params;

        // valid ID
        if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
            const err = new Error("Restaurant Id not found");
            err.statuscode = 400;
            return next(err);
        }

        // check the restaurant exists
        const restaurant = await Restaurant.findById({ restaurantId });

        if (!restaurant) {
            const err = new Error("Restaurant not found");
            err.statuscode = 404;
            return next(err);
        }

        // fetch restaurant details
        const menuItems = await Menu.find({ restaurantId });

        res.status(200).json({
            success: true,
            count: menuItems.length,
            menuItems
        })
    }
    catch (err) {
        next(err);
    }
}