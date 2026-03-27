const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

const auth = require('../middleware/authMiddleware');

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);
router.post('/kyc/submit', auth, AuthController.submitKYC);

module.exports = router;
