/**
 * Core TypeScript type definitions for the AI Business Platform
 */

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  isEmailVerified: boolean;
  isActive: boolean;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

export type UserRole = 'admin' | 'user' | 'viewer';

export interface Integration {
  id: string;
  userId: string;
  type: IntegrationType;
  isConnected: boolean;
  encryptedCredentials: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  lastSyncAt?: Date;
}

export type IntegrationType =
  | 'shopify'
  | 'etsy'
  | 'gumroad'
  | 'woocommerce'
  | 'canva'
  | 'stripe'
  | 'instagram'
  | 'facebook'
  | 'youtube'
  | 'tiktok';

export interface Product {
  id: string;
  userId: string;
  name: string;
  description: string;
  category: string;
  basePrice: number;
  currentPrice: number;
  costOfProduction: number;
  designUrl: string;
  designMetadata: DesignMetadata;
  status: ProductStatus;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export type ProductStatus = 'draft' | 'active' | 'archived';

export interface DesignMetadata {
  canvaProjectId?: string;
  canvaDesignId?: string;
  width?: number;
  height?: number;
  format?: string;
  tags?: string[];
  template?: string;
}

export interface MarketplaceListing {
  id: string;
  productId: string;
  userId: string;
  marketplace: IntegrationType;
  externalProductId: string;
  externalUrl: string;
  listingStatus: ListingStatus;
  syncedPrice: number;
  createdAt: Date;
  updatedAt: Date;
  lastSyncAt: Date;
}

export type ListingStatus = 'active' | 'inactive' | 'delisted' | 'sync_failed';

export interface Sale {
  id: string;
  userId: string;
  productId: string;
  marketplace: IntegrationType;
  marketplaceOrderId: string;
  externalCustomerId: string;
  quantity: number;
  salePrice: number;
  profitMargin: number;
  status: SaleStatus;
  currency: string;
  createdAt: Date;
  fulfilledAt?: Date;
}

export type SaleStatus = 'pending' | 'completed' | 'refunded' | 'failed';

export interface ScheduledJob {
  id: string;
  userId: string;
  type: JobType;
  status: JobStatus;
  schedule: string; // cron expression
  config: Record<string, any>;
  lastRunAt?: Date;
  nextRunAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type JobType =
  | 'generate_designs'
  | 'sync_products'
  | 'publish_marketing'
  | 'sync_sales'
  | 'update_pricing'
  | 'generate_forecast';

export type JobStatus = 'active' | 'paused' | 'failed';

export interface JobExecution {
  id: string;
  jobId: string;
  userId: string;
  status: ExecutionStatus;
  startedAt: Date;
  completedAt?: Date;
  error?: string;
  result?: Record<string, any>;
}

export type ExecutionStatus = 'pending' | 'running' | 'success' | 'failed';

export interface Revenue {
  totalRevenue: number;
  totalProfit: number;
  avgOrderValue: number;
  totalOrders: number;
  conversionRate: number;
  period: 'today' | 'week' | 'month' | 'year';
  timestamp: Date;
}

export interface Forecast {
  userId: string;
  periodStart: Date;
  periodEnd: Date;
  bestCase: ForecastProjection;
  expectedCase: ForecastProjection;
  worstCase: ForecastProjection;
  confidence: number;
  createdAt: Date;
}

export interface ForecastProjection {
  revenue: number;
  profit: number;
  ordersEstimate: number;
  confidence: number;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  oldValue?: Record<string, any>;
  newValue?: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
