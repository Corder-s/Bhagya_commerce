package com.bhagya.commerce.analytics.domain;

/**
 * Transparent, non-sensitive commerce behavioral segments.
 * Strictly avoids sensitive demographics (religion, race, health, politics).
 */
public enum CustomerSegmentType {
    NEW_CUSTOMER("New Patrons", "Acquired within the current window with 1 completed order.", "Recency <= 30d, Orders = 1"),
    RETURNING_CUSTOMER("Returning Patrons", "Customers with 2 or more orders placed across their history.", "Orders >= 2"),
    HIGH_VALUE("High-Value Patrons", "Top tier spenders with cumulative spend significantly above store average.", "Monetary top 20%"),
    FREQUENT_BUYER("Frequent Buyers", "Patrons with high order frequency and repeated engagements.", "Frequency >= 3 orders"),
    RECENTLY_ACTIVE("Recently Active", "Patrons who placed an order within the last 14 days.", "Recency <= 14d"),
    AT_RISK("At Risk of Churn", "Historically valuable customers with no purchases in the last 60-90 days.", "Prior orders >= 2, Recency > 60d"),
    INACTIVE("Inactive", "No purchase activity in the last 90+ days.", "Recency > 90d");

    private final String title;
    private final String description;
    private final String behavioralRule;

    CustomerSegmentType(String title, String description, String behavioralRule) {
        this.title = title;
        this.description = description;
        this.behavioralRule = behavioralRule;
    }

    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getBehavioralRule() { return behavioralRule; }
}
