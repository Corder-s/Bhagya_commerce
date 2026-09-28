package com.bhagya.commerce.analytics.dto;

import com.bhagya.commerce.analytics.domain.ComparisonResult;
import com.bhagya.commerce.analytics.domain.MetricDefinition;
import java.math.BigDecimal;

public record CanonicalMetricResult(
    String metricKey,
    String displayName,
    String description,
    BigDecimal value,
    String unit,
    String period,
    ComparisonResult comparison,
    String storeId,
    String calculationFormula,
    String calculatedAt
) {
    public static CanonicalMetricResult of(
        MetricDefinition definition,
        BigDecimal value,
        String period,
        ComparisonResult comparison,
        String storeId,
        String formula
    ) {
        return new CanonicalMetricResult(
            definition.name(),
            definition.getDisplayName(),
            definition.getDescription(),
            value,
            definition.getUnit(),
            period,
            comparison,
            storeId,
            formula,
            java.time.Instant.now().toString()
        );
    }
}
