package com.bhagya.commerce.order.dto;

import com.bhagya.commerce.order.domain.OrderStatus;
import java.time.Instant;

public record OrderEventResponse(
    String id,
    OrderStatus status,
    String title,
    String description,
    Instant timestamp
) {}
