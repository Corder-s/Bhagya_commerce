package com.bhagya.commerce.store.dto;

public record PublicStoreResponse(
    String id,
    String name,
    String slug,
    String craftCategory,
    String story,
    String logoUrl,
    String bannerUrl
) {}
