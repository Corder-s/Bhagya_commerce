package com.bhagya.commerce.analytics.dto;

import java.math.BigDecimal;

public record TrafficSourcePoint(
    String source,
    String medium,
    String campaign,
    long sessions,
    long orders,
    BigDecimal revenue
) {}
