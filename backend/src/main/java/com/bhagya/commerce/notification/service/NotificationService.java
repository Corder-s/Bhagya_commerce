package com.bhagya.commerce.notification.service;

import com.bhagya.commerce.common.error.ForbiddenException;
import com.bhagya.commerce.common.error.ResourceNotFoundException;
import com.bhagya.commerce.notification.domain.Notification;
import com.bhagya.commerce.notification.domain.NotificationType;
import com.bhagya.commerce.notification.dto.NotificationResponse;
import com.bhagya.commerce.notification.dto.UnreadCountResponse;
import com.bhagya.commerce.notification.repository.NotificationRepository;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public List<NotificationResponse> getNotificationsForUser(String userId) {
        return notificationRepository.findByUserId(userId).stream()
            .map(NotificationResponse::fromDomain)
            .collect(Collectors.toList());
    }

    public UnreadCountResponse getUnreadCount(String userId) {
        long count = notificationRepository.countUnreadByUserId(userId);
        return new UnreadCountResponse(count);
    }

    public NotificationResponse markAsRead(String notificationId, String userId) {
        Notification notification = notificationRepository.findById(notificationId)
            .orElseThrow(() -> new ResourceNotFoundException("Notification not found: " + notificationId));

        if (!notification.getUserId().equals(userId)) {
            throw new ForbiddenException("You are not authorized to update this notification.");
        }

        notification.setRead(true);
        notificationRepository.save(notification);
        return NotificationResponse.fromDomain(notification);
    }

    public void markAllAsRead(String userId) {
        notificationRepository.markAllAsReadByUserId(userId);
    }

    public void createNotification(String userId, String title, String message, NotificationType type, String link) {
        Notification notification = new Notification(
            "notif_" + UUID.randomUUID().toString().substring(0, 8),
            userId,
            title,
            message,
            type,
            link,
            false,
            Instant.now()
        );
        notificationRepository.save(notification);
    }
}
