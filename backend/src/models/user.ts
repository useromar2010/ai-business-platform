import { User, UserRole } from '@/types';
import { query } from '@/database/connection';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export class UserModel {
  /**
   * Create new user
   */
  static async create(
    email: string,
    name: string,
    password: string,
    role: UserRole = 'user'
  ): Promise<User> {
    const id = uuidv4();
    const passwordHash = await bcrypt.hash(password, 10);

    const users = await query<User>(
      `INSERT INTO users (id, email, name, password_hash, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, name, is_email_verified, is_active, role, created_at, updated_at, last_login_at`,
      [id, email.toLowerCase(), name, passwordHash, role]
    );

    return users[0];
  }

  /**
   * Find user by email
   */
  static async findByEmail(email: string): Promise<User | null> {
    const users = await query<User>(
      `SELECT id, email, name, password_hash, is_email_verified, is_active, role, created_at, updated_at, last_login_at
       FROM users WHERE email = $1`,
      [email.toLowerCase()]
    );

    return users[0] || null;
  }

  /**
   * Find user by ID
   */
  static async findById(id: string): Promise<User | null> {
    const users = await query<User>(
      `SELECT id, email, name, is_email_verified, is_active, role, created_at, updated_at, last_login_at
       FROM users WHERE id = $1`,
      [id]
    );

    return users[0] || null;
  }

  /**
   * Verify password
   */
  static async verifyPassword(
    passwordHash: string,
    password: string
  ): Promise<boolean> {
    return bcrypt.compare(password, passwordHash);
  }

  /**
   * Update last login
   */
  static async updateLastLogin(userId: string): Promise<void> {
    await query(
      `UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1`,
      [userId]
    );
  }

  /**
   * Verify email
   */
  static async verifyEmail(userId: string): Promise<void> {
    await query(
      `UPDATE users SET is_email_verified = true, updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
      [userId]
    );
  }

  /**
   * Update user
   */
  static async update(
    userId: string,
    updates: Partial<User>
  ): Promise<User | null> {
    const fields: string[] = [];
    const values: any[] = [userId];
    let paramCount = 2;

    if (updates.name) {
      fields.push(`name = $${paramCount++}`);
      values.push(updates.name);
    }
    if (updates.email) {
      fields.push(`email = $${paramCount++}`);
      values.push(updates.email.toLowerCase());
    }

    if (fields.length === 0) return this.findById(userId);

    fields.push(`updated_at = CURRENT_TIMESTAMP`);

    const users = await query<User>(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $1 RETURNING *`,
      values
    );

    return users[0] || null;
  }
}
