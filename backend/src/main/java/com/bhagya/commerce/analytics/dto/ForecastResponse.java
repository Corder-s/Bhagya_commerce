package com.bhagya.commerce.analytics.dto;

import java.math.BigDecimal;
import java.util.List;

public record ForecastResponse(
    String storeId,
    String metricKey,
    String metricDisplayName,
    int horizonDays,
    BigDecimal forecastValue,
    BigDecimal lowerBound,
    BigDecimal upperBound,
    String method,
    int trainingWindowDays,
    BigDecimal meanAbsoluteError,
    String confidenceIntervalLabel,
    String limitationsNotice,
    List<ForecastDataPoint> trajectory,
    String generatedAt
) {
    public record ForecastDataPoint(
        String date,
        BigDecimal projectedValue,
        BigDecimal lowerBand,
        BigDecimal upperBand
    ) {}
}
