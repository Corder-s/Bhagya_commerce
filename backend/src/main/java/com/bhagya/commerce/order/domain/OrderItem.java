package com.bhagya.commerce.order.domain;

import java.math.BigDecimal;

public class OrderItem {
    private String id;
    private String orderId;
    private String productId;
    private String productName;
    private String productImageUrl;
    private BigDecimal unitPriceInr;
    private int quantity;
    private BigDecimal totalInr;

    public OrderItem() {}

    public OrderItem(String id, String productId, String productName, String productImageUrl, BigDecimal unitPriceInr, int quantity) {
        this.id = id;
        this.productId = productId;
        this.productName = productName;
        this.productImageUrl = productImageUrl;
        this.unitPriceInr = unitPriceInr;
        this.quantity = quantity;
        this.totalInr = unitPriceInr.multiply(BigDecimal.valueOf(quantity));
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }

    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getProductImageUrl() { return productImageUrl; }
    public void setProductImageUrl(String productImageUrl) { this.productImageUrl = productImageUrl; }

    public BigDecimal getUnitPriceInr() { return unitPriceInr; }
    public void setUnitPriceInr(BigDecimal unitPriceInr) { this.unitPriceInr = unitPriceInr; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public BigDecimal getTotalInr() { return totalInr; }
    public void setTotalInr(BigDecimal totalInr) { this.totalInr = totalInr; }
}
