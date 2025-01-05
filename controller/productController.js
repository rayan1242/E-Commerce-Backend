const product = require('../model/productModel');
const asyncHandler = require('express-async-handler');

const createProduct = asyncHandler(async (req, res) => {
    try{
        const product = new product(req.body);
        await product.save();
        res.status(201).send('Product created successfully');
    }catch(error){
        throw new Error('Product not created');
    }
});

module.exports = {
    createProduct
}