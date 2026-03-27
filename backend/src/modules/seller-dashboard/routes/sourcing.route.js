const express = require('express');
const router = express.Router();
const sourcingController = require('../controllers/sourcing.controller');
const auth = require('../../../api/middleware/authMiddleware');

router.use(auth);

// GET /api/seller/sourcing/suppliers
router.get('/suppliers', sourcingController.getSuppliers);

// POST /api/seller/sourcing/requests
router.post('/requests', sourcingController.createSupplierRequest);

module.exports = router;
