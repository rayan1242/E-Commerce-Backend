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
       //Filtering
        const filterObj = {...req.query};
        const excludeFields = ['page','sort','limit','fields'];
        excludeFields.forEach(el => delete filterObj[el]);
        let queryStr = JSON.stringify(filterObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        let query = products.find(JSON.parse(queryStr));
        //Sorting
        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        }
        else{
            query = query.sort('-createdAt');
        }

        //Field limiting
        if(req.query.fields){
        const fields = req.query.fields.split(',').join(' ');
        query = query.select(fields);
        }
        else{
            query = query.select('-__v');
        }

        //Pagination
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 100;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);
        if(req.query.page){
            const numProducts = await products.countDocuments();
            if(skip >= numProducts) throw new Error('This page does not exist');
        }
        query = query.skip(skip).limit(limit);
        if(req.query.page){
            const numProducts = await products.countDocuments();
            if(skip >= numProducts) throw new Error('This page does not exist');
        }
        
        const products = await query;
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