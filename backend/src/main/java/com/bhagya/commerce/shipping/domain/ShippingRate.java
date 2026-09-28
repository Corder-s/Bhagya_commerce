package com.bhagya.commerce.shipping.domain;

import java.math.BigDecimal;
import java.time.Instant;

public class ShippingRate {
    private String id;
    private String provider;
    private String serviceCode;
    private String serviceName;
    private String carrier;
    private int estimatedDays;
    private BigDecimal price;
    private String currency;
    private boolean codSupported;
    private String zone;
    private Instant createdAt;

    public ShippingRate() {
        this.currency = "INR";
        this.codSupported = true;
        this.zone = "NATIONAL";
        this.createdAt = Instant.now();
    }

    public ShippingRate(String id, String provider, String serviceCode, String serviceName, String carrier, int estimatedDays, BigDecimal price, boolean codSupported, String zone) {
        this.id = id;
        this.provider = provider;
        this.serviceCode = serviceCode;
        this.serviceName = serviceName;
        this.carrier = carrier;
        this.estimatedDays = estimatedDays;
        this.price = price;
        this.currency = "INR";
        this.codSupported = codSupported;
        this.zone = zone;
        this.createdAt = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }

    public String getServiceCode() { return serviceCode; }
    public void setServiceCode(String serviceCode) { this.serviceCode = serviceCode; }

    public String getServiceName() { return serviceName; }
    public void setServiceName(String serviceName) { this.serviceName = serviceName; }

    public String getCarrier() { return carrier; }
    public void setCarrier(String carrier) { this.carrier = carrier; }

    public int getEstimatedDays() { return estimatedDays; }
    public void setEstimatedDays(int estimatedDays) { this.estimatedDays = estimatedDays; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public boolean isCodSupported() { return codSupported; }
    public void setCodSupported(boolean codSupported) { this.codSupported = codSupported; }

    public String getZone() { return zone; }
    public void setZone(String zone) { this.zone = zone; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
