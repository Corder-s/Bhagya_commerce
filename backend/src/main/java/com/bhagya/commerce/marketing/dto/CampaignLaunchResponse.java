package com.bhagya.commerce.marketing.dto;

import java.time.Instant;

public record CampaignLaunchResponse(
    String campaignId,
    String status,
    int queuedRecipients,
    Instant launchedAt,
    String message
) {}
