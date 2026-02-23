exports.validateCalculationInput = (data) => {
  if (!data.calculation_month) {
    throw new Error('calculation_month is required');
  }

  if (!data.housing) {
    throw new Error('housing data is required');
  }

  return true;
};