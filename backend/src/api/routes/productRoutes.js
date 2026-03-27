const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', ProductController.getProducts);
router.get('/pending', ProductController.getPendingProducts);
router.patch('/:id/approve', ProductController.approveProduct);
router.patch('/:id/reject', ProductController.rejectProduct);
router.get('/:id', ProductController.getProductById);

module.exports = router;