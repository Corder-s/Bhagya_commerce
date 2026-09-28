-- ============================================================
-- Bhagya Commerce — V15 Performance & Scale Optimization (Step 28)
-- High-throughput composite indexes, analytics rollups, and async export jobs
-- ============================================================

-- 1. High-Volume Order & Merchant Query Indexes
CREATE INDEX IF NOT EXISTS idx_orders_store_status_created ON orders(store_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_user_created ON orders(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- 2. Payment & Shipment High-Frequency Lookups
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_status_created ON payments(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payments_gateway_txn ON payments(gateway_transaction_id);
CREATE INDEX IF NOT EXISTS idx_shipments_order_id ON shipments(order_id);
CREATE INDEX IF NOT EXISTS idx_shipments_tracking ON shipments(tracking_number);

-- 3. Product Discovery, Inventory & Review Range Indexes
CREATE INDEX IF NOT EXISTS idx_inventory_product_available ON inventory(product_id, available_quantity);
CREATE INDEX IF NOT EXISTS idx_reviews_product_rating ON reviews(product_id, rating DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_user_product ON reviews(user_id, product_id);
CREATE INDEX IF NOT EXISTS idx_coupons_store_code ON coupons(store_id, code);

-- 4. Audit & Analytics High-Throughput Filtering
CREATE INDEX IF NOT EXISTS idx_audit_resource ON audit_logs(resource_type, resource_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type_time ON analytics_events(event_type, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_entity ON analytics_events(entity_type, entity_id);

-- 5. Loyalty & Referral Concurrency Indexes
CREATE INDEX IF NOT EXISTS idx_loyalty_account_store_user ON loyalty_accounts(store_id, user_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_ledger_account ON loyalty_ledger(account_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_loyalty_rewards_store_active ON loyalty_rewards(store_id, is_active);
CREATE INDEX IF NOT EXISTS idx_reward_redemptions_cust_reward ON reward_redemptions(customer_id, reward_id, status);

-- 6. Pre-aggregated Analytics Rollups (Avoids repeated scans over raw event tables)
CREATE TABLE IF NOT EXISTS analytics_daily_rollups (
    id VARCHAR(64) PRIMARY KEY,
    store_id VARCHAR(64) NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    rollup_date DATE NOT NULL,
    total_views BIGINT NOT NULL DEFAULT 0,
    total_add_to_cart BIGINT NOT NULL DEFAULT 0,
    total_orders BIGINT NOT NULL DEFAULT 0,
    gross_sales_inr NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    net_sales_inr NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(store_id, rollup_date)
);

CREATE INDEX IF NOT EXISTS idx_analytics_rollups_store_date ON analytics_daily_rollups(store_id, rollup_date DESC);

-- 7. Asynchronous Export Jobs (Offloads large CSV/PDF generation from HTTP request threads)
CREATE TABLE IF NOT EXISTS export_jobs (
    id VARCHAR(64) PRIMARY KEY,
    store_id VARCHAR(64) NOT NULL,
    user_id VARCHAR(64) NOT NULL,
    export_type VARCHAR(32) NOT NULL, -- ANALYTICS_CSV, ORDERS_CSV, PRODUCTS_CSV, INVOICE_ZIP
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING', -- PENDING, PROCESSING, COMPLETED, FAILED
    file_url TEXT,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_export_jobs_store ON export_jobs(store_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_export_jobs_user ON export_jobs(user_id, created_at DESC);
