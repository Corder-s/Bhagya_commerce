-- ============================================================
-- Bhagya Commerce — V11 Team & Role Management
-- Step 23: Multi-User Organization Members, Roles, Permissions & Invitations
-- ============================================================

-- 1. Roles Definition
CREATE TABLE IF NOT EXISTS roles (
    id VARCHAR(64) PRIMARY KEY,
    code VARCHAR(32) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_system BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Permissions Definition
CREATE TABLE IF NOT EXISTS permissions (
    id VARCHAR(64) PRIMARY KEY,
    code VARCHAR(64) NOT NULL UNIQUE,
    module VARCHAR(32) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_permissions_module ON permissions(module);

-- 3. Role-Permission Cross Map
CREATE TABLE IF NOT EXISTS role_permissions (
    role_id VARCHAR(64) NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id VARCHAR(64) NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- 4. Extend Organization Members with Status & Store Scoping
ALTER TABLE organization_members ADD COLUMN IF NOT EXISTS status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE';
ALTER TABLE organization_members ADD COLUMN IF NOT EXISTS store_access_type VARCHAR(32) NOT NULL DEFAULT 'ALL_STORES';
ALTER TABLE organization_members ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- 5. Granular Store Access per Organization Member
CREATE TABLE IF NOT EXISTS member_store_access (
    id VARCHAR(64) PRIMARY KEY,
    member_id VARCHAR(64) NOT NULL REFERENCES organization_members(id) ON DELETE CASCADE,
    store_id VARCHAR(64) NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_member_store UNIQUE (member_id, store_id)
);

CREATE INDEX IF NOT EXISTS idx_member_store_member ON member_store_access(member_id);
CREATE INDEX IF NOT EXISTS idx_member_store_store ON member_store_access(store_id);

-- 6. Organization Invitations with Secure Token & Expiry
CREATE TABLE IF NOT EXISTS organization_invitations (
    id VARCHAR(64) PRIMARY KEY,
    organization_id VARCHAR(64) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(32) NOT NULL,
    store_access_type VARCHAR(32) NOT NULL DEFAULT 'ALL_STORES',
    store_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
    token_hash VARCHAR(128) NOT NULL UNIQUE,
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING', -- PENDING, ACCEPTED, EXPIRED, REVOKED
    invited_by VARCHAR(64) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    accepted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_org_invitations_lookup ON organization_invitations(organization_id, email, status);
CREATE INDEX IF NOT EXISTS idx_org_invitations_token ON organization_invitations(token_hash);

-- 7. Seed System Roles
INSERT INTO roles (id, code, name, description, is_system) VALUES
('role_owner', 'OWNER', 'Organization Owner', 'Complete sovereign authority over stores, billing, team, and organization ownership.', TRUE),
('role_admin', 'ADMIN', 'Store Administrator', 'Full operational control over store catalog, orders, shipping, team invites, and settings.', TRUE),
('role_manager', 'MANAGER', 'Store Manager', 'Daily operational management of orders, fulfillment, products, and customer communications.', TRUE),
('role_prod_mgr', 'PRODUCT_MANAGER', 'Product & Inventory Manager', 'Dedicated management of craft catalog, variant pricing, inventory batches, and storytelling.', TRUE),
('role_order_mgr', 'ORDER_MANAGER', 'Fulfillment & Logistics Specialist', 'Processing dispatches, carrier tracking, manifest generation, and returns.', TRUE),
('role_mktg_mgr', 'MARKETING_MANAGER', 'Marketing & Growth Specialist', 'Creation of coupon promotions, artisan campaigns, banners, and analytics inspection.', TRUE),
('role_support', 'SUPPORT_AGENT', 'Customer Experience Specialist', 'Customer support, order status inspection, dispute assistance, and verified review moderation.', TRUE)
ON CONFLICT (code) DO NOTHING;
