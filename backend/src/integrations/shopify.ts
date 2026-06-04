import axios, { AxiosInstance } from 'axios';
import config from '@/config';
import logger from '@/utils/logger';

/**
 * Shopify API client
 * Handles all Shopify integration operations
 */
class ShopifyClient {
  private client: AxiosInstance;
  private shopName: string;
  private accessToken: string;

  constructor(shopName: string, accessToken: string) {
    this.shopName = shopName;
    this.accessToken = accessToken;

    this.client = axios.create({
      baseURL: `https://${shopName}.myshopify.com/admin/api/${config.integrations.shopify.apiVersion}`,
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Create product on Shopify
   */
  async createProduct(product: {
    title: string;
    description?: string;
    vendor?: string;
    product_type?: string;
    price: number;
    image_url?: string;
  }): Promise<any> {
    try {
      const response = await this.client.post('/graphql.json', {
        query: `
          mutation createProduct($input: ProductInput!) {
            productCreate(input: $input) {
              product {
                id
                title
                handle
                descriptionHtml
              }
              userErrors {
                field
                message
              }
            }
          }
        `,
        variables: {
          input: {
            title: product.title,
            descriptionHtml: product.description,
            vendor: product.vendor || 'AI Platform',
            productType: product.product_type || 'Digital',
          },
        },
      });

      if (response.data.errors) {
        throw new Error(`Shopify API error: ${JSON.stringify(response.data.errors)}`);
      }

      logger.info({ shopName: this.shopName }, 'Product created on Shopify');
      return response.data.data.productCreate.product;
    } catch (error) {
      logger.error({ error, shopName: this.shopName }, 'Failed to create Shopify product');
      throw error;
    }
  }

  /**
   * Get shop info
   */
  async getShopInfo(): Promise<any> {
    try {
      const response = await this.client.post('/graphql.json', {
        query: `
          query {
            shop {
              id
              name
              email
              currencyCode
              plan {
                displayName
              }
            }
          }
        `,
      });

      if (response.data.errors) {
        throw new Error(`Shopify API error: ${JSON.stringify(response.data.errors)}`);
      }

      return response.data.data.shop;
    } catch (error) {
      logger.error({ error }, 'Failed to get Shopify shop info');
      throw error;
    }
  }

  /**
   * List products
   */
  async listProducts(limit: number = 50): Promise<any[]> {
    try {
      const response = await this.client.post('/graphql.json', {
        query: `
          query {
            products(first: ${limit}) {
              edges {
                node {
                  id
                  title
                  handle
                  createdAt
                  publishedAt
                }
              }
            }
          }
        `,
      });

      if (response.data.errors) {
        throw new Error(`Shopify API error: ${JSON.stringify(response.data.errors)}`);
      }

      return response.data.data.products.edges.map((edge: any) => edge.node);
    } catch (error) {
      logger.error({ error }, 'Failed to list Shopify products');
      throw error;
    }
  }
}

export default ShopifyClient;
