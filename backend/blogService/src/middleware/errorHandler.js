import { errorResponse } from '../utils/response.helper.js';

export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json(errorResponse(message, statusCode, err.errors));
};

export const notFoundHandler = (req, res) => {
  res.status(404).json(errorResponse('Route not found', 404));
};
