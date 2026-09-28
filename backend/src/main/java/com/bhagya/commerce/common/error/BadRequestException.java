package com.bhagya.commerce.common.error;

import org.springframework.http.HttpStatus;

public class BadRequestException extends ApiException {
    public BadRequestException(String message) {
        super(ErrorCode.VALIDATION_FAILED, message, HttpStatus.BAD_REQUEST);
    }

    public BadRequestException(ErrorCode errorCode, String message) {
        super(errorCode, message, HttpStatus.BAD_REQUEST);
    }
}
