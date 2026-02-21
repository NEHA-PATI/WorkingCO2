const airportCache = require('../services/airportCache.service');

exports.listAirports = async (req, res, next) => {
  try {
    const q = (req.query.q || '').toString().trim().toUpperCase();
    const limit = Math.min(Math.max(Number(req.query.limit) || 300, 1), 1000);

    let codes = airportCache.getAirportCodes();
    if (q) {
      codes = codes.filter((code) => code.includes(q));
    }

    codes.sort();

    res.status(200).json({
      success: true,
      data: codes.slice(0, limit),
      total: codes.length
    });
  } catch (error) {
    next(error);
  }
};
