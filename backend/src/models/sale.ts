import { Sale, SaleStatus } from '@/types';
import { query } from '@/database/connection';
import { v4 as uuidv4 } from 'uuid';

export class SaleModel {
  /**
   * Create sale record
   */
  static async create(
    userId: string,
    productId: string,
    marketplace: string,
    marketplaceOrderId: string,
    quantity: number,
    salePrice: number,
    profitMargin: number,
    externalCustomerId?: string
  ): Promise<Sale> {
    const id = uuidv4();

    const sales = await query<Sale>(
      `INSERT INTO sales
       (id, user_id, product_id, marketplace, marketplace_order_id, external_customer_id, quantity, sale_price, profit_margin, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending')
       RETURNING *`,
      [id, userId, productId, marketplace, marketplaceOrderId, externalCustomerId, quantity, salePrice, profitMargin]
    );

    return sales[0];
  }

  /**
   * Find sales by user
   */
  static async findByUserId(
    userId: string,
    status?: SaleStatus,
    limit: number = 100,
    offset: number = 0
  ): Promise<Sale[]> {
    if (status) {
      return query<Sale>(
        `SELECT * FROM sales WHERE user_id = $1 AND status = $2 ORDER BY created_at DESC LIMIT $3 OFFSET $4`,
        [userId, status, limit, offset]
      );
    }

    return query<Sale>(
      `SELECT * FROM sales WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
  }

  /**
   * Get revenue summary
   */
  static async getRevenueSummary(userId: string, daysBack: number = 30): Promise<any> {
    const summaries = await query<any>(
      `SELECT
        COUNT(*) as total_orders,
        SUM(sale_price) as total_revenue,
        SUM(profit_margin) as total_profit,
        AVG(sale_price) as avg_order_value
       FROM sales
       WHERE user_id = $1
       AND created_at >= CURRENT_TIMESTAMP - INTERVAL '1 day' * $2`,
      [userId, daysBack]
    );

    return summaries[0] || {
      total_orders: 0,
      total_revenue: 0,
      total_profit: 0,
      avg_order_value: 0,
    };
  }

  /**
   * Update sale status
   */
  static async updateStatus(id: string, status: SaleStatus): Promise<Sale | null> {
    const sales = await query<Sale>(
      `UPDATE sales SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );

    return sales[0] || null;
  }
}
