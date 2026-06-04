import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@/utils/jwt';
import logger from '@/utils/logger';

export interface AuthRequest extends Request {
  userId?: string;
  user?: any;
}

/**
 * Authentication middleware - verify JWT token
 */
export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Missing or invalid authorization header' });
      return;
    }

    const token = authHeader.slice(7);
    const payload = verifyToken(token);

    req.userId = payload.userId;
    req.user = payload;

    next();
  } catch (error) {
    logger.warn({ error }, 'Token verification failed');
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

/**
 * Optional auth middleware - doesn't fail if no token
 */
export function optionalAuthMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      const payload = verifyToken(token);
      req.userId = payload.userId;
      req.user = payload;
    }
  } catch (error) {
    logger.debug({ error }, 'Optional token verification skipped');
  }

  next();
}

/**
 * Admin role middleware
 */
export function adminMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ error: 'Admin access required' });
    return;
  }

  next();
}
