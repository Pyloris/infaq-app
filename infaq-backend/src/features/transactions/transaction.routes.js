const express = require('express');
const router = express.Router();
const transactionController = require('./transaction.controller');
const { protect } = require('../../middlewares/auth.middleware');

router.get('/me', protect, transactionController.getMyTransactions);
router.get('/all', transactionController.getAllTransactions);

module.exports = router;
