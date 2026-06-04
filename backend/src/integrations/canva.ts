import axios, { AxiosInstance } from 'axios';
import logger from '@/utils/logger';

/**
 * Canva API client
 * Handles design generation and template operations
 */
class CanvaClient {
  private client: AxiosInstance;
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;

    this.client = axios.create({
      baseURL: 'https://api.canva.com/v1',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Create design from template
   */
  async createDesignFromTemplate(templateId: string, updates: Record<string, any>): Promise<any> {
    try {
      const response = await this.client.post('/designs', {
        template_id: templateId,
        updates,
      });

      logger.info({ templateId }, 'Design created from template');
      return response.data;
    } catch (error) {
      logger.error({ error, templateId }, 'Failed to create design from template');
      throw error;
    }
  }

  /**
   * Get design
   */
  async getDesign(designId: string): Promise<any> {
    try {
      const response = await this.client.get(`/designs/${designId}`);
      return response.data;
    } catch (error) {
      logger.error({ error, designId }, 'Failed to get design');
      throw error;
    }
  }

  /**
   * Export design
   */
  async exportDesign(designId: string, format: string = 'png'): Promise<any> {
    try {
      const response = await this.client.post(`/designs/${designId}/export`, {
        file_type: format,
      });

      logger.info({ designId, format }, 'Design exported');
      return response.data;
    } catch (error) {
      logger.error({ error, designId, format }, 'Failed to export design');
      throw error;
    }
  }

  /**
   * List templates
   */
  async listTemplates(category?: string, limit: number = 50): Promise<any[]> {
    try {
      const params: Record<string, any> = { limit };
      if (category) {
        params.category = category;
      }

      const response = await this.client.get('/templates', { params });
      return response.data.items || [];
    } catch (error) {
      logger.error({ error, category }, 'Failed to list templates');
      throw error;
    }
  }
}

export default CanvaClient;
