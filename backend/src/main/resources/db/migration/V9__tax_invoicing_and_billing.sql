-- V9__tax_invoicing_and_billing.sql
-- Step 21: Tax Calculation, Customer Invoicing, Credit Notes, and Merchant SaaS Billing

-- 1. Tax Rules & Rates
CREATE TABLE IF NOT EXISTS tax_rules (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    tax_type VARCHAR(32) NOT NULL, -- GST, CGST, SGST, IGST, CESS
    rate NUMERIC(6, 4) NOT NULL CHECK (rate >= 0),
    jurisdiction VARCHAR(64) NOT NULL DEFAULT 'IN',
    product_category VARCHAR(64),
    effective_from TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    effective_to TIMESTAMP WITH TIME ZONE,
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tax_rules_category ON tax_rules(product_category, status);

-- 2. Customer Order Invoices (Immutable once issued)
CREATE TABLE IF NOT EXISTS invoices (
    id VARCHAR(64) PRIMARY KEY,
    invoice_number VARCHAR(64) NOT NULL UNIQUE,
    order_id VARCHAR(64) NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
    customer_id VARCHAR(64) NOT NULL,
    store_id VARCHAR(64) NOT NULL,
    currency VARCHAR(8) NOT NULL DEFAULT 'INR',
    subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0),
    discount NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (discount >= 0),
    taxable_amount NUMERIC(12, 2) NOT NULL CHECK (taxable_amount >= 0),
    cgst NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    sgst NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    igst NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    tax NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (tax >= 0),
    delivery_fee NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (delivery_fee >= 0),
    total NUMERIC(12, 2) NOT NULL CHECK (total >= 0),
    status VARCHAR(32) NOT NULL DEFAULT 'ISSUED', -- DRAFT, ISSUED, VOID, CANCELLED
    seller_snapshot JSONB,
    customer_snapshot JSONB,
    issued_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_invoices_order ON invoices(order_id);
CREATE INDEX IF NOT EXISTS idx_invoices_customer ON invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_store ON invoices(store_id);
CREATE INDEX IF NOT EXISTS idx_invoices_created ON invoices(created_at DESC);

-- 3. Invoice Items
CREATE TABLE IF NOT EXISTS invoice_items (
    id VARCHAR(64) PRIMARY KEY,
    invoice_id VARCHAR(64) NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    product_id VARCHAR(64) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    sku VARCHAR(100),
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(12, 2) NOT NULL CHECK (unit_price >= 0),
    discount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    taxable_amount NUMERIC(12, 2) NOT NULL,
    tax NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    line_total NUMERIC(12, 2) NOT NULL CHECK (line_total >= 0)
);

CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice ON invoice_items(invoice_id);

-- 4. R2 Invoice Document Storage Metadata
CREATE TABLE IF NOT EXISTS invoice_documents (
    id VARCHAR(64) PRIMARY KEY,
    invoice_id VARCHAR(64) NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    storage_provider VARCHAR(32) NOT NULL DEFAULT 'R2',
    bucket VARCHAR(100) NOT NULL,
    object_key VARCHAR(255) NOT NULL,
    mime_type VARCHAR(64) NOT NULL DEFAULT 'application/pdf',
    size_bytes BIGINT NOT NULL DEFAULT 0,
    version INT NOT NULL DEFAULT 1,
    download_hash VARCHAR(128),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_invoice_documents_invoice ON invoice_documents(invoice_id);

-- 5. Customer Credit Notes (for returns / refunds)
CREATE TABLE IF NOT EXISTS credit_notes (
    id VARCHAR(64) PRIMARY KEY,
    credit_note_number VARCHAR(64) NOT NULL UNIQUE,
    invoice_id VARCHAR(64) NOT NULL REFERENCES invoices(id) ON DELETE RESTRICT,
    order_id VARCHAR(64) NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
    reason VARCHAR(255) NOT NULL,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    tax_adjustment NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(32) NOT NULL DEFAULT 'ISSUED',
    issued_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_credit_notes_invoice ON credit_notes(invoice_id);
CREATE INDEX IF NOT EXISTS idx_credit_notes_order ON credit_notes(order_id);

-- 6. Merchant Billing Profiles
CREATE TABLE IF NOT EXISTS billing_profiles (
    organization_id VARCHAR(64) PRIMARY KEY REFERENCES organizations(id) ON DELETE CASCADE,
    legal_business_name VARCHAR(255) NOT NULL,
    gstin VARCHAR(32),
    billing_email VARCHAR(255) NOT NULL,
    billing_phone VARCHAR(32),
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(32) NOT NULL,
    country VARCHAR(64) NOT NULL DEFAULT 'India',
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 7. Merchant SaaS Billing Invoices (Strictly distinct from customer order invoices)
CREATE TABLE IF NOT EXISTS billing_invoices (
    id VARCHAR(64) PRIMARY KEY,
    invoice_number VARCHAR(64) NOT NULL UNIQUE,
    organization_id VARCHAR(64) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    subscription_id VARCHAR(64) NOT NULL REFERENCES subscriptions(id) ON DELETE RESTRICT,
    plan_id VARCHAR(64) NOT NULL REFERENCES plans(id) ON DELETE RESTRICT,
    plan_name VARCHAR(100) NOT NULL,
    period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0),
    tax NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (tax >= 0),
    total NUMERIC(12, 2) NOT NULL CHECK (total >= 0),
    currency VARCHAR(8) NOT NULL DEFAULT 'INR',
    status VARCHAR(32) NOT NULL DEFAULT 'PAID', -- PAID, PENDING, FAILED
    payment_method VARCHAR(64) NOT NULL DEFAULT 'CARD_OR_UPI',
    paid_at TIMESTAMP WITH TIME ZONE,
    issued_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_billing_invoices_org ON billing_invoices(organization_id);
CREATE INDEX IF NOT EXISTS idx_billing_invoices_sub ON billing_invoices(subscription_id);

-- 8. Webhook Event Idempotency Records
CREATE TABLE IF NOT EXISTS processed_webhook_events (
    event_id VARCHAR(128) PRIMARY KEY,
    provider VARCHAR(64) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    processed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
