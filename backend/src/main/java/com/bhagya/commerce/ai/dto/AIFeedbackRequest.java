package com.bhagya.commerce.ai.dto;

import jakarta.validation.constraints.NotBlank;

public record AIFeedbackRequest(
    String messageId,
    @NotBlank(message = "Rating is required: HELPFUL or NOT_HELPFUL")
    String rating,
    String feedbackText
) {}
