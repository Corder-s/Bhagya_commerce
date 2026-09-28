package com.bhagya.commerce.storefront.domain;

import java.time.Instant;

public class StoreDomain {

    private String id;
    private String storeId;
    private String domain;
    private DomainType type = DomainType.CUSTOM_DOMAIN;
    private DomainStatus status = DomainStatus.PENDING;
    private boolean isPrimary = false;
    private String verificationToken;
    private String verificationMethod = "DNS_TXT";
    private Instant verifiedAt;
    private String sslStatus = "PENDING";
    private Instant createdAt = Instant.now();
    private Instant updatedAt = Instant.now();

    public StoreDomain() {}

    public StoreDomain(String id, String storeId, String domain, DomainType type) {
        this.id = id;
        this.storeId = storeId;
        this.domain = domain;
        this.type = type;
        this.status = DomainStatus.PENDING;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getStoreId() { return storeId; }
    public void setStoreId(String storeId) { this.storeId = storeId; }

    public String getDomain() { return domain; }
    public void setDomain(String domain) { this.domain = domain; }

    public DomainType getType() { return type; }
    public void setType(DomainType type) { this.type = type; }

    public DomainStatus getStatus() { return status; }
    public void setStatus(DomainStatus status) { this.status = status; }

    public boolean isPrimary() { return isPrimary; }
    public void setPrimary(boolean primary) { isPrimary = primary; }

    public String getVerificationToken() { return verificationToken; }
    public void setVerificationToken(String verificationToken) { this.verificationToken = verificationToken; }

    public String getVerificationMethod() { return verificationMethod; }
    public void setVerificationMethod(String verificationMethod) { this.verificationMethod = verificationMethod; }

    public Instant getVerifiedAt() { return verifiedAt; }
    public void setVerifiedAt(Instant verifiedAt) { this.verifiedAt = verifiedAt; }

    public String getSslStatus() { return sslStatus; }
    public void setSslStatus(String sslStatus) { this.sslStatus = sslStatus; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
