import { Product, ProductStatus, DesignMetadata } from '@/types';
import { query } from '@/database/connection';
import { v4 as uuidv4 } from 'uuid';

export class ProductModel {
  /**
   * Create product
   */
  static async create(
    userId: string,
    name: string,
    category: string,
    basePrice: number,
    costOfProduction: number,
    description?: string,
    designUrl?: string,
    designMetadata?: DesignMetadata
  ): Promise<Product> {
    const id = uuidv4();

    const products = await query<Product>(
      `INSERT INTO products
       (id, user_id, name, category, base_price, current_price, cost_of_production, description, design_url, design_metadata, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'draft')
       RETURNING *`,
      [id, userId, name, category, basePrice, basePrice, costOfProduction, description, designUrl, JSON.stringify(designMetadata || {})]
    );

    return products[0];
  }

  /**
   * Find product by ID
   */
  static async findById(id: string): Promise<Product | null> {
    const products = await query<Product>(
      `SELECT * FROM products WHERE id = $1`,
      [id]
    );

    return products[0] || null;
  }

  /**
   * List user products
   */
  static async findByUserId(
    userId: string,
    status?: ProductStatus,
    limit: number = 50,
    offset: number = 0
  ): Promise<Product[]> {
    if (status) {
      return query<Product>(
        `SELECT * FROM products WHERE user_id = $1 AND status = $2 ORDER BY created_at DESC LIMIT $3 OFFSET $4`,
        [userId, status, limit, offset]
      );
    }

    return query<Product>(
      `SELECT * FROM products WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
  }

  /**
   * Update product
   */
  static async update(
    id: string,
    updates: Partial<Product>
  ): Promise<Product | null> {
    const fields: string[] = [];
    const values: any[] = [id];
    let paramCount = 2;

    if (updates.name) {
      fields.push(`name = $${paramCount++}`);
      values.push(updates.name);
    }
    if (updates.description) {
      fields.push(`description = $${paramCount++}`);
      values.push(updates.description);
    }
    if (updates.basePrice !== undefined) {
      fields.push(`base_price = $${paramCount++}`);
      values.push(updates.basePrice);
    }
    if (updates.currentPrice !== undefined) {
      fields.push(`current_price = $${paramCount++}`);
      values.push(updates.currentPrice);
    }
    if (updates.status) {
      fields.push(`status = $${paramCount++}`);
      values.push(updates.status);
    }
    if (updates.designUrl) {
      fields.push(`design_url = $${paramCount++}`);
      values.push(updates.designUrl);
    }
    if (updates.designMetadata) {
      fields.push(`design_metadata = $${paramCount++}`);
      values.push(JSON.stringify(updates.designMetadata));
    }

    if (fields.length === 0) return this.findById(id);

    fields.push(`updated_at = CURRENT_TIMESTAMP`);

    const products = await query<Product>(
      `UPDATE products SET ${fields.join(', ')} WHERE id = $1 RETURNING *`,
      values
    );

    return products[0] || null;
  }

  /**
   * Publish product
   */
  static async publish(id: string): Promise<Product | null> {
    const products = await query<Product>(
      `UPDATE products SET status = 'active', published_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
      [id]
    );

    return products[0] || null;
  }

  /**
   * Delete product
   */
  static async delete(id: string): Promise<boolean> {
    const result = await query(
      `DELETE FROM products WHERE id = $1`,
      [id]
    );

    return (result as any).rowCount > 0;
  }
}
