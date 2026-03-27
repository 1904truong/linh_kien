const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/SupplierController');

router.get('/', supplierController.getSuppliers);
router.post('/', supplierController.createSupplier);
router.post('/request', supplierController.requestSupplier);
router.patch('/:id/approve', supplierController.approveSupplier);
router.patch('/:id/reject', supplierController.rejectSupplier);
router.patch('/:id', supplierController.updateSupplier);
router.delete('/:id', supplierController.deleteSupplier);

module.exports = router;
