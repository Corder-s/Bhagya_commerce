-- =============================================================================
-- V6: Shipping, Fulfillment & Logistics Architecture (Step 18)
-- =============================================================================

-- 1. Fulfillments Table
CREATE TABLE IF NOT EXISTS fulfillments (
    id VARCHAR(64) PRIMARY KEY,
    order_id VARCHAR(64) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    store_id VARCHAR(64) NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    status VARCHAR(32) NOT NULL DEFAULT 'UNFULFILLED', -- UNFULFILLED, PROCESSING, PACKED, READY_FOR_PICKUP, SHIPPED, DELIVERED, CANCELLED
    carrier VARCHAR(64),
    tracking_number VARCHAR(100),
    package_weight_kg NUMERIC(8, 2) DEFAULT 0.50,
    package_dimensions VARCHAR(64) DEFAULT '25x20x8 cm',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Shipping Labels
CREATE TABLE IF NOT EXISTS shipping_labels (
    id VARCHAR(64) PRIMARY KEY,
    shipment_id VARCHAR(64) NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
    storage_key VARCHAR(255) NOT NULL,
    mime_type VARCHAR(64) NOT NULL DEFAULT 'application/pdf',
    barcode VARCHAR(128) NOT NULL,
    download_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Shipping Pickup Requests
CREATE TABLE IF NOT EXISTS shipping_pickup_requests (
    id VARCHAR(64) PRIMARY KEY,
    shipment_id VARCHAR(64) NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
    carrier VARCHAR(64) NOT NULL,
    pickup_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'SCHEDULED', -- SCHEDULED, COMPLETED, RESCHEDULED, CANCELLED
    reference_number VARCHAR(100) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. Shipping Rates Cache / Rule Table
CREATE TABLE IF NOT EXISTS shipping_rates (
    id VARCHAR(64) PRIMARY KEY,
    provider VARCHAR(64) NOT NULL,
    service_code VARCHAR(64) NOT NULL,
    service_name VARCHAR(128) NOT NULL,
    carrier VARCHAR(64) NOT NULL,
    estimated_days INT NOT NULL DEFAULT 3,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    cod_supported BOOLEAN NOT NULL DEFAULT TRUE,
    zone VARCHAR(32) NOT NULL DEFAULT 'NATIONAL',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. Delivery Attempts (NDR / Failure Tracking)
CREATE TABLE IF NOT EXISTS delivery_attempts (
    id VARCHAR(64) PRIMARY KEY,
    shipment_id VARCHAR(64) NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
    attempt_number INT NOT NULL DEFAULT 1,
    status VARCHAR(32) NOT NULL, -- FAILED, RESCHEDULED, RTO_INITIATED
    reason TEXT,
    action_required TEXT,
    attempted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 6. Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_fulfillments_order ON fulfillments(order_id);
CREATE INDEX IF NOT EXISTS idx_fulfillments_store ON fulfillments(store_id);
CREATE INDEX IF NOT EXISTS idx_fulfillments_status ON fulfillments(status);
CREATE INDEX IF NOT EXISTS idx_shipping_labels_shipment ON shipping_labels(shipment_id);
CREATE INDEX IF NOT EXISTS idx_shipping_pickups_shipment ON shipping_pickup_requests(shipment_id);
CREATE INDEX IF NOT EXISTS idx_delivery_attempts_shipment ON delivery_attempts(shipment_id);
