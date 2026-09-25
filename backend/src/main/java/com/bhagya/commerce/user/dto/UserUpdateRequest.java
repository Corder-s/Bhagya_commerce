package com.bhagya.commerce.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record UserUpdateRequest(
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    String name,

    @Email(message = "Please provide a valid email address")
    String email,

    String avatarUrl
) {}
