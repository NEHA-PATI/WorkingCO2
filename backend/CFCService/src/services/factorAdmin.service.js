const emissionFactorRepo = require('../repositories/emissionFactor.repository');
const factorCache = require('./factorCache.service');

const toOptionalString = (value) => {
  if (value === undefined || value === null) return undefined;
  return String(value).trim();
};

const toOptionalInteger = (value) => {
  if (value === undefined || value === null || value === '') return undefined;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return undefined;
  return Math.trunc(parsed);
};

const toOptionalDecimal = (value) => {
  if (value === undefined || value === null || value === '') return undefined;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return undefined;
  return parsed;
};

exports.getAllFactorsAdmin = async () => {
  return emissionFactorRepo.getAllFactorsAdmin();
};

exports.updateFactorById = async (id, payload = {}) => {
  const safeId = toOptionalString(id);
  if (!safeId) {
    throw new Error('id is required');
  }

  const updates = {
    category: toOptionalString(payload.category),
    sub_category: toOptionalString(payload.sub_category),
    unit: toOptionalString(payload.unit),
    value: toOptionalDecimal(payload.value),
    region: toOptionalString(payload.region),
    year: toOptionalInteger(payload.year),
    source: toOptionalString(payload.source),
    version: toOptionalString(payload.version)
  };

  const updated = await emissionFactorRepo.updateFactorById(safeId, updates);
  if (!updated) {
    return null;
  }

  await factorCache.loadFactors();
  return updated;
};
