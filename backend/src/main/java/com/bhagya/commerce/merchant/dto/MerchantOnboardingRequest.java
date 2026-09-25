package com.bhagya.commerce.merchant.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record MerchantOnboardingRequest(
    @NotBlank(message = "Business name is required")
    @Size(min = 2, max = 100, message = "Business name must be between 2 and 100 characters")
    String businessName,

    @NotBlank(message = "GSTIN or PAN is required")
    String gstOrPan,

    @NotBlank(message = "Category is required")
    String businessCategory,

    String pickupAddress,
    String bankAccountNumber,
    String bankIfsc
) {}
