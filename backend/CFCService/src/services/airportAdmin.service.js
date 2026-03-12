const airportRepo = require('../repositories/airport.repository');
const airportCache = require('./airportCache.service');

const toOptionalString = (value) => {
  if (value === undefined || value === null) return undefined;
  const normalized = String(value).trim();
  return normalized || undefined;
};

const toOptionalNumber = (value) => {
  if (value === undefined || value === null || value === '') return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

exports.getAllAirportsAdmin = async () => {
  return airportRepo.getAllAirportsAdmin();
};

exports.createAirport = async (payload = {}) => {
  const code = toOptionalString(payload.code)?.toUpperCase();
  const name = toOptionalString(payload.name);
  const latitude = toOptionalNumber(payload.latitude);
  const longitude = toOptionalNumber(payload.longitude);
  const country = toOptionalString(payload.country)?.toUpperCase();

  if (!code || !name || latitude === undefined || longitude === undefined || !country) {
    throw new Error('code, name, latitude, longitude, country are required');
  }

  const created = await airportRepo.createAirport({
    code,
    name,
    latitude,
    longitude,
    country
  });

  await airportCache.loadAirports();
  return created;
};

exports.updateAirport = async (code, payload = {}) => {
  const safeCode = toOptionalString(code)?.toUpperCase();
  if (!safeCode) {
    throw new Error('code is required');
  }

  const updates = {
    name: toOptionalString(payload.name),
    latitude: toOptionalNumber(payload.latitude),
    longitude: toOptionalNumber(payload.longitude),
    country: payload.country === undefined ? undefined : toOptionalString(payload.country)?.toUpperCase()
  };

  const updated = await airportRepo.updateAirportByCode(safeCode, updates);
  if (!updated) {
    return null;
  }

  await airportCache.loadAirports();
  return updated;
};

exports.deleteAirport = async (code) => {
  const safeCode = toOptionalString(code)?.toUpperCase();
  if (!safeCode) {
    throw new Error('code is required');
  }

  const deleted = await airportRepo.deleteAirportByCode(safeCode);
  if (!deleted) {
    return null;
  }

  await airportCache.loadAirports();
  return deleted;
};
