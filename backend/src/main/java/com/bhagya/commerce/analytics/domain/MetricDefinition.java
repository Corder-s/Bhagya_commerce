package com.bhagya.commerce.analytics.domain;

public enum MetricDefinition {
    GROSS_REVENUE("Gross Revenue", "Total value of merchandise ordered before discounts, taxes, or shipping deductions.", "INR", true, "FINANCIAL"),
    DISCOUNTS("Discounts", "Total promotional and coupon deductions applied to orders.", "INR", false, "FINANCIAL"),
    TAXES("Taxes", "Total GST and sales tax collected on behalf of authorities.", "INR", null, "FINANCIAL"),
    SHIPPING_FEES("Shipping Fees", "Delivery charges billed to customers for logistics fulfillment.", "INR", null, "FINANCIAL"),
    REFUND_AMOUNT("Refund Amount", "Total funds returned to customers for cancelled or returned orders.", "INR", false, "FINANCIAL"),
    NET_REVENUE("Net Revenue", "Authoritative net sales recognized: Gross Revenue minus discounts and processed refunds.", "INR", true, "FINANCIAL"),
    ORDER_COUNT("Orders", "Total number of non-cancelled commercial orders placed.", "COUNT", true, "OPERATIONAL"),
    UNITS_SOLD("Units Sold", "Total item quantity delivered or confirmed across all orders.", "COUNT", true, "OPERATIONAL"),
    AVERAGE_ORDER_VALUE("Average Order Value", "Authoritative Net Revenue divided by the count of paid orders.", "INR", true, "FINANCIAL"),
    REFUND_RATE("Refund Rate", "Percentage of orders refunded out of all completed orders.", "PERCENTAGE", false, "OPERATIONAL"),
    CANCELLATION_RATE("Cancellation Rate", "Percentage of orders cancelled prior to or during fulfillment.", "PERCENTAGE", false, "OPERATIONAL"),
    CONVERSION_RATE("Conversion Rate", "Percentage of unique sessions or product views that convert to completed orders.", "PERCENTAGE", true, "MARKETING"),
    REPEAT_PURCHASE_RATE("Repeat Purchase Rate", "Percentage of customers in window who have completed more than 1 order.", "PERCENTAGE", true, "CUSTOMER"),
    CUSTOMER_LIFETIME_VALUE("Historical CLV", "Cumulative recognized net revenue divided by total historical customer count.", "INR", true, "CUSTOMER"),
    INVENTORY_TURNOVER("Inventory Turnover", "Units sold in period relative to current average stock on hand.", "RATIO", true, "INVENTORY"),
    STOCKOUT_RATE("Stockout Rate", "Percentage of catalog items currently with zero available stock.", "PERCENTAGE", false, "INVENTORY"),
    SHIPPING_DELAY_RATE("Shipping Delay Rate", "Percentage of dispatched shipments exceeding carrier SLA or delivery promise.", "PERCENTAGE", false, "FULFILLMENT"),
    PAYMENT_FAILURE_RATE("Payment Failure Rate", "Percentage of started payment sessions that failed or abandoned.", "PERCENTAGE", false, "PAYMENT");

    private final String displayName;
    private final String description;
    private final String unit;
    private final Boolean higherIsBetter;
    private final String domain;

    MetricDefinition(String displayName, String description, String unit, Boolean higherIsBetter, String domain) {
        this.displayName = displayName;
        this.description = description;
        this.unit = unit;
        this.higherIsBetter = higherIsBetter;
        this.domain = domain;
    }

    public String getDisplayName() { return displayName; }
    public String getDescription() { return description; }
    public String getUnit() { return unit; }
    public Boolean getHigherIsBetter() { return higherIsBetter; }
    public String getDomain() { return domain; }
}
