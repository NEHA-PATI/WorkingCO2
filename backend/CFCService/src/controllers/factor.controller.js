const factorAdminService = require('../services/factorAdmin.service');

exports.listFactors = async (req, res, next) => {
  try {
    const data = await factorAdminService.getAllFactorsAdmin();
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

exports.updateFactor = async (req, res, next) => {
  try {
    const updated = await factorAdminService.updateFactorById(req.params.id, req.body || {});
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Emission factor not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: updated
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
