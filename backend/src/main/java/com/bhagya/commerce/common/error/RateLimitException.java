package com.bhagya.commerce.common.error;

import org.springframework.http.HttpStatus;

public class RateLimitException extends ApiException {

    public RateLimitException(String message) {
        super(ErrorCode.RATE_LIMIT_EXCEEDED, message, HttpStatus.TOO_MANY_REQUESTS);
    }
}
