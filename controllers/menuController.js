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

        if (!mongoose.Types.objectId.isValid(restaurantId)) {
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