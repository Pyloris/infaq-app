const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const { protect } = require('../../middlewares/auth.middleware');

router.post('/login', authController.login);
router.post('/verify-otp', authController.verifyOtp);
router.post('/onboard-user', protect, authController.onboardUser);

module.exports = router;
