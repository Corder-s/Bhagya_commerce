package com.bhagya.commerce.common.error;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Global Exception Handler for all REST APIs.
 *
 * Guarantees consistent error envelopes without exposing stack traces,
 * database internals, or sensitive credentials to callers.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ApiError> handleApiException(ApiException ex, HttpServletRequest request) {
        String requestId = (String) request.getAttribute("X-Request-Id");
        log.warn("API Exception [{}]: {}", ex.getErrorCode(), ex.getMessage());
        return ResponseEntity
            .status(ex.getStatus())
            .body(ApiError.of(ex.getErrorCode(), ex.getMessage(), requestId));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidationException(MethodArgumentNotValidException ex, HttpServletRequest request) {
        String requestId = (String) request.getAttribute("X-Request-Id");
        List<ApiError.ValidationError> fieldErrors = ex.getBindingResult().getFieldErrors().stream()
            .map(err -> new ApiError.ValidationError(err.getField(), err.getDefaultMessage()))
            .toList();

        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(ApiError.withValidation("Request validation failed", fieldErrors, requestId));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiError> handleAccessDenied(AccessDeniedException ex, HttpServletRequest request) {
        String requestId = (String) request.getAttribute("X-Request-Id");
        return ResponseEntity
            .status(HttpStatus.FORBIDDEN)
            .body(ApiError.of(ErrorCode.FORBIDDEN, "You do not have permission to perform this action.", requestId));
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiError> handleAuthenticationException(AuthenticationException ex, HttpServletRequest request) {
        String requestId = (String) request.getAttribute("X-Request-Id");
        return ResponseEntity
            .status(HttpStatus.UNAUTHORIZED)
            .body(ApiError.of(ErrorCode.UNAUTHORIZED, "Authentication required.", requestId));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleGenericException(Exception ex, HttpServletRequest request) {
        String requestId = (String) request.getAttribute("X-Request-Id");
        log.error("Unhandled server error [requestId={}]: ", requestId, ex);
        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ApiError.of(ErrorCode.INTERNAL_SERVER_ERROR, "An unexpected error occurred. Please try again.", requestId));
    }
}
