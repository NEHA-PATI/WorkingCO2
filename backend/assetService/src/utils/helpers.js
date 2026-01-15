/**
 * Helper utility functions
 */

/**
 * Format response
 */
const formatResponse = (status, message, data = null) => {
  const response = {
    status,
    message,
    timestamp: new Date().toISOString()
  };

  if (data !== null) {
    response.data = data;
  }

  return response;
};

/**
 * Paginate results
 */
const paginate = (data, page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const results = {
    data: data.slice(startIndex, endIndex),
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(data.length / limit),
      totalItems: data.length,
      itemsPerPage: limit,
      hasNextPage: endIndex < data.length,
      hasPrevPage: page > 1
    }
  };

  return results;
};

/**
 * Calculate carbon offset
 */
const calculateCarbonOffset = (assetType, data) => {
  let offset = 0;

  switch (assetType) {
    case 'ev':
      // Simplified calculation: distance * emission_factor
      if (data.distance && data.grid_emission_factor) {
        offset = data.distance * data.grid_emission_factor;
      }
      break;
    
    case 'solar':
      // Simplified calculation: energy_generated * emission_factor
      if (data.energy_generation_value && data.grid_emission_factor) {
        offset = data.energy_generation_value * data.grid_emission_factor;
      }
      break;
    
    case 'tree':
      // Average tree absorbs ~21 kg CO2 per year
      if (data.age_years) {
        offset = 21 * data.age_years;
      }
      break;
    
    default:
      offset = 0;
  }

  return offset;
};

/**
 * Generate unique identifier
 */
const generateUID = (prefix) => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 9);
  return `${prefix}_${timestamp}${randomStr}`.toUpperCase();
};

/**
 * Validate date range
 */
const isValidDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return start <= end;
};

/**
 * Convert snake_case to camelCase
 */
const snakeToCamel = (str) => {
  return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
};

/**
 * Convert camelCase to snake_case
 */
const camelToSnake = (str) => {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};

/**
 * Deep clone object
 */
const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Remove undefined/null values from object
 */
const cleanObject = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v != null)
  );
};

module.exports = {
  formatResponse,
  paginate,
  calculateCarbonOffset,
  generateUID,
  isValidDateRange,
  snakeToCamel,
  camelToSnake,
  deepClone,
  cleanObject
};
