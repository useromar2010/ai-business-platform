import axios, { AxiosInstance } from 'axios';
import logger from '@/utils/logger';

/**
 * Stripe API client
 * Handles payment processing and account verification
 */
class StripeClient {
  private client: AxiosInstance;
  private secretKey: string;

  constructor(secretKey: string) {
    this.secretKey = secretKey;

    this.client = axios.create({
      baseURL: 'https://api.stripe.com/v1',
      auth: {
        username: secretKey,
        password: '',
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  }

  /**
   * Create product
   */
  async createProduct(name: string, description?: string): Promise<any> {
    try {
      const response = await this.client.post('/products', {
        name,
        description,
        type: 'service',
      });

      logger.info({ productId: response.data.id }, 'Product created in Stripe');
      return response.data;
    } catch (error) {
      logger.error({ error }, 'Failed to create Stripe product');
      throw error;
    }
  }

  /**
   * Create price
   */
  async createPrice(productId: string, amount: number, currency: string = 'usd'): Promise<any> {
    try {
      const response = await this.client.post('/prices', {
        product: productId,
        unit_amount: Math.round(amount * 100),
        currency,
      });

      logger.info({ priceId: response.data.id }, 'Price created in Stripe');
      return response.data;
    } catch (error) {
      logger.error({ error }, 'Failed to create Stripe price');
      throw error;
    }
  }

  /**
   * Get account info
   */
  async getAccount(): Promise<any> {
    try {
      const response = await this.client.get('/account');
      return response.data;
    } catch (error) {
      logger.error({ error }, 'Failed to get Stripe account info');
      throw error;
    }
  }

  /**
   * List products
   */
  async listProducts(limit: number = 100): Promise<any[]> {
    try {
      const response = await this.client.get('/products', {
        params: { limit },
      });

      return response.data.data || [];
    } catch (error) {
      logger.error({ error }, 'Failed to list Stripe products');
      throw error;
    }
  }
}

export default StripeClient;
