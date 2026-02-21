const express = require('express');
const router = express.Router();
const airportController = require('../controllers/airport.controller');

router.get('/', airportController.listAirports);

module.exports = router;
