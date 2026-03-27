const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const auth = require('../../../api/middleware/authMiddleware');

// GET /api/seller/dashboard
router.get('/', auth, dashboardController.getDashboardData);

module.exports = router;
