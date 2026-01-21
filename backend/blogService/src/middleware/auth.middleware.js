import jwt from 'jsonwebtoken';
import { config } from '../config/env.config.js';
import { errorResponse } from '../utils/response.helper.js';

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json(errorResponse('No token provided', 401));
    }

    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json(errorResponse('Invalid or expired token', 401));
  }
};

export const roleMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json(errorResponse('Unauthorized', 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json(errorResponse('Forbidden: Insufficient permissions', 403));
    }

    next();
  };
};
