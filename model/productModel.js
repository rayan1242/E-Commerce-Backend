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
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
    },
    quantity: Number,
    sold: {
        type: Number,
        default: 0,
    },
    images: {
        type: Array,
    },
    color : {
        type: String,
        enum:["black","brown","red"]
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
    },
},{timestamps:true});

//Export the model
module.exports = mongoose.model('Product', productSchema);