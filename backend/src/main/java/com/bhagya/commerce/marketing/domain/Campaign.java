package com.bhagya.commerce.marketing.domain;

import java.math.BigDecimal;
import java.time.Instant;

public class Campaign {
    private String id;
    private String storeId;
    private String name;
    private String description;
    private CampaignChannel channel;
    private CampaignStatus status;
    private String audienceId;
    private String audienceName;
    private String promotionId;
    private String subject;
    private String messageBody;
    private Instant scheduledAt;
    private Instant startedAt;
    private Instant completedAt;
    private int totalRecipients;
    private int sentCount;
    private int deliveredCount;
    private int failedCount;
    private int attributedOrders;
    private BigDecimal attributedSales;
    private Instant createdAt;
    private Instant updatedAt;

    public Campaign() {
        this.status = CampaignStatus.DRAFT;
        this.totalRecipients = 0;
        this.sentCount = 0;
        this.deliveredCount = 0;
        this.failedCount = 0;
        this.attributedOrders = 0;
        this.attributedSales = BigDecimal.ZERO;
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    public Campaign(
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
        Instant scheduledAt
    ) {
        this.id = id;
        this.storeId = storeId;
        this.name = name;
        this.description = description;
        this.channel = channel;
        this.status = status != null ? status : CampaignStatus.DRAFT;
        this.audienceId = audienceId;
        this.audienceName = audienceName;
        this.promotionId = promotionId;
        this.subject = subject;
        this.messageBody = messageBody;
        this.scheduledAt = scheduledAt;
        this.totalRecipients = 0;
        this.sentCount = 0;
        this.deliveredCount = 0;
        this.failedCount = 0;
        this.attributedOrders = 0;
        this.attributedSales = BigDecimal.ZERO;
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getStoreId() { return storeId; }
    public void setStoreId(String storeId) { this.storeId = storeId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public CampaignChannel getChannel() { return channel; }
    public void setChannel(CampaignChannel channel) { this.channel = channel; }

    public CampaignStatus getStatus() { return status; }
    public void setStatus(CampaignStatus status) { this.status = status; }

    public String getAudienceId() { return audienceId; }
    public void setAudienceId(String audienceId) { this.audienceId = audienceId; }

    public String getAudienceName() { return audienceName; }
    public void setAudienceName(String audienceName) { this.audienceName = audienceName; }

    public String getPromotionId() { return promotionId; }
    public void setPromotionId(String promotionId) { this.promotionId = promotionId; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getMessageBody() { return messageBody; }
    public void setMessageBody(String messageBody) { this.messageBody = messageBody; }

    public Instant getScheduledAt() { return scheduledAt; }
    public void setScheduledAt(Instant scheduledAt) { this.scheduledAt = scheduledAt; }

    public Instant getStartedAt() { return startedAt; }
    public void setStartedAt(Instant startedAt) { this.startedAt = startedAt; }

    public Instant getCompletedAt() { return completedAt; }
    public void setCompletedAt(Instant completedAt) { this.completedAt = completedAt; }

    public int getTotalRecipients() { return totalRecipients; }
    public void setTotalRecipients(int totalRecipients) { this.totalRecipients = totalRecipients; }

    public int getSentCount() { return sentCount; }
    public void setSentCount(int sentCount) { this.sentCount = sentCount; }

    public int getDeliveredCount() { return deliveredCount; }
    public void setDeliveredCount(int deliveredCount) { this.deliveredCount = deliveredCount; }

    public int getFailedCount() { return failedCount; }
    public void setFailedCount(int failedCount) { this.failedCount = failedCount; }

    public int getAttributedOrders() { return attributedOrders; }
    public void setAttributedOrders(int attributedOrders) { this.attributedOrders = attributedOrders; }

    public BigDecimal getAttributedSales() { return attributedSales; }
    public void setAttributedSales(BigDecimal attributedSales) { this.attributedSales = attributedSales; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
