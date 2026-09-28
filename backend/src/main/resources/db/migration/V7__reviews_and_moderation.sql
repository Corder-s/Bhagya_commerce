-- =============================================================================
-- V7: Reviews, Ratings, Verified Purchase & Moderation Architecture (Step 19)
-- =============================================================================

-- 1. Alter or augment reviews table with moderation & order verification fields
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS order_id VARCHAR(64) REFERENCES orders(id) ON DELETE SET NULL;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS order_item_id VARCHAR(64);
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS status VARCHAR(32) NOT NULL DEFAULT 'PUBLISHED'; -- PENDING, PUBLISHED, REJECTED, HIDDEN, DELETED
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS helpful_count INT NOT NULL DEFAULT 0;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- 2. Review Media (R2 Cloudflare metadata)
CREATE TABLE IF NOT EXISTS review_media (
    id VARCHAR(64) PRIMARY KEY,
    review_id VARCHAR(64) NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
    storage_provider VARCHAR(32) NOT NULL DEFAULT 'R2',
    bucket VARCHAR(128) NOT NULL DEFAULT 'bhagya-reviews',
    object_key VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    mime_type VARCHAR(64) NOT NULL DEFAULT 'image/jpeg',
    size_bytes BIGINT,
    width INT,
    height INT,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Review Helpful Votes (Idempotent: 1 per user per review)
CREATE TABLE IF NOT EXISTS review_helpful_votes (
    id VARCHAR(64) PRIMARY KEY,
    review_id VARCHAR(64) NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_review_user_helpful UNIQUE(review_id, user_id)
);

-- 4. Review Reports (Abuse / Flagging)
CREATE TABLE IF NOT EXISTS review_reports (
    id VARCHAR(64) PRIMARY KEY,
    review_id VARCHAR(64) NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
    reporter_user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reason VARCHAR(64) NOT NULL, -- SPAM, ABUSE, HARASSMENT, FAKE_CONTENT, OFF_TOPIC, OTHER
    description TEXT,
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING', -- PENDING, RESOLVED, DISMISSED
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. Merchant Review Responses
CREATE TABLE IF NOT EXISTS review_responses (
    id VARCHAR(64) PRIMARY KEY,
    review_id VARCHAR(64) NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
    store_id VARCHAR(64) NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    author_user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    body TEXT NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'PUBLISHED',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 6. Review Moderation Audits (Admin Moderation Trail)
CREATE TABLE IF NOT EXISTS review_moderation_audits (
    id VARCHAR(64) PRIMARY KEY,
    review_id VARCHAR(64) NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
    actor_user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(32) NOT NULL, -- APPROVED, REJECTED, HIDDEN
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 7. High-Performance Query Indexes
CREATE INDEX IF NOT EXISTS idx_reviews_product_status ON reviews(product_id, status);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_order ON reviews(order_id);
CREATE INDEX IF NOT EXISTS idx_review_media_review ON review_media(review_id);
CREATE INDEX IF NOT EXISTS idx_review_helpful_review ON review_helpful_votes(review_id);
CREATE INDEX IF NOT EXISTS idx_review_reports_status ON review_reports(status);
CREATE INDEX IF NOT EXISTS idx_review_responses_review ON review_responses(review_id);
CREATE INDEX IF NOT EXISTS idx_review_responses_store ON review_responses(store_id);
