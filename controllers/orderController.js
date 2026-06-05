const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Menu = require('../models/Menu');

// 1. Create order from cart
const createOrder = async (req, res, next) => {
    try {
        const userId = req.user.id;

        // get user cart
        const cart = await Cart.findOne({ userId });
        if (!cart || cart.items.length === 0) {
            const err = new Error("Cart is empty");
            err.statusCode = 400;
            return next(err);
        }

        // snapshot price logic
        const orderItems = [];
        for (const item of cart.items) {
            const menuItem = await Menu.findById(item.menuId);
            if (!menuItem) {
                const err = new Error("Menu item not found");
                err.statusCode = 404;
                return next(err);
            }
            orderItems.push({
                menuId: item.menuId,
                quantity: item.quantity,
                price: menuItem.price
            });
        }

        // create order doc
        const newOrder = await Order.create({
            userId,
            restaurantId: cart.restaurantId,
            items: orderItems,
            totalAmount: cart.totalAmount
        });

        // clear user cart
        cart.items = [];
        cart.restaurantId = null;
        cart.totalAmount = 0;
        await cart.save();

        return res.status(201).json({ success: true, data: newOrder });
    } catch (err) {
        next(err);
    }
};

// 2. Get logged in user orders
const getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (err) {
        next(err);
    }
};

// 3. Get single order by id
const getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('restaurantId', 'name location')
            .populate('items.menuId', 'name image');

        if (!order) {
            const err = new Error("Order not found");
            err.statusCode = 404;
            return next(err);
        }
        return res.status(200).json({ success: true, data: order });
    } catch (err) {
        next(err);
    }
};

// 4. Cancel order (user action)
const cancelOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            const err = new Error("Order not found");
            err.statusCode = 404;
            return next(err);
        }

        // business rule: check status before cancelling
        if (order.status !== 'Placed') {
            const err = new Error("Cannot cancel order now");
            err.statusCode = 400;
            return next(err);
        }

        order.status = 'Cancelled';
        await order.save();
        return res.status(200).json({ success: true, message: "Order cancelled", data: order });
    } catch (err) {
        next(err);
    }
};

// 5. Update status (admin/restaurant action)
const updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!order) {
            const err = new Error("Order not found");
            err.statusCode = 404;
            return next(err);
        }
        return res.status(200).json({ success: true, data: order });
    } catch (err) {
        next(err);
    }
};

// 6. Get all orders (admin action)
const getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        return res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrder,
    updateOrderStatus,
    getAllOrders
};