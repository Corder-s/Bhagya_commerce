package com.bhagya.commerce.team.domain;

public enum PermissionCode {
    // Products & Inventory
    PRODUCT_VIEW,
    PRODUCT_CREATE,
    PRODUCT_UPDATE,
    PRODUCT_DELETE,
    INVENTORY_VIEW,
    INVENTORY_UPDATE,

    // Orders & Shipping
    ORDER_VIEW,
    ORDER_UPDATE,
    ORDER_CANCEL,
    ORDER_REFUND,
    SHIPPING_VIEW,
    SHIPPING_MANAGE,

    // Customer & Reviews
    CUSTOMER_VIEW,
    REVIEWS_VIEW,
    REVIEWS_MODERATE,
    REVIEWS_RESPOND,

    // Marketing & Growth
    MARKETING_VIEW,
    MARKETING_CREATE,
    MARKETING_UPDATE,
    ANALYTICS_VIEW,

    // Storefront & Settings
    STOREFRONT_VIEW,
    STOREFRONT_UPDATE,
    STOREFRONT_PUBLISH,
    STORE_VIEW,
    STORE_UPDATE,

    // Team & Organization Management
    TEAM_VIEW,
    TEAM_INVITE,
    TEAM_UPDATE,
    TEAM_REMOVE,

    // Billing & Subscriptions
    BILLING_VIEW,
    BILLING_MANAGE,

    // Loyalty, Rewards & Referrals
    LOYALTY_VIEW,
    LOYALTY_MANAGE,
    REWARD_CREATE,
    REWARD_UPDATE,
    REWARD_DELETE,
    LOYALTY_ADJUST,
    REFERRAL_MANAGE,
    LOYALTY_ANALYTICS_VIEW
}
