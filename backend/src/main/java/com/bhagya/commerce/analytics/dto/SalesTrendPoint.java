package com.bhagya.commerce.analytics.dto;

import java.math.BigDecimal;

public record SalesTrendPoint(
    String date,
    BigDecimal grossSales,
    BigDecimal netSales,
    long orderCount
) {}
