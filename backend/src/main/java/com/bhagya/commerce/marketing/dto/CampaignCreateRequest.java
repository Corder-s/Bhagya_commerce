package com.bhagya.commerce.marketing.dto;

import com.bhagya.commerce.marketing.domain.CampaignChannel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;

public record CampaignCreateRequest(
    @NotBlank(message = "Campaign name is required")
    String name,
    String description,
    @NotNull(message = "Channel is required")
    CampaignChannel channel,
    String audienceId,
    String audienceName,
    String promotionId,
    String subject,
    @NotBlank(message = "Message body is required")
    String messageBody,
    Instant scheduledAt
) {}
