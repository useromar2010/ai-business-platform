import { SaleModel } from '@/models/sale';
import { ProductModel } from '@/models/product';
import logger from '@/utils/logger';

/**
 * Service for revenue tracking and analytics
 */
export class RevenueService {
  /**
   * Get revenue dashboard data
   */
  static async getDashboard(userId: string, period: 'today' | 'week' | 'month' | 'year' = 'month') {
    try {
      const daysMap = {
        today: 1,
        week: 7,
        month: 30,
        year: 365,
      };

      const summary = await SaleModel.getRevenueSummary(userId, daysMap[period]);

      return {
        totalRevenue: parseFloat(summary.total_revenue || 0),
        totalProfit: parseFloat(summary.total_profit || 0),
        totalOrders: parseInt(summary.total_orders || 0),
        avgOrderValue: parseFloat(summary.avg_order_value || 0),
        period,
        timestamp: new Date(),
      };
    } catch (error) {
      logger.error({ error, userId }, 'Failed to get revenue dashboard');
      throw error;
    }
  }

  /**
   * Get sales history
   */
  static async getSalesHistory(
    userId: string,
    limit: number = 100,
    offset: number = 0
  ) {
    try {
      const sales = await SaleModel.findByUserId(userId, undefined, limit, offset);
      return sales;
    } catch (error) {
      logger.error({ error, userId }, 'Failed to get sales history');
      throw error;
    }
  }

  /**
   * Generate revenue forecast
   */
  static generateForecast(historicalData: any[]): any {
    try {
      if (historicalData.length === 0) {
        return {
          bestCase: { revenue: 0, profit: 0, ordersEstimate: 0, confidence: 0 },
          expectedCase: { revenue: 0, profit: 0, ordersEstimate: 0, confidence: 0 },
          worstCase: { revenue: 0, profit: 0, ordersEstimate: 0, confidence: 0 },
        };
      }

      const avgRevenue = historicalData.reduce((sum: number, sale: any) => sum + sale.salePrice, 0) / historicalData.length;
      const avgOrders = historicalData.length / 30; // Assuming 30 days of data

      return {
        bestCase: {
          revenue: avgRevenue * avgOrders * 1.5 * 30,
          profit: avgRevenue * avgOrders * 1.5 * 30 * 0.4,
          ordersEstimate: Math.ceil(avgOrders * 1.5 * 30),
          confidence: 0.6,
        },
        expectedCase: {
          revenue: avgRevenue * avgOrders * 30,
          profit: avgRevenue * avgOrders * 30 * 0.4,
          ordersEstimate: Math.ceil(avgOrders * 30),
          confidence: 0.85,
        },
        worstCase: {
          revenue: avgRevenue * avgOrders * 0.7 * 30,
          profit: avgRevenue * avgOrders * 0.7 * 30 * 0.4,
          ordersEstimate: Math.ceil(avgOrders * 0.7 * 30),
          confidence: 0.6,
        },
      };
    } catch (error) {
      logger.error({ error }, 'Failed to generate forecast');
      throw error;
    }
  }

  /**
   * Get product performance ranking
   */
  static async getProductPerformance(userId: string) {
    try {
      const products = await ProductModel.findByUserId(userId, 'active', 1000, 0);
      const sales = await SaleModel.findByUserId(userId, undefined, 1000, 0);

      const performanceMap = new Map();

      products.forEach((product) => {
        performanceMap.set(product.id, {
          product,
          sales: 0,
          revenue: 0,
          profit: 0,
        });
      });

      sales.forEach((sale) => {
        const perf = performanceMap.get(sale.productId);
        if (perf) {
          perf.sales += 1;
          perf.revenue += sale.salePrice;
          perf.profit += sale.profitMargin;
        }
      });

      return Array.from(performanceMap.values()).sort(
        (a, b) => b.revenue - a.revenue
      );
    } catch (error) {
      logger.error({ error, userId }, 'Failed to get product performance');
      throw error;
    }
  }
}

export default RevenueService;
