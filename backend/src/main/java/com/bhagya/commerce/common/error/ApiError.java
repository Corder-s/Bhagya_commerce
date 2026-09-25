package com.bhagya.commerce.common.error;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.Instant;
import java.util.List;

/**
 * Standard Error Response Model
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ApiError(
    boolean success,
    ErrorCode code,
    String message,
    List<ValidationError> errors,
    Instant timestamp,
    String requestId
) {
    public static ApiError of(ErrorCode code, String message, String requestId) {
        return new ApiError(false, code, message, null, Instant.now(), requestId);
    }

    public static ApiError withValidation(String message, List<ValidationError> errors, String requestId) {
        return new ApiError(false, ErrorCode.VALIDATION_FAILED, message, errors, Instant.now(), requestId);
    }

    public record ValidationError(String field, String message) {}
}
