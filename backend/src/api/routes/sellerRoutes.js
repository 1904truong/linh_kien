const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/SellerController'); // Changed to sellerController to match route usage
const authMiddleware = require('../middleware/authMiddleware');

// All seller routes are protected
router.use(authMiddleware);


// These are now handled by the standalone seller-dashboard module:
// - /dashboard
// - /products (all CRUD)
// We retain others for now until they are migrated.

router.get('/orders', sellerController.getOrders);
router.get('/orders/:id', sellerController.getOrderDetails);
router.patch('/orders/:id/status', sellerController.updateOrderStatus);

router.get('/inventory/low-stock', sellerController.getLowStockProducts);
router.get('/suppliers', sellerController.getSuppliers);
router.patch('/profile', sellerController.updateProfile);

module.exports = router;
