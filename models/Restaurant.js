const mongoose = require('mongoose');
const restaurantSchema = new mongoose.Schema({
 name:{
    type:String,
    required:true
 },
rating:{
    type:Number,
    required:true
},
location:{
    type:String,
    required:true
},
cuisine:{
    type:String,
    required:true
},
isOpen:{
    type:Boolean,
    default:true
},
image:{
    type:String,
    default: ''
}
},{timestamps:true});
module.exports = mongoose.model("Restaurant",restaurantSchema);


