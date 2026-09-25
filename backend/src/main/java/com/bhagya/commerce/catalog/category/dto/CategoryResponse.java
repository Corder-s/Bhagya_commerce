package com.bhagya.commerce.catalog.category.dto;

public record CategoryResponse(
    String id,
    String slug,
    String name,
    String descriptor,
    String tone,
    String imageUrl
) {}
