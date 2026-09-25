package com.bhagya.commerce.store.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record StoreCreateRequest(
    @NotBlank(message = "Organization ID is required")
    String organizationId,

    @NotBlank(message = "Store name is required")
    @Size(min = 2, max = 100)
    String name,

    @NotBlank(message = "Store URL slug is required")
    @Pattern(regexp = "^[a-z0-9-]+$", message = "Slug must contain only lowercase letters, numbers, and hyphens")
    String slug,

    @NotBlank(message = "Craft category is required")
    String craftCategory,

    String story,
    String logoUrl,
    String bannerUrl,
    String contactEmail,
    String contactPhone
) {}
