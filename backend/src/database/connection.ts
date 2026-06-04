import { Pool, PoolClient } from 'pg';
import config from '@/config';
import logger from '@/utils/logger';

let pool: Pool;

/**
 * Initialize database connection pool
 */
export async function initializeDatabase(): Promise<void> {
  try {
    pool = new Pool({
      connectionString: config.database.url,
      max: config.database.maxConnections,
      min: config.database.minConnections,
      idleTimeoutMillis: config.database.idleTimeout,
      connectionTimeoutMillis: config.database.connectionTimeout,
    });

    pool.on('error', (err) => {
      logger.error({ err }, 'Unexpected error on idle client');
    });

    // Test connection
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();

    logger.info('Database connection pool initialized successfully');
  } catch (error) {
    logger.error({ error }, 'Failed to initialize database');
    throw error;
  }
}

/**
 * Get database client from pool
 */
export async function getClient(): Promise<PoolClient> {
  return pool.connect();
}

/**
 * Execute query
 */
export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    if (duration > 100) {
      logger.warn({ query: text, duration }, 'Slow query detected');
    }
    return result.rows;
  } catch (error) {
    logger.error({ error, query: text }, 'Database query error');
    throw error;
  }
}

/**
 * Close database connection pool
 */
export async function closeDatabase(): Promise<void> {
  if (pool) {
    await pool.end();
    logger.info('Database connection pool closed');
  }
}
