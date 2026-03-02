const express = require('express');
const router = express.Router();

router.use('/health', require('./health.routes'));
router.use('/calculate', require('./calculation.routes'));
router.use('/airports', require('./airport.routes'));
router.use('/factors', require('./factor.routes'));

module.exports = router;
