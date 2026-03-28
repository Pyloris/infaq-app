const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const { protect } = require('../../middlewares/auth.middleware');

router.get('/me', protect, userController.getMe);
router.get('/dashboard', protect, userController.getDashboard);

module.exports = router;
