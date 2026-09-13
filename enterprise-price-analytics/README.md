# Enterprise High-Throughput Web Scraper & Real-Time Price Analytics Engine

> **Part 1 — Project Foundation, Backend, and Supabase Integration**

A full-stack enterprise platform for monitoring, comparing, and analysing product prices across major Indian e-commerce websites.

---

## Project Overview

This repository contains the **full-stack development layer** of a larger system. The architecture is designed to integrate seamlessly with:

- A **Scraping Engine** (team member — Selenium / Playwright / Scrapy)
- **ML / DL Analytics** (team member — price prediction, recommendations)

This phase establishes the stable foundation that both integrations will target.

---

## Technology Stack

| Layer     | Technology                     |
|-----------|-------------------------------|
| Frontend  | React 18, Vite 5, React Router |
| HTTP Client | Axios                        |
| Backend   | Node.js 18+, Express.js 4     |
| Database  | Supabase (PostgreSQL)         |
| Dev Tools | nodemon, concurrently, dotenv |
| Validation| express-validator             |

---

## Folder Structure

```
enterprise-price-analytics/
│
├── client/                     # React + Vite frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components (Part 2)
│   │   ├── pages/              # Page-level components
│   │   │   └── Home.jsx        # Connection test page (Part 1)
│   │   ├── services/
│   │   │   └── api.js          # Centralised Axios instance
│   │   ├── hooks/              # Custom React hooks (Part 2)
│   │   ├── utils/              # Utility functions (Part 2)
│   │   ├── lib/                # Third-party config (Part 2)
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
│
├── server/                     # Node.js + Express backend
│   ├── src/
│   │   ├── controllers/        # HTTP request handlers
│   │   │   ├── productController.js
│   │   │   ├── jobController.js
│   │   │   └── sourceController.js
│   │   ├── routes/             # Express routers with validation
│   │   │   ├── productRoutes.js
│   │   │   ├── jobRoutes.js
│   │   │   └── sourceRoutes.js
│   │   ├── services/           # Business logic + Supabase queries
│   │   │   ├── productService.js
│   │   │   ├── jobService.js
│   │   │   └── sourceService.js
│   │   ├── lib/
│   │   │   └── supabase.js     # Supabase server-side client
│   │   ├── middleware/
│   │   │   ├── errorHandler.js
│   │   │   └── notFound.js
│   │   ├── utils/
│   │   │   └── response.js     # Standardised API response helpers
│   │   ├── app.js              # Express application setup
│   │   └── server.js           # HTTP server entry point
│   ├── package.json
│   └── .env.example
│
├── database/
│   ├── schema.sql              # Table definitions + indexes
│   └── seed.sql                # Demo data (30 products, 110+ price records)
│
├── package.json                # Root workspace (concurrently)
├── .gitignore
└── README.md
```

---

## Prerequisites

