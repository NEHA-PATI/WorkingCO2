const airportCache = require('../services/airportCache.service');
const airportAdminService = require('../services/airportAdmin.service');

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

exports.listAirportsAdmin = async (req, res, next) => {
  try {
    const data = await airportAdminService.getAllAirportsAdmin();
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

exports.createAirport = async (req, res, next) => {
  try {
    const data = await airportAdminService.createAirport(req.body || {});
    res.status(201).json({
      success: true,
      data
    });
  } catch (error) {
    if (String(error.message || '').toLowerCase().includes('required')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    return next(error);
  }
};

exports.updateAirport = async (req, res, next) => {
  try {
    const data = await airportAdminService.updateAirport(req.params.code, req.body || {});
    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Airport not found'
      });
    }

    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    if (String(error.message || '').toLowerCase().includes('required')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    return next(error);
  }
};

exports.deleteAirport = async (req, res, next) => {
  try {
    const data = await airportAdminService.deleteAirport(req.params.code);
    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Airport not found'
      });
    }

    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    if (String(error.message || '').toLowerCase().includes('required')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    return next(error);
  }
};
