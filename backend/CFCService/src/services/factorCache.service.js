const emissionFactorRepo = require('../repositories/emissionFactor.repository');

let factorMap = {};

exports.loadFactors = async () => {
  const factors = await emissionFactorRepo.getAllFactors();

  factorMap = {};

  for (const f of factors) {
    const key = `${f.category}:${f.sub_category}`;
    factorMap[key] = parseFloat(f.value);
  }

  console.log('✅ Emission factors loaded into memory');
};

exports.getFactor = (category, subCategory) => {
  return factorMap[`${category}:${subCategory}`];
};