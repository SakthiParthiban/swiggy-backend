const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    orderId: {
        type: String,
        required: true
    },

    paymentId: {
        type: String,
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    currency: {
        type: String,
        default: 'INR'
    },

    status: {
        type: String,
        enum: ['success', 'failed'],
        default: 'success'
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);