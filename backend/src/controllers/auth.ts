import { Request, Response } from 'express';
import { AuthRequest } from '@/middleware/auth';
import { UserModel } from '@/models/user';
import { generateAccessToken, generateRefreshToken } from '@/utils/jwt';
import { validate, authSchemas } from '@/utils/validation';
import logger from '@/utils/logger';

/**
 * Register new user
 */
export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { value, error } = validate(req.body, authSchemas.register);

    if (error) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.details,
      });
      return;
    }

    // Check if user exists
    const existingUser = await UserModel.findByEmail(value.email);
    if (existingUser) {
      res.status(409).json({
        success: false,
        error: 'Email already registered',
      });
      return;
    }

    // Create user
    const user = await UserModel.create(
      value.email,
      value.name,
      value.password,
      'user'
    );

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    logger.info({ userId: user.id, email: user.email }, 'User registered');

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    logger.error({ error }, 'Registration failed');
    res.status(500).json({
      success: false,
      error: 'Registration failed',
    });
  }
}

/**
 * Login user
 */
export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { value, error } = validate(req.body, authSchemas.login);

    if (error) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.details,
      });
      return;
    }

    // Find user
    const user = await UserModel.findByEmail(value.email);
    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
      return;
    }

    // Verify password
    const isPasswordValid = await UserModel.verifyPassword(
      user.passwordHash,
      value.password
    );

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
      return;
    }

    // Update last login
    await UserModel.updateLastLogin(user.id);

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    logger.info({ userId: user.id }, 'User logged in');

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    logger.error({ error }, 'Login failed');
    res.status(500).json({
      success: false,
      error: 'Login failed',
    });
  }
}

/**
 * Get current user
 */
export async function getCurrentUser(req: AuthRequest, res: Response): Promise<void> {
  try {
    const user = await UserModel.findById(req.userId!);

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    logger.error({ error }, 'Failed to get user');
    res.status(500).json({
      success: false,
      error: 'Failed to get user',
    });
  }
}

/**
 * Logout user
 */
export function logout(req: AuthRequest, res: Response): void {
  logger.info({ userId: req.userId }, 'User logged out');
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
}
