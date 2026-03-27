const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const auth = require('../../../api/middleware/authMiddleware');

router.use(auth);

// GET /api/seller/orders
router.get('/', orderController.getOrders);

// PATCH /api/seller/orders/:id/status
router.patch('/:id/status', orderController.updateOrderStatus);

// DELETE /api/seller/orders/:id
router.delete('/:id', orderController.deleteOrder);

module.exports = router;
