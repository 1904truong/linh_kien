const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const authMiddleware = require('../../../api/middleware/authMiddleware');

router.get('/', authMiddleware, reportController.getReports);

module.exports = router;
