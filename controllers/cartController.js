const Cart = require('../models/Cart');
const Menu = require('../models/Menu');

// Helper function - use to calculate menu amount from db
const calculateCartTotal = async (cart) => {
    if (cart.items.length === 0) {
        cart.totalAmount = 0;
        cart.restaurantId = null;
        return;
    }

    let total = 0;
    for (const item of cart.items) {
        const menuItem = await Menu.findById(item.menuId);
        if (menuItem) {
            total += menuItem.price * item.quantity;
        }
    }
    cart.totalAmount = total;
};

// 1️⃣ Add to cart
const addToCart = async (req, res, next) => {
    try {
        const userId = req.user.id; 
        const { menuId, quantity = 1 } = req.body;

        const menuItem = await Menu.findById(menuId);
        if (!menuItem) {
            const err = new Error("Menu item not found");
            err.statusCode = 404;
            return next(err);
        }

        const incomingRestaurantId = menuItem.restaurantId.toString();
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({
                userId,
                restaurantId: incomingRestaurantId,
                items: [{ menuId, quantity }]
            });
        } else {
            if (cart.items.length > 0 && cart.restaurantId.toString() !== incomingRestaurantId) {
                return res.status(400).json({
                    success: false,
                    conflict: true, 
                    message: "Your cart contains items from another restaurant. Clear cart to add items from this restaurant."
                });
            }

            if (cart.items.length === 0) {
                cart.restaurantId = incomingRestaurantId;
            }

            const itemIndex = cart.items.findIndex(item => item.menuId.toString() === menuId);

            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({ menuId, quantity });
            }
        }

        await calculateCartTotal(cart);
        await cart.save();

        return res.status(200).json({
            success: true,
            message: "Item added to cart successfully",
            data: cart
        });
    } catch (err) {
        next(err);
    }
};

// Get cart
const getCart = async (req, res, next) => {
    try {
        const userId = req.user.id;

        // populate() method
        const cart = await Cart.findOne({ userId }).populate({
            path: 'items.menuId',
            select: 'name price image category description' 
        });

        if (!cart) {
            return res.status(200).json({
                success: true,
                message: "Cart is empty",
                data: { userId, restaurantId: null, items: [], totalAmount: 0 }
            });
        }

        return res.status(200).json({
            success: true,
            data: cart
        });
    } catch (err) {
        next(err);
    }
};

// Update cart item quantity
const updateCartItem = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { menuId, quantity } = req.body;

        if (quantity === undefined || quantity < 1) {
            const err = new Error("Quantity must be at least 1");
            err.statusCode = 400;
            return next(err);
        }

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            const err = new Error("Cart not found");
            err.statusCode = 404;
            return next(err);
        }

        const itemIndex = cart.items.findIndex(item => item.menuId.toString() === menuId);

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity = quantity; 
            await calculateCartTotal(cart);
            await cart.save();

            return res.status(200).json({
                success: true,
                message: "Cart item quantity updated",
                data: cart
            });
        } else {
            const err = new Error("Item not found in cart");
            err.statusCode = 404;
            return next(err);
        }
    } catch (err) {
        next(err);
    }
};

// Remove single item from cart
const removeCartItem = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { menuId } = req.params; 

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            const err = new Error("Cart not found");
            err.statusCode = 404;
            return next(err);
        }

        // use array filter method to remove the item
        cart.items = cart.items.filter(item => item.menuId.toString() !== menuId);

        // reset restaurant id
        await calculateCartTotal(cart);
        await cart.save();

        return res.status(200).json({
            success: true,
            message: "Item removed from cart successfully",
            data: cart
        });
    } catch (err) {
        next(err);
    }
};

// 5️⃣ clear complete card
const clearCart = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            const err = new Error("Cart not found");
            err.statusCode = 404;
            return next(err);
        }

        // clear cart
        cart.items = [];
        cart.restaurantId = null;
        cart.totalAmount = 0;

        await cart.save();

        return res.status(200).json({
            success: true,
            message: "Cart cleared successfully",
            data: cart
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    addToCart,
    getCart,
    updateCartItem,
    removeCartItem,
    clearCart
};