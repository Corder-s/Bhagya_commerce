-- ============================================================
-- Bhagya Commerce — V10 Storefront Builder & Custom Domains
-- Step 22: Configurable, Draftable, Previewable, Publishable Storefronts
-- ============================================================

-- 1. Storefront Configurations (Branding, SEO, Identity, Typography)
CREATE TABLE IF NOT EXISTS storefront_configurations (
    id VARCHAR(64) PRIMARY KEY,
    store_id VARCHAR(64) NOT NULL REFERENCES stores(id) ON DELETE CASCADE UNIQUE,
    store_name VARCHAR(255) NOT NULL,
    tagline VARCHAR(255),
    description TEXT,
    logo_url TEXT,
    favicon_url TEXT,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    social_links JSONB NOT NULL DEFAULT '{}'::jsonb,
    primary_color VARCHAR(32) NOT NULL DEFAULT '#2D5A43',
    secondary_color VARCHAR(32) NOT NULL DEFAULT '#4A7C59',
    accent_color VARCHAR(32) NOT NULL DEFAULT '#D97706',
    typography VARCHAR(64) NOT NULL DEFAULT 'Outfit',
    button_style VARCHAR(32) NOT NULL DEFAULT 'rounded',
    card_style VARCHAR(32) NOT NULL DEFAULT 'surface',
    border_radius VARCHAR(32) NOT NULL DEFAULT 'lg',
    seo_title VARCHAR(255),
    seo_description TEXT,
    seo_keywords TEXT,
    og_title VARCHAR(255),
    og_description TEXT,
    og_image_url TEXT,
    navigation_items JSONB NOT NULL DEFAULT '[]'::jsonb,
    published_version INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_storefront_configs_store ON storefront_configurations(store_id);

-- 2. Storefront Sections (Hero, Featured Products, Categories, Story, etc.)
CREATE TABLE IF NOT EXISTS storefront_sections (
    id VARCHAR(64) PRIMARY KEY,
    store_id VARCHAR(64) NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    section_type VARCHAR(64) NOT NULL,
    title VARCHAR(255),
    subtitle VARCHAR(255),
    content_config JSONB NOT NULL DEFAULT '{}'::jsonb,
    position INT NOT NULL DEFAULT 0,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_storefront_sections_store_pos ON storefront_sections(store_id, position);

-- 3. Storefront Revisions (Atomic Draft & Published Snapshot Architecture)
CREATE TABLE IF NOT EXISTS storefront_revisions (
    id VARCHAR(64) PRIMARY KEY,
    store_id VARCHAR(64) NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    version INT NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'DRAFT', -- DRAFT, PUBLISHED, ARCHIVED
    configuration JSONB NOT NULL,
    created_by VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT uq_storefront_revision_version UNIQUE (store_id, version)
);

CREATE INDEX IF NOT EXISTS idx_storefront_revisions_lookup ON storefront_revisions(store_id, status);

-- 4. Extend Store Domains for Lifecycle & Verification
ALTER TABLE store_domains ADD COLUMN IF NOT EXISTS is_primary BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE store_domains ADD COLUMN IF NOT EXISTS verification_token VARCHAR(128);
ALTER TABLE store_domains ADD COLUMN IF NOT EXISTS verification_method VARCHAR(32) DEFAULT 'DNS_TXT';
ALTER TABLE store_domains ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE store_domains ADD COLUMN IF NOT EXISTS ssl_status VARCHAR(32) DEFAULT 'PENDING';

CREATE UNIQUE INDEX IF NOT EXISTS idx_store_domains_primary ON store_domains (store_id) WHERE is_primary = TRUE;
CREATE INDEX IF NOT EXISTS idx_store_domains_lookup ON store_domains (domain, status);
