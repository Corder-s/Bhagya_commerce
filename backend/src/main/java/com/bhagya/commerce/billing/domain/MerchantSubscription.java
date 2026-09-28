package com.bhagya.commerce.billing.domain;

import java.time.Instant;

public class MerchantSubscription {
    private String id;
    private String organizationId;
    private String planId;
    private String planName;
    private String status; // TRIALING, ACTIVE, PAST_DUE, PAUSED, CANCELLED, EXPIRED
    private String billingInterval; // MONTHLY, YEARLY
    private String provider; // MOCK_RAZORPAY, STRIPE
    private String providerSubscriptionId;
    private Instant currentPeriodStart;
    private Instant currentPeriodEnd;
    private boolean cancelAtPeriodEnd;
    private Instant createdAt;
    private Instant updatedAt;

    public MerchantSubscription() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getOrganizationId() { return organizationId; }
    public void setOrganizationId(String organizationId) { this.organizationId = organizationId; }

    public String getPlanId() { return planId; }
    public void setPlanId(String planId) { this.planId = planId; }

    public String getPlanName() { return planName; }
    public void setPlanName(String planName) { this.planName = planName; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getBillingInterval() { return billingInterval; }
    public void setBillingInterval(String billingInterval) { this.billingInterval = billingInterval; }

    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }

    public String getProviderSubscriptionId() { return providerSubscriptionId; }
    public void setProviderSubscriptionId(String providerSubscriptionId) { this.providerSubscriptionId = providerSubscriptionId; }

    public Instant getCurrentPeriodStart() { return currentPeriodStart; }
    public void setCurrentPeriodStart(Instant currentPeriodStart) { this.currentPeriodStart = currentPeriodStart; }

    public Instant getCurrentPeriodEnd() { return currentPeriodEnd; }
    public void setCurrentPeriodEnd(Instant currentPeriodEnd) { this.currentPeriodEnd = currentPeriodEnd; }

    public boolean isCancelAtPeriodEnd() { return cancelAtPeriodEnd; }
    public void setCancelAtPeriodEnd(boolean cancelAtPeriodEnd) { this.cancelAtPeriodEnd = cancelAtPeriodEnd; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
