package com.bhagya.commerce.organization.domain;

import java.time.Instant;

public class Organization {
    private String id;
    private String name;
    private String legalName;
    private String panNumber;
    private String gstin;
    private Instant createdAt;

    public Organization() {}

    public Organization(String id, String name, String legalName, String panNumber, String gstin) {
        this.id = id;
        this.name = name;
        this.legalName = legalName;
        this.panNumber = panNumber;
        this.gstin = gstin;
        this.createdAt = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getLegalName() { return legalName; }
    public void setLegalName(String legalName) { this.legalName = legalName; }

    public String getPanNumber() { return panNumber; }
    public void setPanNumber(String panNumber) { this.panNumber = panNumber; }

    public String getGstin() { return gstin; }
    public void setGstin(String gstin) { this.gstin = gstin; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
