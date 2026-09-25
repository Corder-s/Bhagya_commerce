package com.bhagya.commerce.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record OtpVerifyRequest(
    @NotBlank(message = "Phone number is required")
    String phone,

    @NotBlank(message = "OTP code is required")
    @Pattern(regexp = "^\\d{4,6}$", message = "OTP must be 4 to 6 digits")
    String otp
) {}
