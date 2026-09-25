package com.bhagya.commerce.analytics.dto;

public record OrderSummaryResponse(
    long totalOrders,
    long confirmedOrders,
    long processingOrders,
    long shippedOrders,
    long deliveredOrders,
    long cancelledOrders,
    long refundedOrders,
    double cancellationRate,
    double refundRate
) {}
