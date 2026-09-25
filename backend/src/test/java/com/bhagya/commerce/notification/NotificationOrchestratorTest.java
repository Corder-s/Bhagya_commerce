package com.bhagya.commerce.notification;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.bhagya.commerce.common.queue.JobQueue;
import com.bhagya.commerce.notification.dto.NotificationResponse;
import com.bhagya.commerce.notification.repository.InMemoryNotificationRepository;
import com.bhagya.commerce.notification.service.NotificationOrchestrator;
import com.bhagya.commerce.notification.service.NotificationService;
import java.math.BigDecimal;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class NotificationOrchestratorTest {

    private NotificationService notificationService;
    private JobQueue jobQueue;
    private NotificationOrchestrator orchestrator;

    @BeforeEach
    void setUp() {
        notificationService = new NotificationService(new InMemoryNotificationRepository());
        jobQueue = new JobQueue(null);
        orchestrator = new NotificationOrchestrator(notificationService, jobQueue);
    }

    @Test
    @DisplayName("Should create in-app notification and enqueue email, whatsapp, and sms async jobs")
    void testOrderConfirmedDispatchesMultiChannel() {
        orchestrator.handleOrderConfirmed(
            "usr_cust_1",
            "Aarav Sharma",
            "aarav@example.com",
            "+919876543210",
            "BG-20260926-881902",
            BigDecimal.valueOf(12499)
        );

        // In-app notification created
        List<NotificationResponse> list = notificationService.getNotificationsForUser("usr_cust_1");
        assertTrue(list.stream().anyMatch(n -> n.title().contains("Order Confirmed")));

        // Async job queue has 3 jobs (Email + WhatsApp + SMS)
        assertEquals(3, jobQueue.size());
    }
}
