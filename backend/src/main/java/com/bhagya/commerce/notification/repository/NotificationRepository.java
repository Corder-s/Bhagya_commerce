package com.bhagya.commerce.notification.repository;

import com.bhagya.commerce.notification.domain.Notification;
import java.util.List;
import java.util.Optional;

public interface NotificationRepository {
    List<Notification> findByUserId(String userId);
    Optional<Notification> findById(String id);
    Notification save(Notification notification);
    long countUnreadByUserId(String userId);
    void markAllAsReadByUserId(String userId);
}
