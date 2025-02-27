const mongoose = require('mongoose');
var productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true,
    },
    slug:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    sold: {
        type: Number,
        default: 0,
        select:false,
    },
    images: {
        type: Array,
    },
    color : {
        type: String,
        required:true,
    },
    ratings:[
        {
            star:Number,
            postedBy:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'User',
            },
        },
    ],
    brand:{
        type:String,
        enum:["Apple","Samsung","Microsoft","Lenovo","Asus"],
        required:true
    },
},{timestamps:true});

//Export the model
module.exports = mongoose.model('Product', productSchema);