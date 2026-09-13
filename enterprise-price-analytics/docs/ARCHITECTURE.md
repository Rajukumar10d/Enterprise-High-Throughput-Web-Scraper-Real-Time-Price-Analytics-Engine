# Architecture Overview

## Runtime Layers

1. Client UI: Vite + React + React Router
2. API layer: Express server mounted under /api
3. Business services: products, jobs, analytics, integrations
4. Data layer: Supabase/PostgreSQL when configured; in-memory fallback otherwise

## Rule

The application is intentionally built so the scraping engine and ML pipeline are not embedded in the core app. They connect through integration interfaces rather than hard-coded business logic.
