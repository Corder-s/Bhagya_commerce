package com.bhagya.commerce.analytics.dto;

import java.math.BigDecimal;

public record CustomerSummaryResponse(
    long totalCustomers,
    long newCustomers,
    long returningCustomers,
    double repeatCustomerRate,
    BigDecimal averageCustomerValue
) {}
