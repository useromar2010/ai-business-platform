import Joi from 'joi';

/**
 * Validation schemas for API requests
 */

export const authSchemas = {
  register: Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().min(2).max(100).required(),
    password: Joi.string().min(8).max(100).required(),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  refreshToken: Joi.object({
    refreshToken: Joi.string().required(),
  }),
};

export const productSchemas = {
  create: Joi.object({
    name: Joi.string().min(3).max(255).required(),
    description: Joi.string().max(1000),
    category: Joi.string().required(),
    basePrice: Joi.number().positive().required(),
    costOfProduction: Joi.number().positive().required(),
    designUrl: Joi.string().uri(),
  }),

  update: Joi.object({
    name: Joi.string().min(3).max(255),
    description: Joi.string().max(1000),
    category: Joi.string(),
    basePrice: Joi.number().positive(),
    costOfProduction: Joi.number().positive(),
    designUrl: Joi.string().uri(),
    status: Joi.string().valid('draft', 'active', 'archived'),
  }),
};

export const integrationSchemas = {
  connect: Joi.object({
    type: Joi.string()
      .valid('shopify', 'etsy', 'gumroad', 'canva', 'stripe')
      .required(),
    credentials: Joi.object().required(),
  }),
};

/**
 * Validate request data against schema
 */
export function validate<T>(
  data: any,
  schema: Joi.Schema
): { value: T; error?: Joi.ValidationError } {
  const { error, value } = schema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });

  return { value: value as T, error };
}
