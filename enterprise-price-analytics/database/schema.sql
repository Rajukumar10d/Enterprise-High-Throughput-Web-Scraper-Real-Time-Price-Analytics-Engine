-- ============================================================
-- Enterprise Price Analytics Engine — Database Schema
-- Database: Supabase PostgreSQL
-- Run this file in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/<your-project>/sql
-- ============================================================

-- Enable UUID generation (already enabled in Supabase by default)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- TABLE: sources
-- Metadata about scraping data sources (e.g. Amazon, Flipkart)
-- ============================================================
CREATE TABLE IF NOT EXISTS sources (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            VARCHAR(100)  NOT NULL UNIQUE,
  base_url        TEXT          NOT NULL,
  status          VARCHAR(20)   NOT NULL DEFAULT 'active'
                  CHECK (status IN ('active', 'inactive', 'paused')),
  last_scraped_at TIMESTAMPTZ,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  sources              IS 'Metadata about scraping data sources';
COMMENT ON COLUMN sources.name         IS 'Human-readable source name, e.g. Amazon';
COMMENT ON COLUMN sources.base_url     IS 'Root URL of the source website';
COMMENT ON COLUMN sources.status       IS 'active | inactive | paused';
COMMENT ON COLUMN sources.last_scraped_at IS 'Timestamp of the last successful scrape from this source';

-- ============================================================
-- TABLE: products
-- Core product catalogue with current pricing information
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id                     UUID          PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identity
  name                   VARCHAR(500)  NOT NULL,
  description            TEXT,
  category               VARCHAR(100),
  source                 VARCHAR(100),
  source_product_id      VARCHAR(255),
  product_url            TEXT,
  image_url              TEXT,

  -- Pricing
  currency               CHAR(3)       NOT NULL DEFAULT 'INR',
  current_price          NUMERIC(12,2) NOT NULL CHECK (current_price >= 0),
  previous_price         NUMERIC(12,2)           CHECK (previous_price >= 0),
  price_change           NUMERIC(12,2),
  price_change_percentage NUMERIC(8,4),

  -- Timestamps
  created_at             TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at             TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  last_scraped_at        TIMESTAMPTZ
);

COMMENT ON TABLE  products                      IS 'Core product catalogue with live pricing';
COMMENT ON COLUMN products.source               IS 'Source name — matches sources.name';
COMMENT ON COLUMN products.source_product_id    IS 'Product identifier on the source platform';
COMMENT ON COLUMN products.price_change         IS 'current_price minus previous_price';
COMMENT ON COLUMN products.price_change_percentage IS 'Percentage change relative to previous_price';

-- Auto-update updated_at on row modification
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS products_updated_at ON products;
CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- TABLE: price_history
-- Time-series price records for each product
-- ============================================================
CREATE TABLE IF NOT EXISTS price_history (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  UUID          NOT NULL,
  price       NUMERIC(12,2) NOT NULL CHECK (price >= 0),
  currency    CHAR(3)       NOT NULL DEFAULT 'INR',
  source      VARCHAR(100),
  recorded_at TIMESTAMPTZ   NOT NULL DEFAULT NOW(),

  -- Cascade deletes so removing a product cleans up its history
  CONSTRAINT fk_price_history_product
    FOREIGN KEY (product_id)
    REFERENCES products(id)
    ON DELETE CASCADE
);

COMMENT ON TABLE  price_history             IS 'Time-series of price observations per product';
COMMENT ON COLUMN price_history.product_id  IS 'References products.id';
COMMENT ON COLUMN price_history.recorded_at IS 'When this price was observed';

-- ============================================================
-- TABLE: scraping_jobs
-- Job queue for the scraping engine (to be integrated later)
-- ============================================================
CREATE TABLE IF NOT EXISTS scraping_jobs (
  id             UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  source         VARCHAR(100) NOT NULL,
  category       VARCHAR(100),
  status         VARCHAR(20)  NOT NULL DEFAULT 'pending'
                 CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  started_at     TIMESTAMPTZ,
  completed_at   TIMESTAMPTZ,
  products_found INTEGER      DEFAULT 0 CHECK (products_found >= 0),
  error_message  TEXT,
  created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  scraping_jobs              IS 'Job queue for the scraping engine';
COMMENT ON COLUMN scraping_jobs.status       IS 'pending | running | completed | failed';
COMMENT ON COLUMN scraping_jobs.products_found IS 'Number of products upserted by this job';

-- ============================================================
-- INDEXES
-- ============================================================

-- products
CREATE INDEX IF NOT EXISTS idx_products_name            ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_category        ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_source          ON products(source);
CREATE INDEX IF NOT EXISTS idx_products_current_price   ON products(current_price);
CREATE INDEX IF NOT EXISTS idx_products_last_scraped_at ON products(last_scraped_at);

-- price_history
CREATE INDEX IF NOT EXISTS idx_price_history_product_id ON price_history(product_id);
CREATE INDEX IF NOT EXISTS idx_price_history_recorded_at ON price_history(recorded_at);

-- scraping_jobs
CREATE INDEX IF NOT EXISTS idx_jobs_status     ON scraping_jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON scraping_jobs(created_at);

-- sources
CREATE INDEX IF NOT EXISTS idx_sources_status ON sources(status);
