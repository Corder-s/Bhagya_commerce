package com.bhagya.commerce.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ForgotPasswordRequest(
    @NotBlank(message = "Email or phone number is required")
    @Size(max = 120, message = "Identifier must not exceed 120 characters")
    String emailOrPhone
) {}
