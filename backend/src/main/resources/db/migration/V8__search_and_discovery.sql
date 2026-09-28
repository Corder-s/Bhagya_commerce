-- V8__search_and_discovery.sql
-- Step 20: Search, Autocomplete, Indexing, and Query Analytics

-- Search Query Logs for Discovery & Analytics
CREATE TABLE IF NOT EXISTS search_query_logs (
    id VARCHAR(64) PRIMARY KEY,
    query VARCHAR(255) NOT NULL,
    normalized_query VARCHAR(255) NOT NULL,
    result_count INT NOT NULL DEFAULT 0,
    user_id VARCHAR(64),
    session_id VARCHAR(128),
    store_id VARCHAR(64),
    filters_applied TEXT,
    execution_time_ms BIGINT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_search_query_normalized ON search_query_logs(normalized_query);
CREATE INDEX IF NOT EXISTS idx_search_query_created_at ON search_query_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_search_query_store ON search_query_logs(store_id);

-- Performance Indexes for Product Discovery
CREATE INDEX IF NOT EXISTS idx_products_status_store ON products(status, store_id);
CREATE INDEX IF NOT EXISTS idx_products_category_status ON products(category_id, status);
CREATE INDEX IF NOT EXISTS idx_products_price_status ON products(price_inr, status);
CREATE INDEX IF NOT EXISTS idx_products_rating_status ON products(rating_value DESC, status);

-- Search Synonyms & Term Normalization
CREATE TABLE IF NOT EXISTS search_synonyms (
    id VARCHAR(64) PRIMARY KEY,
    term VARCHAR(100) NOT NULL UNIQUE,
    synonyms TEXT NOT NULL, -- comma-separated synonyms
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_search_synonyms_term ON search_synonyms(term);
