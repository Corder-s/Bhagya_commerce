package com.bhagya.commerce.marketing.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.Map;

public record CustomerSegmentCreateRequest(
    @NotBlank(message = "Segment name is required")
    String name,
    String description,
    Map<String, Object> criteria
) {}
