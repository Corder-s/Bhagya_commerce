package com.bhagya.commerce.search.service;

import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class SearchAnalyticsService {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public SearchAnalyticsService(NamedParameterJdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Async
    public void logSearchEvent(
            String query,
            String normalizedQuery,
            int resultCount,
            String userId,
            String storeId,
            String filtersApplied,
            long executionTimeMs
    ) {
        try {
            String sql = "INSERT INTO search_query_logs " +
                    "(id, query, normalized_query, result_count, user_id, store_id, filters_applied, execution_time_ms, created_at) " +
                    "VALUES (:id, :query, :normalizedQuery, :resultCount, :userId, :storeId, :filtersApplied, :executionTimeMs, CURRENT_TIMESTAMP)";

            MapSqlParameterSource params = new MapSqlParameterSource();
            params.addValue("id", "sq_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16));
            params.addValue("query", query != null ? query : "");
            params.addValue("normalizedQuery", normalizedQuery != null ? normalizedQuery : "");
            params.addValue("resultCount", resultCount);
            params.addValue("userId", userId);
            params.addValue("storeId", storeId);
            params.addValue("filtersApplied", filtersApplied);
            params.addValue("executionTimeMs", executionTimeMs);

            jdbcTemplate.update(sql, params);
        } catch (Exception ignored) {
            // Analytics logging should never fail user requests
        }
    }
}
