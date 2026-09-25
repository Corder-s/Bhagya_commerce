package com.bhagya.commerce.marketing.domain;

import java.time.Instant;

public class CampaignRecipient {
    private String id;
    private String campaignId;
    private String storeId;
    private String customerId;
    private String customerEmail;
    private String customerPhone;
    private CampaignChannel channel;
    private RecipientDeliveryStatus status;
    private String providerMessageId;
    private int attemptCount;
    private Instant sentAt;
    private Instant deliveredAt;
    private Instant failedAt;
    private String errorMessage;
    private Instant createdAt;

    public CampaignRecipient() {
        this.status = RecipientDeliveryStatus.ELIGIBLE;
        this.attemptCount = 0;
        this.createdAt = Instant.now();
    }

    public CampaignRecipient(
        String id,
        String campaignId,
        String storeId,
        String customerId,
        String customerEmail,
        String customerPhone,
        CampaignChannel channel
    ) {
        this.id = id;
        this.campaignId = campaignId;
        this.storeId = storeId;
        this.customerId = customerId;
        this.customerEmail = customerEmail;
        this.customerPhone = customerPhone;
        this.channel = channel;
        this.status = RecipientDeliveryStatus.ELIGIBLE;
        this.attemptCount = 0;
        this.createdAt = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCampaignId() { return campaignId; }
    public void setCampaignId(String campaignId) { this.campaignId = campaignId; }

    public String getStoreId() { return storeId; }
    public void setStoreId(String storeId) { this.storeId = storeId; }

    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }

    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }

    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }

    public CampaignChannel getChannel() { return channel; }
    public void setChannel(CampaignChannel channel) { this.channel = channel; }

    public RecipientDeliveryStatus getStatus() { return status; }
    public void setStatus(RecipientDeliveryStatus status) { this.status = status; }

    public String getProviderMessageId() { return providerMessageId; }
    public void setProviderMessageId(String providerMessageId) { this.providerMessageId = providerMessageId; }

    public int getAttemptCount() { return attemptCount; }
    public void setAttemptCount(int attemptCount) { this.attemptCount = attemptCount; }

    public Instant getSentAt() { return sentAt; }
    public void setSentAt(Instant sentAt) { this.sentAt = sentAt; }

    public Instant getDeliveredAt() { return deliveredAt; }
    public void setDeliveredAt(Instant deliveredAt) { this.deliveredAt = deliveredAt; }

    public Instant getFailedAt() { return failedAt; }
    public void setFailedAt(Instant failedAt) { this.failedAt = failedAt; }

    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
