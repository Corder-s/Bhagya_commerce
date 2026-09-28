-- ============================================================
-- Bhagya Commerce — V12 Loyalty, Rewards & Referrals Schema
-- Step 24: Store-Scoped Customer Loyalty, Immutable Ledger,
-- Configurable Rewards, Referral Attributions & Anti-Fraud
-- ============================================================

-- 1. Merchant-Configured Loyalty Programs (1-to-1 with Store)
CREATE TABLE IF NOT EXISTS loyalty_programs (
    id VARCHAR(64) PRIMARY KEY,
    store_id VARCHAR(64) NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    program_name VARCHAR(255) NOT NULL DEFAULT 'Artisan Guild Rewards',
    points_per_spent NUMERIC(8, 4) NOT NULL DEFAULT 0.05, -- 1 pt per ₹20 spent (5 pts per ₹100)
    currency_ratio NUMERIC(8, 2) NOT NULL DEFAULT 1.00,  -- 1 pt = ₹1 discount credit
    signup_bonus_points INT NOT NULL DEFAULT 100,
    first_order_bonus_points INT NOT NULL DEFAULT 150,
    review_bonus_points INT NOT NULL DEFAULT 50,
    referral_sender_points INT NOT NULL DEFAULT 300,
    referral_receiver_points INT NOT NULL DEFAULT 150,
    min_order_for_points NUMERIC(12, 2) NOT NULL DEFAULT 100.00,
    min_order_for_referral NUMERIC(12, 2) NOT NULL DEFAULT 500.00,
    points_expiry_days INT NOT NULL DEFAULT 365, -- 0 = no expiry
    expiry_notification_days INT NOT NULL DEFAULT 14,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_loyalty_program_store UNIQUE (store_id)
);

-- 2. Customer Loyalty Accounts (Store-Scoped)
CREATE TABLE IF NOT EXISTS loyalty_accounts (
    id VARCHAR(64) PRIMARY KEY,
    store_id VARCHAR(64) NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    customer_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, SUSPENDED, CLOSED
    available_points INT NOT NULL DEFAULT 0,
    lifetime_earned_points INT NOT NULL DEFAULT 0,
    lifetime_redeemed_points INT NOT NULL DEFAULT 0,
    lifetime_expired_points INT NOT NULL DEFAULT 0,
    tier VARCHAR(32) NOT NULL DEFAULT 'BRONZE', -- BRONZE, SILVER, GOLD, PLATINUM
    version INT NOT NULL DEFAULT 0, -- Optimistic locking for concurrency
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_loyalty_account_store_customer UNIQUE (store_id, customer_id),
    CONSTRAINT ck_available_points_non_negative CHECK (available_points >= 0)
);

