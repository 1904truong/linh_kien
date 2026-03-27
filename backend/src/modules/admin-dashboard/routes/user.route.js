const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const auth = require('../../../api/middleware/authMiddleware');
const isAdmin = require('../../../infrastructure/auth/middleware/isAdmin');

// All routes here should be protected by auth and isAdmin check
router.get('/', auth, isAdmin, userController.getUsers);
router.patch('/:id/status', auth, isAdmin, userController.updateUserStatus);
router.delete('/:id', auth, isAdmin, userController.deleteUser);

module.exports = router;
