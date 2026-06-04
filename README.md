# AI Business Platform - Production SaaS

A sophisticated, 24/7 autonomous AI agent system for generating, pricing, marketing, selling, and tracking digital design products across multiple marketplaces and social platforms.

## Overview

This is a **production-ready SaaS application** (not a demo, mockup, or prototype) featuring:

- **Design Generation Engine**: Integrates with Canva API to create hundreds of professional design variations daily
- **Pricing Intelligence**: Real-time market analysis and competitive pricing optimization
- **Marketing Automation**: Multi-platform content generation and publishing
- **Sales Distribution**: Automated product publishing across Shopify, Etsy, Gumroad, and more
- **Revenue Dashboard**: Real-time analytics, forecasting, and performance tracking
- **24/7 Operations**: Continuous automation with error recovery and monitoring
- **Enterprise Security**: OAuth, encrypted credential storage, compliance-ready

## Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL 14+
- **Job Scheduler**: Bull (Redis-based)
- **Authentication**: OAuth 2.0, JWT
- **Encryption**: bcryptjs, crypto-js
- **API Client**: axios, node-fetch

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: Redux Toolkit
- **Charts**: Chart.js, Recharts
- **HTTP Client**: axios

### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose (local), Kubernetes (production)
- **CI/CD**: GitHub Actions
- **Cloud**: AWS/Azure/GCP ready
- **Monitoring**: Prometheus, Grafana
- **Logging**: ELK Stack

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+
- PostgreSQL 14+
- Redis 7+

### Local Development

```bash
# Clone the repository
git clone https://github.com/useromar2010/ai-business-platform.git
cd ai-business-platform

# Start all services
docker-compose up -d

# Run migrations
docker-compose exec backend npm run migrate

# Seed database
docker-compose exec backend npm run seed

# Access dashboard
open http://localhost:3000
```

## Configuration

Create `.env` file in project root:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/ai_platform

# Redis
REDIS_URL=redis://localhost:6379

# API Keys (users connect their own accounts)
CANVA_CLIENT_ID=your_client_id
CANVA_CLIENT_SECRET=your_client_secret

# JWT
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_EXPIRE=7d

# Encryption
ENCRYPTION_KEY=your_encryption_key_min_32_chars_long

# Node environment
NODE_ENV=development
PORT=5000

# Frontend
REACT_APP_API_URL=http://localhost:5000/api
```

## Core Features

### 1. Design Generation
- Canva API integration (official)
- Batch design creation
- Template management
- Design variation generation
- Quality assurance checks

### 2. Pricing Intelligence
- Market price analysis
- Competitor tracking
- Margin optimization
- Dynamic price adjustment
- Demand-based pricing

### 3. Marketing Automation
- Content generation (GPT-4 integration optional)
- Caption, hashtag, and description generation
- Multi-platform scheduling
- Performance tracking
- A/B testing support

### 4. Sales Distribution
- **Shopify**: Full product sync
- **Etsy**: Listing management
- **Gumroad**: Digital product upload
- **WooCommerce**: REST API integration
- **Print-on-Demand**: Printful, Redbubble
- Extensible integration framework

### 5. Revenue Analytics
- Real-time sales tracking
- Product performance ranking
- Customer acquisition metrics
- Forecasting (best/expected/worst case)
- Daily/weekly/monthly/yearly reports
- AI-powered recommendations

### 6. Security
- OAuth 2.0 authentication
- Encrypted credential storage
- Role-based access control (RBAC)
- Audit logging
- Rate limiting
- HTTPS/TLS enforcement

## API Documentation

### Authentication
```bash
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
GET /api/auth/me
```

### Integrations
```bash
GET /api/integrations
POST /api/integrations/:type/connect     # OAuth flow
DELETE /api/integrations/:id             # Disconnect
GET /api/integrations/:id/status         # Check connection
```

### Products
```bash
GET /api/products
POST /api/products                       # Create new product
PATCH /api/products/:id                  # Update
DELETE /api/products/:id                 # Delete
POST /api/products/:id/publish           # Publish to marketplaces
```

### Revenue
```bash
GET /api/revenue/dashboard               # Real-time metrics
GET /api/revenue/sales                   # Sales history
GET /api/revenue/forecast                # AI-generated forecast
GET /api/revenue/reports/:period         # Period reports
```

## Testing

```bash
# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

## Deployment

### Docker Compose (Local/Staging)
```bash
docker-compose -f docker-compose.yml up -d
```

### Kubernetes (Production)
```bash
kubectl apply -f kubernetes/
```

## Security Best Practices

1. **Credential Storage**: All API keys encrypted with AES-256
2. **Authentication**: JWT tokens with short expiration
3. **Authorization**: RBAC with fine-grained permissions
4. **Data Encryption**: TLS in transit, AES at rest
5. **Rate Limiting**: Per-user and per-IP limits
6. **Audit Logging**: All sensitive actions logged
7. **CORS**: Configured for security
8. **Input Validation**: Comprehensive schema validation
9. **HTTPS**: Enforced in production
10. **Secrets Management**: Environment-based, no hardcoding

## License

MIT License

## Support

For issues and feature requests, use [GitHub Issues](https://github.com/useromar2010/ai-business-platform/issues)
