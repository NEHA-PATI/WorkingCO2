const calculationService = require('../services/calculation.service');

exports.calculate = async (req, res, next) => {
  try {
    const result = await calculationService.calculate(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};