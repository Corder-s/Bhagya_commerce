-- ============================================================
-- Bhagya Commerce — V4 Analytics & Event Intelligence Schema
-- Step 16: Durable events, taxonomy indexes, and aggregation support
-- ============================================================

-- 1. Ensure columns exist on analytics_events
ALTER TABLE analytics_events ADD COLUMN IF NOT EXISTS organization_id VARCHAR(64);
ALTER TABLE analytics_events ADD COLUMN IF NOT EXISTS source VARCHAR(32) DEFAULT 'WEB';

-- 2. Performance Indexes for Analytics Aggregations
CREATE INDEX IF NOT EXISTS idx_analytics_event_type_time ON analytics_events(event_type, occurred_at);
CREATE INDEX IF NOT EXISTS idx_analytics_store_type_time ON analytics_events(store_id, event_type, occurred_at);
CREATE INDEX IF NOT EXISTS idx_analytics_session ON analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_user_time ON analytics_events(user_id, occurred_at);
CREATE INDEX IF NOT EXISTS idx_orders_created_status ON orders(created_at, status);
CREATE INDEX IF NOT EXISTS idx_orders_store_created ON orders(store_id, created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_product_order ON order_items(product_id, order_id);
