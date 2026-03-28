const express = require('express');
const router = express.Router();

const authRoutes = require('../features/auth/auth.routes');
const userRoutes = require('../features/user/user.routes');
const pledgeRoutes = require('../features/pledge/pledge.routes');
const causesRoutes = require('../features/causes/causes.routes');
const transactionRoutes = require('../features/transactions/transaction.routes');

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/pledge', pledgeRoutes);
router.use('/causes', causesRoutes);
router.use('/transactions', transactionRoutes);

module.exports = router;