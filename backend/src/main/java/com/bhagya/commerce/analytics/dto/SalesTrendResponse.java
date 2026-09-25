package com.bhagya.commerce.analytics.dto;

import java.util.List;

public record SalesTrendResponse(
    String period,
    List<SalesTrendPoint> trendPoints
) {}
