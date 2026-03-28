const express = require('express');
const router = express.Router();
const causesController = require('./causes.controller');
const { protect } = require('../../middlewares/auth.middleware');

router.get('/', protect, causesController.getCauses);

module.exports = router;
