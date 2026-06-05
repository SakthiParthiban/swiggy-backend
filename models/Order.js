const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    menuId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Menu',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: { 
        type: Number, 
        required: true 
    }
}, { _id: false });

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    items: [orderItemSchema],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Placed', 'Preparing', 'Out For Delivery', 'Delivered', 'Cancelled'],
        default: 'Placed'
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
        default: 'Pending'
    },
    paymentId: {
        type: String, // Razorpay payment_id
        default: null
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Order', orderSchema);