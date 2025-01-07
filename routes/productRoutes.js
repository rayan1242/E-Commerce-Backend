const express = require('express');
const router = express.Router();
const { createProduct } = require('../controller/productController');
const { getProducts } = require('../controller/productController');
const { getAllProducts } = require('../controller/productController');
const { updateProduct } = require('../controller/productController');
const { deleteProduct } = require('../controller/productController');
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');

router.post('/create', authMiddleware, isAdmin, createProduct);
router.get('/products', getAllProducts);
router.get('/product/:id', getProducts);
router.patch('/update/:id', authMiddleware, isAdmin, updateProduct);
router.delete('/delete/:id', authMiddleware, isAdmin, deleteProduct);
module.exports = router;