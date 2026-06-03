const mongoose = require('mongoose');
// Cart item schema - sub schema
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

// Cart schema - main schema
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
    // connect sub schema as array
    items:[cartItemSchema],
    totalAmount:{
        type:Number,
        default:0
    }
},{timestamps:true});

module.exports = mongoose.model('Cart',cartSchema);