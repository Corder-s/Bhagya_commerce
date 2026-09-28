package com.bhagya.commerce.review.dto;

public record ReviewModerationActionRequest(
    String action, // APPROVE, REJECT, HIDE
    String reason
) {}
