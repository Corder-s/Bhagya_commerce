package com.bhagya.commerce.notification.dto;

import com.bhagya.commerce.notification.domain.Notification;
import com.bhagya.commerce.notification.domain.NotificationType;
import java.time.Instant;

public record NotificationResponse(
    String id,
    String title,
    String message,
    NotificationType type,
    String link,
    boolean read,
    Instant createdAt
) {
    public static NotificationResponse fromDomain(Notification notification) {
        return new NotificationResponse(
            notification.getId(),
            notification.getTitle(),
            notification.getMessage(),
            notification.getType(),
            notification.getLink(),
            notification.isRead(),
            notification.getCreatedAt()
        );
    }
}
