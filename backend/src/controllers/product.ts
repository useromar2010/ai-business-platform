import { Request, Response } from 'express';
import { AuthRequest } from '@/middleware/auth';
import { ProductModel } from '@/models/product';
import { validate, productSchemas } from '@/utils/validation';
import logger from '@/utils/logger';

/**
 * Create product
 */
export async function createProduct(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { value, error } = validate(req.body, productSchemas.create);

    if (error) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.details,
      });
      return;
    }

    const product = await ProductModel.create(
      req.userId!,
      value.name,
      value.category,
      value.basePrice,
      value.costOfProduction,
      value.description,
      value.designUrl,
      value.designMetadata
    );

    logger.info({ userId: req.userId, productId: product.id }, 'Product created');

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    logger.error({ error }, 'Failed to create product');
    res.status(500).json({
      success: false,
      error: 'Failed to create product',
    });
  }
}

/**
 * Get all products
 */
export async function getProducts(req: AuthRequest, res: Response): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string;

    const offset = (page - 1) * limit;

    const products = await ProductModel.findByUserId(
      req.userId!,
      status as any,
      limit,
      offset
    );

    res.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total: products.length,
      },
    });
  } catch (error) {
    logger.error({ error }, 'Failed to get products');
    res.status(500).json({
      success: false,
      error: 'Failed to get products',
    });
  }
}

/**
 * Get product by ID
 */
export async function getProduct(req: AuthRequest, res: Response): Promise<void> {
  try {
    const product = await ProductModel.findById(req.params.id);

    if (!product || product.userId !== req.userId) {
      res.status(404).json({
        success: false,
        error: 'Product not found',
      });
      return;
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    logger.error({ error }, 'Failed to get product');
    res.status(500).json({
      success: false,
      error: 'Failed to get product',
    });
  }
}

/**
 * Update product
 */
export async function updateProduct(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { value, error } = validate(req.body, productSchemas.update);

    if (error) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.details,
      });
      return;
    }

    const product = await ProductModel.findById(req.params.id);

    if (!product || product.userId !== req.userId) {
      res.status(404).json({
        success: false,
        error: 'Product not found',
      });
      return;
    }

    const updated = await ProductModel.update(req.params.id, value);

    logger.info({ userId: req.userId, productId: req.params.id }, 'Product updated');

    res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    logger.error({ error }, 'Failed to update product');
    res.status(500).json({
      success: false,
      error: 'Failed to update product',
    });
  }
}

/**
 * Publish product
 */
export async function publishProduct(req: AuthRequest, res: Response): Promise<void> {
  try {
    const product = await ProductModel.findById(req.params.id);

    if (!product || product.userId !== req.userId) {
      res.status(404).json({
        success: false,
        error: 'Product not found',
      });
      return;
    }

    const updated = await ProductModel.publish(req.params.id);

    logger.info({ userId: req.userId, productId: req.params.id }, 'Product published');

    res.json({
      success: true,
      data: updated,
      message: 'Product published successfully',
    });
  } catch (error) {
    logger.error({ error }, 'Failed to publish product');
    res.status(500).json({
      success: false,
      error: 'Failed to publish product',
    });
  }
}

/**
 * Delete product
 */
export async function deleteProduct(req: AuthRequest, res: Response): Promise<void> {
  try {
    const product = await ProductModel.findById(req.params.id);

    if (!product || product.userId !== req.userId) {
      res.status(404).json({
        success: false,
        error: 'Product not found',
      });
      return;
    }

    await ProductModel.delete(req.params.id);

    logger.info({ userId: req.userId, productId: req.params.id }, 'Product deleted');

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    logger.error({ error }, 'Failed to delete product');
    res.status(500).json({
      success: false,
      error: 'Failed to delete product',
    });
  }
}
