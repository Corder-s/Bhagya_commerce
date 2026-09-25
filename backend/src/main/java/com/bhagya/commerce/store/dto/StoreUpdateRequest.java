package com.bhagya.commerce.store.dto;

import com.bhagya.commerce.store.domain.StoreStatus;
import jakarta.validation.constraints.Size;

public record StoreUpdateRequest(
    @Size(min = 2, max = 100)
    String name,

    String craftCategory,
    String story,
    String logoUrl,
    String bannerUrl,
    StoreStatus status,
    String contactEmail,
    String contactPhone
) {}
