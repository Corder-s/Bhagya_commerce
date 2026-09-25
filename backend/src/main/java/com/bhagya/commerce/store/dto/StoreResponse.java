package com.bhagya.commerce.store.dto;

import com.bhagya.commerce.store.domain.StoreStatus;
import java.time.Instant;

public record StoreResponse(
    String id,
    String organizationId,
    String name,
    String slug,
    String craftCategory,
    String story,
    String logoUrl,
    String bannerUrl,
    StoreStatus status,
    String contactEmail,
    String contactPhone,
    Instant createdAt
) {}
