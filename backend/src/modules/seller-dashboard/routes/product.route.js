const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const auth = require('../../../api/middleware/authMiddleware');

// Apply auth middleware to all routes in this file
router.use(auth);

// GET /api/seller/products
router.get('/', productController.getProducts);

// POST /api/seller/products
router.post('/', productController.createProduct);

// PUT /api/seller/products/:id
router.put('/:id', productController.updateProduct);

// DELETE /api/seller/products/:id
router.delete('/:id', productController.deleteProduct);

// PATCH /api/seller/products/:id/stock
router.patch('/:id/stock', productController.updateStock);

module.exports = router;
