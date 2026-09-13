# API Reference

The platform exposes a small set of HTTP endpoints for products, jobs, sources, analytics, and external integration interfaces.

## Base URL

- Local: http://localhost:5000/api

## Health

### GET /health

Returns the server status.

## Products

### GET /products

Supports `search`, `category`, `source`, `page`, `limit`, and `sort` query parameters.

### GET /products/:id

Returns one product profile with nested `price_history` when available.

### POST /products

Creates a product record.

### PUT /products/:id

Updates an existing product and recalculates derived price metrics.

### DELETE /products/:id

Removes a product and associated price history rows.

## Jobs

### GET /jobs

Lists scraping jobs with optional status and source filters.

### POST /jobs

Creates a new job record.

## Sources

### GET /sources

Returns tracked source sites.

## Analytics

### GET /analytics/overview

Returns operational metrics and a product trend summary.

### GET /analytics/price-history/:productId

Returns historical price points for a product.

### GET /analytics/source-comparison

Returns average price and discount distribution by source.

## Integrations

### GET /integrations/scraper/status

Returns the current scraper interface status.

### GET /integrations/ml/status

Returns the ML/DL integration stub status.
