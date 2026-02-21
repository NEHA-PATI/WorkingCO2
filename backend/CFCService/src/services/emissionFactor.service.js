const factorCache = require('./factorCache.service');

exports.getFactor = (category, subCategory) => {
  const factor = factorCache.getFactor(category, subCategory);

  if (factor === undefined || factor === null) {
    throw new Error(`Emission factor not found for ${category}:${subCategory}`);
  }

  return factor;
};