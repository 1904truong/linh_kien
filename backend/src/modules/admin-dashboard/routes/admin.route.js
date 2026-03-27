const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const auth = require('../../../api/middleware/authMiddleware');
const isAdmin = require('../../../infrastructure/auth/middleware/isAdmin');

// All routes here should be protected by auth and isAdmin check
// For now, using basic auth
router.get('/stats', auth, isAdmin, adminController.getDashboardStats);
router.get('/recent-kyc', auth, isAdmin, adminController.getRecentKYC);

module.exports = router;
