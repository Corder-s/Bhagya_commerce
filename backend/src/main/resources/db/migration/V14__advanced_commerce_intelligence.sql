-- ============================================================================
-- Bhagya Commerce – Step 26: Advanced Commerce Intelligence Flyway Migration
-- ============================================================================

-- 1. Merchant Intelligence Alerts Table
CREATE TABLE IF NOT EXISTS intelligence_alerts (
    id VARCHAR(64) PRIMARY KEY,
    store_id VARCHAR(64) NOT NULL,
    alert_type VARCHAR(64) NOT NULL,
    severity VARCHAR(32) NOT NULL DEFAULT 'INFO',
    metric_name VARCHAR(64) NOT NULL,
    current_value NUMERIC(14, 2),
    baseline_value NUMERIC(14, 2),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'NEW',
    detected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB
);

CREATE INDEX IF NOT EXISTS idx_intelligence_alerts_store ON intelligence_alerts(store_id);
CREATE INDEX IF NOT EXISTS idx_intelligence_alerts_status ON intelligence_alerts(status);
CREATE INDEX IF NOT EXISTS idx_intelligence_alerts_detected ON intelligence_alerts(detected_at DESC);

-- 2. Merchant Intelligence Insights Table
CREATE TABLE IF NOT EXISTS intelligence_insights (
    id VARCHAR(64) PRIMARY KEY,
    store_id VARCHAR(64) NOT NULL,
    insight_type VARCHAR(64) NOT NULL,
    severity VARCHAR(32) NOT NULL DEFAULT 'INFO',
    title VARCHAR(255) NOT NULL,
    summary TEXT NOT NULL,
    evidence TEXT NOT NULL,
    metric_name VARCHAR(64),
    suggested_action TEXT,
    detected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE'
);

CREATE INDEX IF NOT EXISTS idx_intelligence_insights_store ON intelligence_insights(store_id);
CREATE INDEX IF NOT EXISTS idx_intelligence_insights_type ON intelligence_insights(insight_type);
CREATE INDEX IF NOT EXISTS idx_intelligence_insights_detected ON intelligence_insights(detected_at DESC);

-- 3. Forecast Records Table
CREATE TABLE IF NOT EXISTS forecast_records (
    id VARCHAR(64) PRIMARY KEY,
    store_id VARCHAR(64) NOT NULL,
    metric_name VARCHAR(64) NOT NULL,
    horizon_days INT NOT NULL,
    forecast_value NUMERIC(14, 2) NOT NULL,
    lower_bound NUMERIC(14, 2) NOT NULL,
    upper_bound NUMERIC(14, 2) NOT NULL,
    method VARCHAR(64) NOT NULL,
    training_window_days INT NOT NULL,
    mae NUMERIC(14, 2),
    limitations TEXT NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_forecast_records_store ON forecast_records(store_id);
CREATE INDEX IF NOT EXISTS idx_forecast_records_metric ON forecast_records(metric_name);
CREATE INDEX IF NOT EXISTS idx_forecast_records_generated ON forecast_records(generated_at DESC);
