-- ============================================================
-- Bhagya Commerce — V5 Merchant Marketing, Promotions & Campaigns Schema
-- Step 17: Promotions, Coupons, Customer Segments, Campaigns & Delivery
-- ============================================================

-- 1. Promotions
CREATE TABLE IF NOT EXISTS promotions (
    id VARCHAR(64) PRIMARY KEY,
    store_id VARCHAR(64) NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(64) NOT NULL, -- PERCENTAGE_DISCOUNT, FIXED_DISCOUNT, FREE_DELIVERY, PRODUCT_DISCOUNT, CATEGORY_DISCOUNT
    status VARCHAR(32) NOT NULL DEFAULT 'DRAFT', -- DRAFT, SCHEDULED, ACTIVE, PAUSED, EXPIRED, ARCHIVED
    value NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    minimum_order_value NUMERIC(12, 2) DEFAULT 0,
    maximum_discount NUMERIC(12, 2),
    starts_at TIMESTAMP WITH TIME ZONE,
    ends_at TIMESTAMP WITH TIME ZONE,
    usage_limit INT,
    per_customer_limit INT DEFAULT 1,
    usage_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Coupons (Store-scoped, case-normalized code)
CREATE TABLE IF NOT EXISTS coupons (
    id VARCHAR(64) PRIMARY KEY,
    promotion_id VARCHAR(64) NOT NULL REFERENCES promotions(id) ON DELETE CASCADE,
    store_id VARCHAR(64) NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    code VARCHAR(64) NOT NULL,
    usage_limit INT,
    per_customer_limit INT DEFAULT 1,
    usage_count INT NOT NULL DEFAULT 0,
    starts_at TIMESTAMP WITH TIME ZONE,
    ends_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(store_id, code)
);

-- 3. Customer Segments
CREATE TABLE IF NOT EXISTS customer_segments (
    id VARCHAR(64) PRIMARY KEY,
    store_id VARCHAR(64) NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    criteria JSONB,
    estimated_count INT NOT NULL DEFAULT 0,
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. Campaigns
CREATE TABLE IF NOT EXISTS campaigns (
    id VARCHAR(64) PRIMARY KEY,
    store_id VARCHAR(64) NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    channel VARCHAR(32) NOT NULL, -- EMAIL, WHATSAPP, SMS
    status VARCHAR(32) NOT NULL DEFAULT 'DRAFT', -- DRAFT, SCHEDULED, RUNNING, PAUSED, COMPLETED, CANCELLED, FAILED
    audience_id VARCHAR(64),
    audience_name VARCHAR(255),
    promotion_id VARCHAR(64) REFERENCES promotions(id) ON DELETE SET NULL,
    subject VARCHAR(255),
    message_body TEXT NOT NULL,
    scheduled_at TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    total_recipients INT NOT NULL DEFAULT 0,
    sent_count INT NOT NULL DEFAULT 0,
    delivered_count INT NOT NULL DEFAULT 0,
    failed_count INT NOT NULL DEFAULT 0,
    attributed_orders INT NOT NULL DEFAULT 0,
    attributed_sales NUMERIC(12, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. Campaign Recipients
CREATE TABLE IF NOT EXISTS campaign_recipients (
    id VARCHAR(64) PRIMARY KEY,
    campaign_id VARCHAR(64) NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    store_id VARCHAR(64) NOT NULL,
    customer_id VARCHAR(64) NOT NULL,
    customer_email VARCHAR(255),
    customer_phone VARCHAR(50),
    channel VARCHAR(32) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'ELIGIBLE', -- ELIGIBLE, QUEUED, SENDING, SENT, DELIVERED, FAILED, SKIPPED, UNSUBSCRIBED
    provider_message_id VARCHAR(128),
    attempt_count INT NOT NULL DEFAULT 0,
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    failed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(campaign_id, customer_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_promotions_store_status ON promotions(store_id, status);
CREATE INDEX IF NOT EXISTS idx_coupons_store_code ON coupons(store_id, code);
CREATE INDEX IF NOT EXISTS idx_campaigns_store_status ON campaigns(store_id, status);
CREATE INDEX IF NOT EXISTS idx_campaign_recipients_status ON campaign_recipients(campaign_id, status);
