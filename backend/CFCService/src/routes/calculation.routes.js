const express = require('express');
const router = express.Router();
const calculationController = require('../controllers/calculation.controller');
const validateCalculation = require('../middlewares/validateCalculation');

router.post('/', validateCalculation, calculationController.calculate);
router.post('/', calculationController.calculate);

module.exports = router;