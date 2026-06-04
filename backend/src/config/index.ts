import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const config = {
  // App
  app: {
    name: 'AI Business Platform',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '5000', 10),
    apiUrl: process.env.API_URL || 'http://localhost:5000',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  },

  // Database
  database: {
    url: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/ai_platform',
    maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '20', 10),
    minConnections: parseInt(process.env.DB_MIN_CONNECTIONS || '5', 10),
    connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT || '30000', 10),
    idleTimeout: parseInt(process.env.DB_IDLE_TIMEOUT || '30000', 10),
  },

  // Redis
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB || '0', 10),
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'your_super_secret_jwt_key_min_32_chars',
    expiresIn: process.env.JWT_EXPIRE || '7d',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRE || '30d',
  },

  // Security
  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '10', 10),
    corsOrigin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '900000', 10),
    rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  },

  // Encryption
  encryption: {
    algorithm: 'aes-256-gcm',
    encryptionKey: process.env.ENCRYPTION_KEY || 'your_encryption_key_min_32_chars_long',
  },

  // Third-party APIs
  integrations: {
    canva: {
      clientId: process.env.CANVA_CLIENT_ID,
      clientSecret: process.env.CANVA_CLIENT_SECRET,
      redirectUri: `${process.env.API_URL || 'http://localhost:5000'}/api/integrations/canva/callback`,
      apiBaseUrl: 'https://api.canva.com',
    },
    shopify: {
      apiVersion: '2023-10',
      scopes: [
        'write_products',
        'read_products',
        'write_inventory',
        'read_inventory',
      ].join(','),
    },
    stripe: {
      apiVersion: '2023-10-16',
    },
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'json',
  },

  // Features
  features: {
    enableAnalytics: process.env.ENABLE_ANALYTICS !== 'false',
    enableAuditLogging: process.env.ENABLE_AUDIT_LOGGING !== 'false',
    enableForecast: process.env.ENABLE_FORECAST !== 'false',
  },
};

// Validation
function validateConfig(): void {
  const requiredKeys = [
    'JWT_SECRET',
    'ENCRYPTION_KEY',
    'DATABASE_URL',
  ];

  const missing = requiredKeys.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.warn(`⚠️ Missing environment variables: ${missing.join(', ')}`);
  }
}

validateConfig();

export default config;
