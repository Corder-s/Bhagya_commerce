package com.bhagya.commerce.organization.dto;

import java.time.Instant;

public record OrganizationResponse(
    String id,
    String name,
    String legalName,
    String panNumber,
    String gstin,
    Instant createdAt
) {}
