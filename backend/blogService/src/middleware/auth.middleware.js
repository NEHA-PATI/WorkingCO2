import jwt from 'jsonwebtoken';
import { config } from '../config/env.config.js';
import { errorResponse } from '../utils/response.helper.js';

const normalizeRole = (user) => {
  const rawRole = String(
    user?.context ?? user?.app_role ?? user?.role ?? user?.role_name ?? ''
  )
    .trim()
    .toLowerCase();

  if (['admin', 'platform_admin', 'super_admin', 'superadmin'].includes(rawRole)) {
    return 'admin';
  }

  if (
    rawRole === 'organization' ||
    rawRole === 'organisation' ||
    rawRole === 'org' ||
    rawRole === 'org_admin' ||
    rawRole === 'org_member' ||
    rawRole.startsWith('org_')
  ) {
    return 'organization';
  }

  if (rawRole === 'marketplace_only' || rawRole === 'user') {
    return 'user';
  }

  return rawRole || null;
};

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

    const normalizedRole = normalizeRole(req.user);
    const normalizedAllowedRoles = allowedRoles
      .map((role) => String(role).toLowerCase())
      .map((role) => {
        if (['platform_admin', 'admin', 'super_admin', 'superadmin'].includes(role)) return 'admin';
        if (['org_admin', 'org_member', 'organization', 'organisation', 'org'].includes(role) || role.startsWith('org_')) return 'organization';
        if (role === 'marketplace_only' || role === 'user') return 'user';
        return role;
      });

    if (!normalizedAllowedRoles.includes(normalizedRole)) {
      return res.status(403).json(errorResponse('Forbidden: Insufficient permissions', 403));
    }

    next();
  };
};
