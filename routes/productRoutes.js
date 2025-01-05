const express = require('express');
const router = express.Router();
const { createProduct } = require('../controller/productController');
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');

router.post('/create', authMiddleware, isAdmin, createProduct);

module.exports = router;