package com.bhagya.commerce.review.dto;

public record ReviewReportRequest(
    String reason, // SPAM, ABUSE, HARASSMENT, FAKE_CONTENT, OFF_TOPIC, OTHER
    String description
) {}
