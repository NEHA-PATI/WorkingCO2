const airportCache = require('./airportCache.service');
const { calculateDistance } = require('../utils/haversine');

exports.getDistance = async (fromCode, toCode) => {
  const from = airportCache.getAirport(fromCode);
  const to = airportCache.getAirport(toCode);

  if (!from || !to) {
    throw new Error('Invalid airport code');
  }

  return calculateDistance(
    from.latitude,
    from.longitude,
    to.latitude,
    to.longitude
  );
};