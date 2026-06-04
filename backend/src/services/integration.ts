import { IntegrationModel } from '@/models/integration';
import { Integration, IntegrationType } from '@/types';
import encryptionService from '@/utils/encryption';
import ShopifyClient from '@/integrations/shopify';
import CanvaClient from '@/integrations/canva';
import StripeClient from '@/integrations/stripe';
import logger from '@/utils/logger';

/**
 * Service for managing marketplace integrations
 */
export class IntegrationService {
  /**
   * Connect integration with encrypted credentials
   */
  static async connectIntegration(
    userId: string,
    type: IntegrationType,
    credentials: Record<string, any>,
    metadata?: Record<string, any>
  ): Promise<Integration> {
    try {
      // Check if already connected
      const existing = await IntegrationModel.findByUserAndType(userId, type);
      if (existing && existing.isConnected) {
        throw new Error('Integration already connected for this type');
      }

      // Encrypt credentials
      const encryptedCredentials = encryptionService.encrypt(credentials);

      // Create or update integration
      const integration = existing
        ? await IntegrationModel.update(existing.id, {
            encryptedCredentials,
            isConnected: true,
            metadata,
          })
        : await IntegrationModel.create(userId, type, encryptedCredentials, metadata);

      logger.info({ userId, type }, 'Integration connected');
      return integration!;
    } catch (error) {
      logger.error({ error, userId, type }, 'Failed to connect integration');
      throw error;
    }
  }

  /**
   * Disconnect integration
   */
  static async disconnectIntegration(integrationId: string): Promise<void> {
    try {
      await IntegrationModel.delete(integrationId);
      logger.info({ integrationId }, 'Integration disconnected');
    } catch (error) {
      logger.error({ error, integrationId }, 'Failed to disconnect integration');
      throw error;
    }
  }

  /**
   * Get Shopify client for user
   */
  static async getShopifyClient(userId: string): Promise<ShopifyClient | null> {
    try {
      const integration = await IntegrationModel.findByUserAndType(userId, 'shopify');

      if (!integration || !integration.isConnected) {
        return null;
      }

      const credentials = encryptionService.decrypt(
        integration.encryptedCredentials
      ) as any;

      return new ShopifyClient(credentials.shopName, credentials.accessToken);
    } catch (error) {
      logger.error({ error, userId }, 'Failed to get Shopify client');
      return null;
    }
  }

  /**
   * Get Canva client for user
   */
  static async getCanvaClient(userId: string): Promise<CanvaClient | null> {
    try {
      const integration = await IntegrationModel.findByUserAndType(userId, 'canva');

      if (!integration || !integration.isConnected) {
        return null;
      }

      const credentials = encryptionService.decrypt(
        integration.encryptedCredentials
      ) as any;

      return new CanvaClient(credentials.accessToken);
    } catch (error) {
      logger.error({ error, userId }, 'Failed to get Canva client');
      return null;
    }
  }

  /**
   * Get Stripe client for user
   */
  static async getStripeClient(userId: string): Promise<StripeClient | null> {
    try {
      const integration = await IntegrationModel.findByUserAndType(userId, 'stripe');

      if (!integration || !integration.isConnected) {
        return null;
      }

      const credentials = encryptionService.decrypt(
        integration.encryptedCredentials
      ) as any;

      return new StripeClient(credentials.secretKey);
    } catch (error) {
      logger.error({ error, userId }, 'Failed to get Stripe client');
      return null;
    }
  }
}

export default IntegrationService;
