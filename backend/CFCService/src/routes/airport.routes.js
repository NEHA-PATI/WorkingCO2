const express = require('express');
const router = express.Router();
const airportController = require('../controllers/airport.controller');

router.get('/', airportController.listAirports);
router.get('/admin', airportController.listAirportsAdmin);
router.post('/admin', airportController.createAirport);
router.put('/admin/:code', airportController.updateAirport);
router.delete('/admin/:code', airportController.deleteAirport);

module.exports = router;
