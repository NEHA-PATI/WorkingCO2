const express = require('express');
const router = express.Router();
const factorController = require('../controllers/factor.controller');

router.get('/', factorController.listFactors);
router.put('/:id', factorController.updateFactor);

module.exports = router;