CREATE INDEX IF NOT EXISTS idx_loyalty_account_customer ON loyalty_accounts(customer_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_account_store ON loyalty_accounts(store_id);

-- 3. Immutable Points Ledger (Every balance change must have a record)
CREATE TABLE IF NOT EXISTS loyalty_ledger (
    id VARCHAR(64) PRIMARY KEY,
    store_id VARCHAR(64) NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    customer_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    loyalty_account_id VARCHAR(64) NOT NULL REFERENCES loyalty_accounts(id) ON DELETE CASCADE,
    type VARCHAR(32) NOT NULL, -- EARNED, REDEEMED, EXPIRED, ADJUSTED, REFUNDED, REVERSED, BONUS, REFERRAL_EARNED, REFERRAL_REWARDED
    points INT NOT NULL, -- +positive for credits, -negative for debits
    balance_after INT NOT NULL,
    reference_type VARCHAR(64), -- ORDER, REFUND, REWARD_REDEMPTION, REFERRAL, SIGNUP, REVIEW, MANUAL_ADJUSTMENT
    reference_id VARCHAR(128),
    description TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_by VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_loyalty_ledger_account ON loyalty_ledger(loyalty_account_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_loyalty_ledger_reference ON loyalty_ledger(reference_type, reference_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_ledger_customer ON loyalty_ledger(customer_id, store_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_ledger_expiry ON loyalty_ledger(expires_at) WHERE expires_at IS NOT NULL;

-- 4. Merchant Configurable Rewards Catalog
CREATE TABLE IF NOT EXISTS loyalty_rewards (
    id VARCHAR(64) PRIMARY KEY,
    store_id VARCHAR(64) NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(32) NOT NULL, -- FIXED_AMOUNT_OFF, PERCENTAGE_OFF, FREE_SHIPPING, STORE_CREDIT
    points_cost INT NOT NULL,
    value NUMERIC(12, 2) NOT NULL,
    minimum_order_value NUMERIC(12, 2) DEFAULT 0,
    maximum_discount NUMERIC(12, 2),
    usage_limit INT,
    per_customer_limit INT DEFAULT 1,
    starts_at TIMESTAMP WITH TIME ZONE,
    ends_at TIMESTAMP WITH TIME ZONE,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_loyalty_rewards_store ON loyalty_rewards(store_id, enabled);

-- 5. Reward Redemptions (Issued coupon codes for checkout)
CREATE TABLE IF NOT EXISTS reward_redemptions (
    id VARCHAR(64) PRIMARY KEY,
    store_id VARCHAR(64) NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    customer_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reward_id VARCHAR(64) NOT NULL REFERENCES loyalty_rewards(id) ON DELETE RESTRICT,
    points_spent INT NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'ISSUED', -- PENDING, ISSUED, USED, EXPIRED, CANCELLED, REVERSED
    reference_code VARCHAR(64) NOT NULL UNIQUE,
    coupon_id VARCHAR(64) REFERENCES coupons(id) ON DELETE SET NULL,
    order_id VARCHAR(64) REFERENCES orders(id) ON DELETE SET NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    redeemed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reward_redemptions_customer ON reward_redemptions(customer_id, status);
CREATE INDEX IF NOT EXISTS idx_reward_redemptions_store ON reward_redemptions(store_id);
CREATE INDEX IF NOT EXISTS idx_reward_redemptions_code ON reward_redemptions(reference_code);

-- 6. Customer Referral Identity & Attributions
CREATE TABLE IF NOT EXISTS customer_referrals (
    id VARCHAR(64) PRIMARY KEY,
    store_id VARCHAR(64) NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    referrer_customer_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    referred_customer_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    referral_code VARCHAR(64) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'CREATED', -- CREATED, CLICKED, REGISTERED, QUALIFIED, REWARDED, REJECTED, EXPIRED
    qualified_order_id VARCHAR(64) REFERENCES orders(id) ON DELETE SET NULL,
    fraud_flag_reason VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    qualified_at TIMESTAMP WITH TIME ZONE,
    rewarded_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT uq_referral_store_code UNIQUE (store_id, referral_code)
);

CREATE INDEX IF NOT EXISTS idx_referral_referrer ON customer_referrals(store_id, referrer_customer_id);
CREATE INDEX IF NOT EXISTS idx_referral_referred ON customer_referrals(store_id, referred_customer_id);
CREATE INDEX IF NOT EXISTS idx_referral_code ON customer_referrals(referral_code);

-- 7. Register Loyalty Permissions in permissions table (if exists)
INSERT INTO permissions (id, code, module, name, description)
VALUES 
    ('perm_loyalty_view', 'LOYALTY_VIEW', 'LOYALTY', 'View Loyalty', 'View loyalty program metrics and customer balances'),
    ('perm_loyalty_manage', 'LOYALTY_MANAGE', 'LOYALTY', 'Manage Loyalty Program', 'Configure points earning rules, bonuses and expiry'),
    ('perm_reward_create', 'REWARD_CREATE', 'LOYALTY', 'Create Rewards', 'Create redeemable discount and gift coupons'),
    ('perm_reward_update', 'REWARD_UPDATE', 'LOYALTY', 'Update Rewards', 'Modify reward values, point costs and thresholds'),
    ('perm_reward_delete', 'REWARD_DELETE', 'LOYALTY', 'Delete Rewards', 'Remove or disable loyalty catalog rewards'),
    ('perm_loyalty_adjust', 'LOYALTY_ADJUST', 'LOYALTY', 'Manual Point Adjustments', 'Perform audited manual credits or debits'),
    ('perm_referral_manage', 'REFERRAL_MANAGE', 'LOYALTY', 'Manage Referrals', 'Configure referral rules, qualification and review fraud flags'),
    ('perm_loyalty_analytics', 'LOYALTY_ANALYTICS_VIEW', 'LOYALTY', 'View Loyalty Analytics', 'Inspect point liability, retention and ROI')
ON CONFLICT (code) DO NOTHING;

-- Grant to OWNER, ADMIN, MARKETING_MANAGER roles
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.code IN ('OWNER', 'ADMIN') 
  AND p.code IN ('LOYALTY_VIEW', 'LOYALTY_MANAGE', 'REWARD_CREATE', 'REWARD_UPDATE', 'REWARD_DELETE', 'LOYALTY_ADJUST', 'REFERRAL_MANAGE', 'LOYALTY_ANALYTICS_VIEW')
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.code = 'MARKETING_MANAGER'
  AND p.code IN ('LOYALTY_VIEW', 'REWARD_CREATE', 'REWARD_UPDATE', 'REFERRAL_MANAGE', 'LOYALTY_ANALYTICS_VIEW')
ON CONFLICT DO NOTHING;
