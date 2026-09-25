package com.bhagya.commerce.notification.repository;

import com.bhagya.commerce.notification.domain.Notification;
import com.bhagya.commerce.notification.domain.NotificationType;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;
import org.springframework.stereotype.Repository;

/**
 * Development-only In-Memory Notification repository.
 * In Step 12, this is backed by PostgreSQL.
 */
@Repository
public class InMemoryNotificationRepository implements NotificationRepository {

    private final Map<String, Notification> store = new ConcurrentHashMap<>();

    public InMemoryNotificationRepository() {
        seedSampleNotifications();
    }

    private void seedSampleNotifications() {
        Notification n1 = new Notification(
            "notif_1",
            "usr_cust_1",
            "Order Out for Delivery! 🚚",
            "Your order BG-20260925-884102 is out for delivery with Delhivery Express.",
            NotificationType.SHIPMENT,
            "/orders/ord_101",
            false,
            Instant.now().minus(30, ChronoUnit.MINUTES)
        );
        Notification n2 = new Notification(
            "notif_2",
            "usr_cust_1",
            "Payment Confirmed ✅",
            "Payment of ₹12,499 for your Handloom Banarasi Katan Silk Saree was captured successfully.",
            NotificationType.PAYMENT,
            "/orders/ord_101",
            true,
            Instant.now().minus(14, ChronoUnit.HOURS)
        );
        Notification n3 = new Notification(
            "notif_3",
            "usr_cust_1",
            "Navratri Heritage Collection is Live ✨",
            "Discover GI-tagged artisan craftworks and handwoven silks directly from master weavers.",
            NotificationType.PROMOTION,
            "/shop",
            false,
            Instant.now().minus(2, ChronoUnit.DAYS)
        );

        store.put(n1.getId(), n1);
        store.put(n2.getId(), n2);
        store.put(n3.getId(), n3);
    }

    @Override
    public List<Notification> findByUserId(String userId) {
        return store.values().stream()
            .filter(n -> n.getUserId().equals(userId))
            .sorted(Comparator.comparing(Notification::getCreatedAt).reversed())
            .collect(Collectors.toList());
    }

    @Override
    public Optional<Notification> findById(String id) {
        return Optional.ofNullable(store.get(id));
    }

    @Override
    public Notification save(Notification notification) {
        store.put(notification.getId(), notification);
        return notification;
    }

    @Override
    public long countUnreadByUserId(String userId) {
        return store.values().stream()
            .filter(n -> n.getUserId().equals(userId) && !n.isRead())
            .count();
    }

    @Override
    public void markAllAsReadByUserId(String userId) {
        store.values().stream()
            .filter(n -> n.getUserId().equals(userId))
            .forEach(n -> n.setRead(true));
    }
}
