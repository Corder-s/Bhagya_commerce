-- ============================================================
-- Bhagya Commerce — V3 Payment Webhooks, Refunds, Outbox & Deliveries
-- Step 13: Real Payment Gateway + Multi-Channel Notifications
-- ============================================================

-- 1. Webhook Provider Events (Idempotency & Audit)
CREATE TABLE IF NOT EXISTS provider_events (
    id VARCHAR(64) PRIMARY KEY,
    provider VARCHAR(64) NOT NULL,
    provider_event_id VARCHAR(128) NOT NULL UNIQUE,
    event_type VARCHAR(128) NOT NULL,
    payload JSONB,
    status VARCHAR(32) NOT NULL DEFAULT 'PROCESSED',
    received_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Refunds
CREATE TABLE IF NOT EXISTS refunds (
    id VARCHAR(64) PRIMARY KEY,
    payment_id VARCHAR(64) NOT NULL REFERENCES payments(id) ON DELETE RESTRICT,
    order_id VARCHAR(64) NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
    amount_inr NUMERIC(12, 2) NOT NULL CHECK (amount_inr > 0),
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
    provider_refund_id VARCHAR(128),
    idempotency_key VARCHAR(128) UNIQUE,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Notification Multi-Channel Deliveries
CREATE TABLE IF NOT EXISTS notification_deliveries (
    id VARCHAR(64) PRIMARY KEY,
    notification_id VARCHAR(64) REFERENCES notifications(id) ON DELETE CASCADE,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    channel VARCHAR(32) NOT NULL, -- EMAIL, WHATSAPP, SMS, IN_APP
    provider VARCHAR(64) NOT NULL,
    recipient VARCHAR(255) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'QUEUED', -- QUEUED, SENDING, SENT, DELIVERED, FAILED
    provider_message_id VARCHAR(128),
    attempt_count INT NOT NULL DEFAULT 0,
    last_error TEXT,
    idempotency_hash VARCHAR(128) UNIQUE,
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. Transactional Outbox Events
CREATE TABLE IF NOT EXISTS outbox_events (
    id VARCHAR(64) PRIMARY KEY,
    event_type VARCHAR(64) NOT NULL,
    aggregate_type VARCHAR(64) NOT NULL,
    aggregate_id VARCHAR(64) NOT NULL,
    payload JSONB NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
    attempt_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP WITH TIME ZONE
);

-- Query optimization indexes
CREATE INDEX IF NOT EXISTS idx_provider_events_lookup ON provider_events(provider, provider_event_id);
CREATE INDEX IF NOT EXISTS idx_notification_deliveries_user ON notification_deliveries(user_id, channel, status);
CREATE INDEX IF NOT EXISTS idx_outbox_pending ON outbox_events(status, created_at);
CREATE INDEX IF NOT EXISTS idx_refunds_order ON refunds(order_id);
