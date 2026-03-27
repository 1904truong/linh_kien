const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const auth = require('../../../api/middleware/authMiddleware');
const isAdmin = require('../../../infrastructure/auth/middleware/isAdmin');

// All routes here should be protected by auth and isAdmin check
router.get('/pending', auth, isAdmin, productController.getPendingProducts);
router.patch('/:id/approve', auth, isAdmin, productController.approveProduct);
router.patch('/:id/reject', auth, isAdmin, productController.rejectProduct);

module.exports = router;
