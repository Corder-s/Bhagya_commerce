package com.bhagya.commerce.analytics.dto;

public record OpportunitySignalResponse(
    String id,
    String type, // CONVERSION_OPPORTUNITY, INVENTORY_PRESSURE, QUALITY_REVIEW, FEEDBACK_ATTENTION
    String severity, // INFO, WARNING, CRITICAL
    String title,
    String signalDescription,
    String evidence,
    String suggestedAction,
    String entityType, // PRODUCT, CATEGORY, CAMPAIGN
    String entityId,
    String entityName,
    String detectedAt
) {}
