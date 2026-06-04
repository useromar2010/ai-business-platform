import { Request, Response, NextFunction } from 'express';
import logger from '@/utils/logger';

/**
 * Error handling middleware
 */
export function errorHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  logger.error({ error, path: req.path }, 'Error occurred');

  // Validation errors
  if (error.isJoi) {
    res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: error.details,
    });
    return;
  }

  // Database errors
  if (error.code === '23505') {
    res.status(409).json({
      success: false,
      error: 'Resource already exists',
    });
    return;
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    res.status(401).json({
      success: false,
      error: 'Invalid token',
    });
    return;
  }

  // Default error
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Internal server error',
  });
}

/**
 * 404 handler
 */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.path,
  });
}
