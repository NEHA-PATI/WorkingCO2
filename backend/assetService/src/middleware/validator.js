const { body, param, query, validationResult } = require('express-validator');

/**
 * Validation result handler
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
        value: err.value
      }))
    });
  }
  next();
};

/**
 * EV Validation Rules
 */
const validateEVCreate = [
  body('U_ID')
    .notEmpty().withMessage('User ID is required')
    .isString().withMessage('User ID must be a string'),
  
  body('Manufacturers')
    .notEmpty().withMessage('Manufacturer is required')
    .isString().withMessage('Manufacturer must be a string')
    .isLength({ max: 150 }).withMessage('Manufacturer name too long'),
  
  body('Model')
    .notEmpty().withMessage('Model is required')
    .isString().withMessage('Model must be a string')
    .isLength({ max: 150 }).withMessage('Model name too long'),
  
  body('Purchase_Year')
    .notEmpty().withMessage('Purchase year is required')
    .isInt({ min: 2000, max: 2030 }).withMessage('Purchase year must be between 2000 and 2030'),
  
  body('Energy_Consumed')
    .optional()
    .isFloat({ min: 0 }).withMessage('Energy consumed must be a positive number'),
  
  body('Range')
    .notEmpty().withMessage('Range is required')
    .isInt({ min: 1 }).withMessage('Range must be a positive integer'),
  
  body('Grid_Emission_Factor')
    .optional()
    .isFloat({ min: 0 }).withMessage('Grid emission factor must be a positive number'),
  
  body('Primary_Charging_Type')
    .optional()
    .isIn(['level1', 'level2', 'dcfast', 'tesla'])
    .withMessage('Invalid charging type'),
  
  handleValidationErrors
];

const validateEVUpdate = [
  param('ev_id')
    .isInt({ min: 1 }).withMessage('Invalid EV ID'),
  
  body('Manufacturers')
    .optional()
    .isString().withMessage('Manufacturer must be a string')
    .isLength({ max: 150 }).withMessage('Manufacturer name too long'),
  
  body('Model')
    .optional()
    .isString().withMessage('Model must be a string')
    .isLength({ max: 150 }).withMessage('Model name too long'),
  
  body('Purchase_Year')
    .optional()
    .isInt({ min: 2000, max: 2030 }).withMessage('Purchase year must be between 2000 and 2030'),
  
  body('Range')
    .optional()
    .isInt({ min: 1 }).withMessage('Range must be a positive integer'),
  
  handleValidationErrors
];

/**
 * Solar Panel Validation Rules
 */
const validateSolarCreate = [
  body('U_ID')
    .notEmpty().withMessage('User ID is required')
    .isString().withMessage('User ID must be a string'),
  
  body('Installed_Capacity')
    .notEmpty().withMessage('Installed capacity is required')
    .isFloat({ min: 0.1 }).withMessage('Installed capacity must be greater than 0'),
  
  body('Installation_Date')
    .notEmpty().withMessage('Installation date is required')
    .isDate().withMessage('Invalid installation date format'),
  
  body('Energy_Generation_Value')
    .optional()
    .isFloat({ min: 0 }).withMessage('Energy generation value must be positive'),
  
  body('Grid_Emission_Factor')
    .optional()
    .isFloat({ min: 0 }).withMessage('Grid emission factor must be positive'),
  
  body('Inverter_Type')
    .optional()
    .isIn(['string', 'microinverter', 'hybrid', 'central'])
    .withMessage('Invalid inverter type'),
  
  handleValidationErrors
];

const validateSolarUpdate = [
  param('suid')
    .isInt({ min: 1 }).withMessage('Invalid Solar Panel ID'),
  
  body('Installed_Capacity')
    .optional()
    .isFloat({ min: 0.1 }).withMessage('Installed capacity must be greater than 0'),
  
  body('Installation_Date')
    .optional()
    .isDate().withMessage('Invalid installation date format'),
  
  body('Energy_Generation_Value')
    .optional()
    .isFloat({ min: 0 }).withMessage('Energy generation value must be positive'),
  
  handleValidationErrors
];

/**
 * Tree Validation Rules
 */
const validateTreeCreate = [
  body('UID')
    .notEmpty().withMessage('User ID is required')
    .isString().withMessage('User ID must be a string'),
  
  body('TreeName')
    .notEmpty().withMessage('Tree name is required')
    .isString().withMessage('Tree name must be a string')
    .isLength({ max: 150 }).withMessage('Tree name too long'),
  
  body('BotanicalName')
    .optional()
    .isString().withMessage('Botanical name must be a string')
    .isLength({ max: 150 }).withMessage('Botanical name too long'),
  
  body('PlantingDate')
    .notEmpty().withMessage('Planting date is required')
    .isDate().withMessage('Invalid planting date format'),
  
  body('Height')
    .notEmpty().withMessage('Height is required')
    .isFloat({ min: 0.1 }).withMessage('Height must be greater than 0'),
  
  body('DBH')
    .optional()
    .isFloat({ min: 0 }).withMessage('DBH must be a positive number'),
  
  body('Location')
    .optional()
    .isString().withMessage('Location must be a string'),
  
  body('imageIds')
    .optional()
    .isArray({ max: 5 }).withMessage('Maximum 5 images allowed'),
  
  handleValidationErrors
];

const validateTreeUpdate = [
  param('tid')
    .isInt({ min: 1 }).withMessage('Invalid Tree ID'),
  
  body('TreeName')
    .optional()
    .isString().withMessage('Tree name must be a string')
    .isLength({ max: 150 }).withMessage('Tree name too long'),
  
  body('Height')
    .optional()
    .isFloat({ min: 0.1 }).withMessage('Height must be greater than 0'),
  
  handleValidationErrors
];

/**
 * Transaction Validation Rules
 */
const validateTransactionCreate = [
  body('ev_id')
    .notEmpty().withMessage('EV ID is required')
    .isInt({ min: 1 }).withMessage('Invalid EV ID'),
  
  body('active_distance')
    .notEmpty().withMessage('Active distance is required')
    .isFloat({ min: 0.1 }).withMessage('Active distance must be greater than 0'),
  
  handleValidationErrors
];

/**
 * Status Validation Rules
 */
const validateStatusUpdate = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['pending', 'approved', 'rejected'])
    .withMessage('Status must be pending, approved, or rejected'),
  
  body('changed_by')
    .optional()
    .isString().withMessage('Changed by must be a string'),
  
  body('reason')
    .optional()
    .isString().withMessage('Reason must be a string')
    .isLength({ max: 500 }).withMessage('Reason too long'),
  
  handleValidationErrors
];

/**
 * User ID Validation
 */
const validateUserId = [
  param('userId')
    .notEmpty().withMessage('User ID is required')
    .isString().withMessage('User ID must be a string')
    .matches(/^[A-Za-z0-9_-]+$/).withMessage('Invalid User ID format'),
  
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateEVCreate,
  validateEVUpdate,
  validateSolarCreate,
  validateSolarUpdate,
  validateTreeCreate,
  validateTreeUpdate,
  validateTransactionCreate,
  validateStatusUpdate,
  validateUserId
};
