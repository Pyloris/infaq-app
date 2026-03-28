const express = require('express');
const router = express.Router();
const pledgeController = require('./pledge.controller');
const { protect } = require('../../middlewares/auth.middleware');

router.post('/', protect, pledgeController.createPledge);
router.get('/', protect, pledgeController.getPledge);

// Webhook for payment gateway (no user auth needed, but should have secret verification in production)
router.post('/webhooks', pledgeController.handleWebhook);

module.exports = router;
