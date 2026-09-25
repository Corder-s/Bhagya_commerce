package com.bhagya.commerce.notification.service;

import com.bhagya.commerce.common.queue.JobMessage;
import com.bhagya.commerce.common.queue.JobQueue;
import com.bhagya.commerce.common.queue.JobType;
import com.bhagya.commerce.notification.domain.NotificationType;
import com.bhagya.commerce.notification.template.EmailTemplateBuilder;
import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class NotificationOrchestrator {

    private static final Logger log = LoggerFactory.getLogger(NotificationOrchestrator.class);

    private final NotificationService notificationService;
    private final JobQueue jobQueue;

    public NotificationOrchestrator(NotificationService notificationService, JobQueue jobQueue) {
        this.notificationService = notificationService;
        this.jobQueue = jobQueue;
    }

    public void handleOrderConfirmed(String userId, String customerName, String customerEmail, String customerPhone, String orderNumber, BigDecimal totalAmount) {
        log.info("[NOTIFICATION] Orchestrating ORDER_CONFIRMED for userId={} orderNumber={}", userId, orderNumber);

        // 1. Authoritative In-App Notification
        String title = "Order Confirmed & Verified! ✨";
        String message = "Your order #" + orderNumber + " for ₹" + (totalAmount != null ? totalAmount.toPlainString() : "0.00") + " is confirmed and assigned to artisan workshop.";
        notificationService.createNotification(userId, title, message, NotificationType.ORDER, "/orders/" + orderNumber);

        // 2. Asynchronous Email Job (via Redis Queue)
        if (customerEmail != null && !customerEmail.isBlank()) {
            String html = EmailTemplateBuilder.buildOrderConfirmedHtml(customerName, orderNumber, totalAmount, "https://bhagya.commerce/orders/" + orderNumber);
            JobMessage emailJob = JobMessage.create(
                "job_email_" + UUID.randomUUID().toString().substring(0, 8),
                JobType.SEND_EMAIL,
                Map.of(
                    "userId", userId,
                    "toEmail", customerEmail,
                    "subject", "Order Confirmed #" + orderNumber + " — Bhagya Commerce",
                    "htmlBody", html,
                    "orderNumber", orderNumber
                )
            );
            jobQueue.enqueue(emailJob);
        }

        // 3. Asynchronous WhatsApp Job
        if (customerPhone != null && !customerPhone.isBlank()) {
            JobMessage waJob = JobMessage.create(
                "job_wa_" + UUID.randomUUID().toString().substring(0, 8),
                JobType.SEND_WHATSAPP,
                Map.of(
                    "userId", userId,
                    "phone", customerPhone,
                    "template", "order_confirmed_v1",
                    "vars", Map.of("1", customerName != null ? customerName : "Customer", "2", orderNumber, "3", "Delhivery Express")
                )
            );
            jobQueue.enqueue(waJob);
        }

        // 4. Asynchronous SMS Job
        if (customerPhone != null && !customerPhone.isBlank()) {
            String smsBody = "Namaste! Order #" + orderNumber + " is confirmed. Track live: https://bhagya.commerce/orders/" + orderNumber + " - Bhagya Commerce";
            JobMessage smsJob = JobMessage.create(
                "job_sms_" + UUID.randomUUID().toString().substring(0, 8),
                JobType.SEND_SMS,
                Map.of(
                    "userId", userId,
                    "phone", customerPhone,
                    "message", smsBody
                )
            );
            jobQueue.enqueue(smsJob);
        }
    }

    public void handlePaymentFailed(String userId, String orderNumber, String reason) {
        String title = "Payment Authorization Incomplete ⚠️";
        String message = "Payment for order #" + orderNumber + " was not completed: " + (reason != null ? reason : "Transaction cancelled");
        notificationService.createNotification(userId, title, message, NotificationType.PAYMENT, "/checkout");
    }

    public void handleRefundCompleted(String userId, String orderNumber, BigDecimal amount) {
        String title = "Refund Processed Successfully 💳";
        String message = "A refund of ₹" + amount.toPlainString() + " for order #" + orderNumber + " has been initiated to your original payment source.";
        notificationService.createNotification(userId, title, message, NotificationType.PAYMENT, "/account/orders");
    }
}
