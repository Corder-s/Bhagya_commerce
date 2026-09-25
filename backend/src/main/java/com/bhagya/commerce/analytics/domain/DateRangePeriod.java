package com.bhagya.commerce.analytics.domain;

public enum DateRangePeriod {
    TODAY,
    DAYS_7,
    DAYS_30,
    DAYS_90,
    CUSTOM;

    public static DateRangePeriod fromString(String value) {
        if (value == null || value.isBlank()) {
            return DAYS_30;
        }
        try {
            return DateRangePeriod.valueOf(value.toUpperCase().replace("-", "_"));
        } catch (IllegalArgumentException e) {
            return switch (value.toLowerCase()) {
                case "today", "1d" -> TODAY;
                case "7d", "week", "7days" -> DAYS_7;
                case "30d", "month", "30days" -> DAYS_30;
                case "90d", "quarter", "90days" -> DAYS_90;
                default -> DAYS_30;
            };
        }
    }
}
