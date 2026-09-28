package com.bhagya.commerce.shipping.domain;

import java.time.Instant;

public class ShippingLabel {
    private String id;
    private String shipmentId;
    private String storageKey;
    private String mimeType;
    private String barcode;
    private String downloadUrl;
    private Instant createdAt;

    public ShippingLabel() {
        this.mimeType = "application/pdf";
        this.createdAt = Instant.now();
    }

    public ShippingLabel(String id, String shipmentId, String storageKey, String barcode, String downloadUrl) {
        this.id = id;
        this.shipmentId = shipmentId;
        this.storageKey = storageKey;
        this.mimeType = "application/pdf";
        this.barcode = barcode;
        this.downloadUrl = downloadUrl;
        this.createdAt = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getShipmentId() { return shipmentId; }
    public void setShipmentId(String shipmentId) { this.shipmentId = shipmentId; }

    public String getStorageKey() { return storageKey; }
    public void setStorageKey(String storageKey) { this.storageKey = storageKey; }

    public String getMimeType() { return mimeType; }
    public void setMimeType(String mimeType) { this.mimeType = mimeType; }

    public String getBarcode() { return barcode; }
    public void setBarcode(String barcode) { this.barcode = barcode; }

    public String getDownloadUrl() { return downloadUrl; }
    public void setDownloadUrl(String downloadUrl) { this.downloadUrl = downloadUrl; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
