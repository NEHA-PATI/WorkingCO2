const airportRepo = require('../repositories/airport.repository');

let airportMap = {};

exports.loadAirports = async () => {
  const airports = await airportRepo.getAllAirports();
  airportMap = {};

  for (const a of airports) {
    airportMap[a.code] = {
      latitude: parseFloat(a.latitude),
      longitude: parseFloat(a.longitude)
    };
  }

  console.log('✅ Airports loaded into memory');
};

exports.getAirport = (code) => {
  return airportMap[code];
};