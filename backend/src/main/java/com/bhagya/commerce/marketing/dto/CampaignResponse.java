package com.bhagya.commerce.marketing.dto;

import com.bhagya.commerce.marketing.domain.Campaign;
import com.bhagya.commerce.marketing.domain.CampaignChannel;
import com.bhagya.commerce.marketing.domain.CampaignStatus;
import java.math.BigDecimal;
import java.time.Instant;

public record CampaignResponse(
    String id,
    String storeId,
    String name,
    String description,
    CampaignChannel channel,
    CampaignStatus status,
    String audienceId,
    String audienceName,
    String promotionId,
    String subject,
    String messageBody,
    Instant scheduledAt,
    Instant startedAt,
    Instant completedAt,
    int totalRecipients,
    int sentCount,
    int deliveredCount,
    int failedCount,
    int attributedOrders,
    BigDecimal attributedSales,
    Instant createdAt
) {
    public static CampaignResponse fromDomain(Campaign c) {
        return new CampaignResponse(
            c.getId(),
            c.getStoreId(),
            c.getName(),
            c.getDescription(),
            c.getChannel(),
            c.getStatus(),
            c.getAudienceId(),
            c.getAudienceName(),
            c.getPromotionId(),
            c.getSubject(),
            c.getMessageBody(),
            c.getScheduledAt(),
            c.getStartedAt(),
            c.getCompletedAt(),
            c.getTotalRecipients(),
            c.getSentCount(),
            c.getDeliveredCount(),
            c.getFailedCount(),
            c.getAttributedOrders(),
            c.getAttributedSales(),
            c.getCreatedAt()
        );
    }
}
