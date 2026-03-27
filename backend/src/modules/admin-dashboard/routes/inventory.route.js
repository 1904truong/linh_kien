const express = require('express');
const router = express.Router();
const inventoryController = require('../../../api/controllers/InventoryController');
const auth = require('../../../api/middleware/authMiddleware');
const isAdmin = require('../../../infrastructure/auth/middleware/isAdmin');

// All routes here should be protected by auth and isAdmin check
router.get('/status', auth, isAdmin, inventoryController.getStatus);
router.put('/:id', auth, isAdmin, inventoryController.updateInventory);

module.exports = router;
