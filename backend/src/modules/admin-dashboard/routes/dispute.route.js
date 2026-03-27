const express = require('express');
const router = express.Router();
const DisputeController = require('../controllers/DisputeController');
const auth = require('../../../api/middleware/authMiddleware');
const isAdmin = require('../../../infrastructure/auth/middleware/isAdmin');

// All routes are protected and admin-only
router.use(auth, isAdmin);

router.get('/', DisputeController.getDisputes);
router.get('/:id', DisputeController.getDisputeById);
router.patch('/:id/resolve', DisputeController.resolveDispute);

module.exports = router;
