const express = require('express');
const router = express.Router();
const kycController = require('../controllers/kyc.controller');
const auth = require('../../../api/middleware/authMiddleware');
const isAdmin = require('../../../infrastructure/auth/middleware/isAdmin');

// All routes here should be protected by auth and isAdmin check
router.get('/pending', auth, isAdmin, kycController.getKYCRequests);
router.patch('/:id/approve', auth, isAdmin, kycController.approveKYC);
router.patch('/:id/reject', auth, isAdmin, kycController.rejectKYC);
router.get('/reports/stats', auth, isAdmin, kycController.getReportStats);

module.exports = router;
