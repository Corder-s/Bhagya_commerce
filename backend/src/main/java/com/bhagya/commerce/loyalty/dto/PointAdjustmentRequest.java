package com.bhagya.commerce.loyalty.dto;

public record PointAdjustmentRequest(
    String customerId,
    int points, // positive for credit, negative for debit
    String reason // mandatory for audit logging
) {}
