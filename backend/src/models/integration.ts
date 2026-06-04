import { Integration, IntegrationType } from '@/types';
import { query } from '@/database/connection';
import { v4 as uuidv4 } from 'uuid';

export class IntegrationModel {
  /**
   * Create integration
   */
  static async create(
    userId: string,
    type: IntegrationType,
    encryptedCredentials: string,
    metadata: Record<string, any> = {}
  ): Promise<Integration> {
    const id = uuidv4();

    const integrations = await query<Integration>(
      `INSERT INTO integrations (id, user_id, type, encrypted_credentials, metadata, is_connected)
       VALUES ($1, $2, $3, $4, $5, true)
       RETURNING *`,
      [id, userId, type, encryptedCredentials, JSON.stringify(metadata)]
    );

    return integrations[0];
  }

  /**
   * Find integration by ID
   */
  static async findById(id: string): Promise<Integration | null> {
    const integrations = await query<Integration>(
      `SELECT * FROM integrations WHERE id = $1`,
      [id]
    );

    return integrations[0] || null;
  }

  /**
   * Find user integration by type
   */
  static async findByUserAndType(
    userId: string,
    type: IntegrationType
  ): Promise<Integration | null> {
    const integrations = await query<Integration>(
      `SELECT * FROM integrations WHERE user_id = $1 AND type = $2`,
      [userId, type]
    );

    return integrations[0] || null;
  }

  /**
   * List user integrations
   */
  static async findByUserId(userId: string): Promise<Integration[]> {
    return query<Integration>(
      `SELECT * FROM integrations WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );
  }

  /**
   * Update integration
   */
  static async update(
    id: string,
    updates: Partial<Integration>
  ): Promise<Integration | null> {
    const fields: string[] = [];
    const values: any[] = [id];
    let paramCount = 2;

    if (updates.isConnected !== undefined) {
      fields.push(`is_connected = $${paramCount++}`);
      values.push(updates.isConnected);
    }
    if (updates.accessToken) {
      fields.push(`access_token = $${paramCount++}`);
      values.push(updates.accessToken);
    }
    if (updates.refreshToken) {
      fields.push(`refresh_token = $${paramCount++}`);
      values.push(updates.refreshToken);
    }
    if (updates.expiresAt) {
      fields.push(`expires_at = $${paramCount++}`);
      values.push(updates.expiresAt);
    }
    if (updates.metadata) {
      fields.push(`metadata = $${paramCount++}`);
      values.push(JSON.stringify(updates.metadata));
    }

    if (fields.length === 0) return this.findById(id);

    fields.push(`updated_at = CURRENT_TIMESTAMP`);

    const integrations = await query<Integration>(
      `UPDATE integrations SET ${fields.join(', ')} WHERE id = $1 RETURNING *`,
      values
    );

    return integrations[0] || null;
  }

  /**
   * Delete integration
   */
  static async delete(id: string): Promise<boolean> {
    const result = await query(
      `DELETE FROM integrations WHERE id = $1`,
      [id]
    );

    return (result as any).rowCount > 0;
  }
}
