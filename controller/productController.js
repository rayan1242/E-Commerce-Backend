const product = require('../model/productModel');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const createProduct = asyncHandler(async (req, res) => {
    try{
        if(req.body.title){
            req.body.slug = slugify(req.body.title);
        }
        const product = new product(req.body);
        await product.save();
        res.status(201).send('Product created successfully');
    }catch(error){
        throw new Error('Product not created');
    }
});

const getProducts = asyncHandler(async (req, res) => {
    try{
        const products = await product.find({id:req.params.id});
        res.status(200).send(products);
    }catch(error){
        throw new Error('Products not found');
    }
});

const getAllProducts = asyncHandler(async (req, res) => {
    try{
        const products = await product.find({});
        res.status(200).send(products);
    }catch(error){
        throw new Error('Products not found');
    }
});

const updateProduct = asyncHandler(async (req, res) => {
    try{
        const id=req.params.id;
        if(req.body.title){
            req.body.slug = slugify(req.body.title);
        }
        const product = await product.findByIdAndUpdate(id,request,body,{new:true});
        await product.save();
        res.status(200).send('Product updated successfully');
    }catch(error){
        throw new Error('Product not updated');
    }
});

const deleteProduct = asyncHandler(async (req, res) => {
    try{
        const product = await product.findByIdAndDelete(req.params.id);
        res.status(200).send('Product deleted successfully');
    }catch(error){
        throw new Error('Product not deleted');
    }
});

module.exports = {
    createProduct,
    getProducts,
    getAllProducts,
    updateProduct,
    deleteProduct,
}