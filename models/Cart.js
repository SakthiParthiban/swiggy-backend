const mongoose = require('mongoose');
// sub schema
const cartItemSchema = new mongoose.Schema({
    menuId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Menu',
        required:true
    },

    quantity:{
        type:Number,
        required:true,
        min:[1,"Item quantity can not be less than 1"],
        default:1
    }
},{_id:false});

// main schema
const cartSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
        unique:true
    },
    
    restaurantId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Restaurant',
        default:null
    },

    items:[cartItemSchema],
    totalAmount:{
        type:Number,
        default:0
    }
},{timestamps:true});

module.exports = mongoose.model('Cart',cartSchema);