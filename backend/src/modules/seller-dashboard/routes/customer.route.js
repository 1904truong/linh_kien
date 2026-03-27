const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer.controller');
const auth = require('../../../api/middleware/authMiddleware');

router.use(auth);

router.get('/stats', customerController.getCustomerStats);
router.get('/', customerController.getCustomers);
router.post('/', customerController.createCustomer);

module.exports = router;
