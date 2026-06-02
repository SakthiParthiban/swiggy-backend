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
            err.statusCode = 400;
            return next(err);
        }

        // check the restaurant exists
        const restaurant = await Restaurant.findById({ restaurantId });

        if (!restaurant) {
            const err = new Error("Restaurant not found");
            err.statusCode = 404;
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

// get menu by id
const getMenuItemById = async (req, res, next) => {
    try {
        const { menuId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(menuId)) {
            const err = new Error("Invalid menu id");
            err.statusCode = 400;
            return next(err);
        }

        const menuItem = await Menu.findById(menuId);

        if (!menuItem) {
            const err = new Error("Menu item not found");
            err.statusCode = 404;
            return next(err);
        }

        res.status(200).json({
            success: true,
            data: menuItem
        })
    }
    catch (err) {
        next(err);
    }
}

// update menu item
const updateMenuItem = async (req, res, next) => {
    try {
        const { menuId } = req.params;

        // 1. Validate ID format
        if (!mongoose.Types.ObjectId.isValid(menuId)) {
            const err = new Error("Invalid menu ID format");
            err.statusCode = 400;
            return next(err);
        }

        // 2. Build the update object
        const updateData = { ...req.body };

        // image update
        if (req.file) {
            updateData.image = req.file.path;
        }

        const updatedMenu = await Menu.findByIdAndUpdate(
            menuId,
            updateData,
            {
                new: true,
                runValidators: true
            }
        );

        // 4. Check the menu item existed
        if (!updatedMenu) {
            const err = new Error("Menu item not found");
            err.statusCode = 404;
            return next(err);
        }

        return res.status(200).json({
            success: true,
            data: updatedMenu
        });

    } catch (err) {
        next(err);
    }
}

// delete menu
const deleteMenuItem = async (req, res, next) => {
    try {

        const { menuId } = req.params;

        // Validate ID
        if (!mongoose.Types.ObjectId.isValid(menuId)) {
            const err = new Error("Invalid menu ID format");
            err.statusCode = 400;
            return next(err);
        }

        // Delete menu item
        const deletedMenu = await Menu.findByIdAndDelete(menuId);

        // Check exists
        if (!deletedMenu) {
            const err = new Error("Menu item not found");
            err.statusCode = 404;
            return next(err);
        }

        res.status(200).json({
            success: true,
            message: "Menu item deleted successfully"
        });

    } catch (err) {
        next(err);
    }
};