- **Node.js** ≥ 18.0.0 — [nodejs.org](https://nodejs.org)
- **npm** ≥ 9.0.0 (bundled with Node.js)
- **Supabase account** — [supabase.com](https://supabase.com) (free tier is sufficient)

---

## Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a free project.

2. In the Supabase Dashboard, navigate to:
   - **SQL Editor → New Query**

3. Copy and run `database/schema.sql` to create all tables and indexes.

4. Copy and run `database/seed.sql` to insert demo data.

5. Collect your credentials from:
   - **Project Settings → API**
     - `Project URL` → `SUPABASE_URL`
     - `service_role` secret → `SUPABASE_SERVICE_ROLE_KEY`

> ⚠️ **Never** commit your `service_role` key. It grants full database access.

---

## Environment Variables

### server/.env

Create `server/.env` (copy from `server/.env.example`):

```env
PORT=5000
NODE_ENV=development
SUPABASE_URL=https://xxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### client/.env

Create `client/.env` (copy from `client/.env.example`):

```env
VITE_API_URL=http://localhost:5000/api
```

> The client **must never** contain the Supabase service role key.

---

## Installation

### Option A — Install all at once (recommended)

```bash
cd enterprise-price-analytics
npm run install:all
```

### Option B — Install individually

```bash
# Root
cd enterprise-price-analytics
npm install

# Client
cd client && npm install && cd ..

# Server
cd server && npm install && cd ..
```

---

## Running the Application

### Start both frontend and backend simultaneously

```bash
npm run dev
```

This uses `concurrently` to start:
- Express backend on `http://localhost:5000`
- React/Vite dev server on `http://localhost:5173`

### Start individually

```bash
# Backend only
npm run server

# Frontend only
npm run client
```

---

## API Endpoints

All endpoints return a consistent JSON shape.

**Success:**
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

**Failure:**
```json
{
  "success": false,
  "data": null,
  "message": "Something went wrong"
}
```

---

### Health

| Method | Endpoint     | Description  |
|--------|-------------|--------------|
| GET    | /api/health | Health check |

---

### Products

| Method | Endpoint           | Description    |
|--------|--------------------|----------------|
| GET    | /api/products      | List products  |
| GET    | /api/products/:id  | Get product    |
| POST   | /api/products      | Create product |
| PUT    | /api/products/:id  | Update product |
| DELETE | /api/products/:id  | Delete product |

**Query parameters for GET /api/products:**

| Param    | Example             | Description              |
|----------|---------------------|--------------------------|
| search   | ?search=laptop      | Search by product name   |
| category | ?category=Mobiles   | Filter by category        |
| source   | ?source=Amazon      | Filter by source          |
| page     | ?page=2             | Page number (default: 1) |
| limit    | ?limit=20           | Results per page          |
| sort     | ?sort=price_asc     | Sort order                |

**Valid sort values:** `price_asc`, `price_desc`, `name_asc`, `name_desc`, `created_at_desc`, `created_at_asc`, `updated_at_desc`

---

### Scraping Jobs

| Method | Endpoint      | Description       |
|--------|--------------|-------------------|
| GET    | /api/jobs    | List jobs         |
| GET    | /api/jobs/:id | Get job          |
| POST   | /api/jobs    | Create job        |
| PUT    | /api/jobs/:id | Update job status |

**Query parameters for GET /api/jobs:**

| Param    | Example           | Description       |
|----------|-------------------|-------------------|
| status   | ?status=running   | Filter by status  |
| source   | ?source=Amazon    | Filter by source  |
| category | ?category=Laptops | Filter by category |
| page     | ?page=1           | Pagination        |
| limit    | ?limit=10         | Results per page  |

**Valid job statuses:** `pending`, `running`, `completed`, `failed`

---

### Sources

| Method | Endpoint         | Description   |
|--------|-----------------|---------------|
| GET    | /api/sources    | List sources  |
| GET    | /api/sources/:id | Get source   |
| POST   | /api/sources    | Add source    |
| PUT    | /api/sources/:id | Update source |

---

## Database Schema

### Tables

| Table          | Purpose                                  |
|----------------|------------------------------------------|
| `products`     | Product catalogue with pricing           |
| `price_history`| Time-series price observations per product |
| `scraping_jobs`| Scraping job queue (for scraping engine)  |
| `sources`      | Scraping source metadata                 |

### Key design decisions

- UUID primary keys (`gen_random_uuid()`)
- `NUMERIC(12,2)` for prices (avoids floating-point errors)
- `price_history` uses `ON DELETE CASCADE` from products
- `products.updated_at` is auto-maintained by a PostgreSQL trigger
- `scraping_jobs.status` is constrained to: `pending | running | completed | failed`

---

## Development Workflow

```
1. Edit server code  → nodemon auto-restarts Express
2. Edit client code  → Vite HMR updates browser instantly
3. Test APIs         → Open http://localhost:5000/api/health
4. Check frontend    → Open http://localhost:5173
```

---

## Future Integration — Scraping Engine

The scraping engine (implemented by another team member) will integrate by:

1. **Creating a job:**
   ```
   POST /api/jobs  { "source": "Amazon", "category": "Mobiles" }
   ```

2. **Starting the job:**
   ```
   PUT /api/jobs/:id  { "status": "running" }
   ```

3. **Upserting scraped products:**
   ```
   POST /api/products  { name, current_price, source, ... }
   ```

4. **Completing the job:**
   ```
   PUT /api/jobs/:id  { "status": "completed", "products_found": 42 }
   ```

---

## Future Integration — ML / DL Analytics

The ML team will integrate by:

1. Reading price history via `GET /api/products/:id` (includes `price_history` array)
2. New analytics endpoints can be added to the Express API under `/api/analytics`
3. The existing service/controller architecture makes it straightforward to add new route groups

---

## Security Notes

- **No authentication** in this phase (planned for a later phase)
- `SUPABASE_SERVICE_ROLE_KEY` is **only** in `server/.env` — never sent to the browser
- CORS is configured to only allow known origins
- Validation is performed on all inputs using `express-validator`
- Error responses never expose stack traces in production

---

## Team Structure

| Responsibility          | Owner               |
|-------------------------|---------------------|
| Full-stack development  | You (this repo)     |
| Scraping engine         | Team member         |
| ML / DL analytics       | Team member         |
