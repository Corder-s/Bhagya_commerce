package com.bhagya.commerce.common.api;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.Instant;

/**
 * Standard Bhagya Commerce API Envelope
 *
 * @param <T> Payload body type
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ApiResponse<T>(
    boolean success,
    T data,
    String message,
    Instant timestamp,
    String requestId
) {
    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(true, data, "Success", Instant.now(), null);
    }

    public static <T> ApiResponse<T> ok(T data, String message) {
        return new ApiResponse<>(true, data, message, Instant.now(), null);
    }

    public static <T> ApiResponse<T> created(T data, String message) {
        return new ApiResponse<>(true, data, message, Instant.now(), null);
    }
}
