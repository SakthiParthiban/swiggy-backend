const mongoose = require('mongoose');
const menuSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true,
        min:0
    },

    image: {
        type: String,
        default: ''
    },

    category: {
        type: String,
        required: true
    },

    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },

    isAvailable: {
        type: Boolean,
        default: true
    },
},
{
        timestamps: true
    });

module.exports = mongoose.model('Menu',menuSchema);