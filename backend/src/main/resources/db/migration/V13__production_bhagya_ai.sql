-- ============================================================================
-- Bhagya Commerce — Step 25: Production Bhagya AI Flyway Migration
-- ============================================================================

CREATE TABLE IF NOT EXISTS ai_conversations (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    store_id VARCHAR(64),
    context_mode VARCHAR(32) NOT NULL DEFAULT 'CUSTOMER',
    title VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ai_conversations_user ON ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_store ON ai_conversations(store_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_updated ON ai_conversations(updated_at DESC);

CREATE TABLE IF NOT EXISTS ai_messages (
    id VARCHAR(64) PRIMARY KEY,
    conversation_id VARCHAR(64) NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
    role VARCHAR(32) NOT NULL,
    content TEXT NOT NULL,
    intent VARCHAR(64),
    structured_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ai_messages_conv ON ai_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_ai_messages_created ON ai_messages(created_at ASC);

CREATE TABLE IF NOT EXISTS ai_tool_executions (
    id VARCHAR(64) PRIMARY KEY,
    conversation_id VARCHAR(64) NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
    message_id VARCHAR(64) REFERENCES ai_messages(id) ON DELETE SET NULL,
    tool_name VARCHAR(64) NOT NULL,
    category VARCHAR(32) NOT NULL DEFAULT 'READ_ONLY',
    status VARCHAR(32) NOT NULL DEFAULT 'COMPLETED',
    input_parameters JSONB,
    output_data JSONB,
    error_message TEXT,
    duration_ms BIGINT,
    executed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ai_tool_exec_conv ON ai_tool_executions(conversation_id);
CREATE INDEX IF NOT EXISTS idx_ai_tool_exec_name ON ai_tool_executions(tool_name);

CREATE TABLE IF NOT EXISTS ai_action_confirmations (
    id VARCHAR(64) PRIMARY KEY,
    conversation_id VARCHAR(64) NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
    user_id VARCHAR(64) NOT NULL,
    store_id VARCHAR(64),
    action_type VARCHAR(64) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING_CONFIRMATION',
    summary TEXT NOT NULL,
    action_payload JSONB NOT NULL,
    execution_result JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_ai_actions_user ON ai_action_confirmations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_actions_store ON ai_action_confirmations(store_id);
CREATE INDEX IF NOT EXISTS idx_ai_actions_status ON ai_action_confirmations(status);

CREATE TABLE IF NOT EXISTS ai_feedback (
    id VARCHAR(64) PRIMARY KEY,
    message_id VARCHAR(64) REFERENCES ai_messages(id) ON DELETE SET NULL,
    user_id VARCHAR(64) NOT NULL,
    rating VARCHAR(16) NOT NULL,
    feedback_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ai_feedback_user ON ai_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_feedback_msg ON ai_feedback(message_id);

-- Seed AI Permissions into team role system if permissions table exists
INSERT INTO permissions (code, name, category, description)
VALUES 
    ('AI_ASSISTANT_USE', 'Use Customer AI Assistant', 'AI', 'Access customer-facing AI discovery and support features'),
    ('AI_MERCHANT_COPILOT', 'Use Merchant AI Copilot', 'AI', 'Access merchant workspace intelligence copilot and analytics summaries'),
    ('AI_ACTIONS_EXECUTE', 'Execute AI Confirmed Actions', 'AI', 'Authorize and execute high-impact AI proposed mutations (stock adjustments, discounts)')
ON CONFLICT (code) DO NOTHING;

-- Grant AI permissions to merchant OWNER, ADMIN, and STORE_MANAGER roles if roles table exists
INSERT INTO role_permissions (role_id, permission_code)
SELECT r.id, p.code
FROM roles r
CROSS JOIN permissions p
WHERE r.code IN ('OWNER', 'ADMIN', 'STORE_MANAGER')
  AND p.code IN ('AI_ASSISTANT_USE', 'AI_MERCHANT_COPILOT', 'AI_ACTIONS_EXECUTE')
ON CONFLICT DO NOTHING;
