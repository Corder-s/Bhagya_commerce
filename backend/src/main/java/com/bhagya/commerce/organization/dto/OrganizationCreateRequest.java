package com.bhagya.commerce.organization.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record OrganizationCreateRequest(
    @NotBlank(message = "Organization name is required")
    @Size(min = 2, max = 255)
    String name,

    String legalName,
    String panNumber,
    String gstin
) {}
