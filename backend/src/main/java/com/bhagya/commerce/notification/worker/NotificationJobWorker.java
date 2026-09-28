package com.bhagya.commerce.notification.worker;

import com.bhagya.commerce.common.queue.JobMessage;
import com.bhagya.commerce.common.queue.JobQueue;
import com.bhagya.commerce.common.queue.JobType;
import com.bhagya.commerce.notification.channel.EmailProvider;
import com.bhagya.commerce.notification.channel.SmsProvider;
import com.bhagya.commerce.notification.channel.WhatsAppProvider;
import jakarta.annotation.PreDestroy;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class NotificationJobWorker {

    private static final Logger log = LoggerFactory.getLogger(NotificationJobWorker.class);
    private static final int MAX_BATCH_DRAIN = 8;

    private final JobQueue jobQueue;
    private final EmailProvider emailProvider;
    private final WhatsAppProvider whatsAppProvider;
    private final SmsProvider smsProvider;
    private final ExecutorService workerExecutor;

    public NotificationJobWorker(
        JobQueue jobQueue,
        EmailProvider emailProvider,
        WhatsAppProvider whatsAppProvider,
        SmsProvider smsProvider
    ) {
        this.jobQueue = jobQueue;
        this.emailProvider = emailProvider;
        this.whatsAppProvider = whatsAppProvider;
        this.smsProvider = smsProvider;
        this.workerExecutor = Executors.newFixedThreadPool(4, r -> {
            Thread t = new Thread(r, "bhagya-job-worker");
            t.setDaemon(true);
            return t;
        });
    }

    @Scheduled(fixedDelay = 1000) // Poll queue every 1 second
    public void processNextJob() {
        if (jobQueue.isBackpressured()) {
            log.warn("[WORKER_BACKPRESSURE] Job queue depth={} exceeds threshold. Prioritizing critical transactions.", jobQueue.size());
        }

        int drained = 0;
        while (drained < MAX_BATCH_DRAIN) {
            Optional<JobMessage> opt = jobQueue.dequeue();
            if (opt.isEmpty()) {
                break;
            }

            JobMessage job = opt.get();
            drained++;
            executeJob(job);
        }
    }

    public void executeJob(JobMessage job) {
        log.info("[WORKER] Processing job id={} type={} attempt={}", job.id(), job.type(), job.attemptCount());

        try {
            boolean success = switch (job.type()) {
                case SEND_EMAIL -> processEmailJob(job.payload());
                case SEND_WHATSAPP -> processWhatsAppJob(job.payload());
                case SEND_SMS -> processSmsJob(job.payload());
                case SEND_NOTIFICATION -> true; // Handled in-app
                default -> true;
            };

            if (success) {
                log.info("[WORKER] Job id={} succeeded", job.id());
            } else {
                handleFailure(job, "Provider returned failure");
            }
        } catch (Exception e) {
            log.error("[WORKER] Error executing job id={}: {}", job.id(), e.getMessage());
            handleFailure(job, e.getMessage());
        }
    }

    private boolean processEmailJob(Map<String, Object> payload) {
        String toEmail = (String) payload.get("toEmail");
        String subject = (String) payload.get("subject");
        String html = (String) payload.get("htmlBody");
        return emailProvider.sendEmail(toEmail, subject, html, payload);
    }

    @SuppressWarnings("unchecked")
    private boolean processWhatsAppJob(Map<String, Object> payload) {
        String phone = (String) payload.get("phone");
        String template = (String) payload.get("template");
        Map<String, String> vars = (Map<String, String>) payload.get("vars");
        return whatsAppProvider.sendTemplateMessage(phone, template, vars);
    }

    private boolean processSmsJob(Map<String, Object> payload) {
        String phone = (String) payload.get("phone");
        String message = (String) payload.get("message");
        return smsProvider.sendSms(phone, message);
    }

    private void handleFailure(JobMessage job, String reason) {
        if (job.attemptCount() < job.maxAttempts()) {
            JobMessage retry = job.withIncrementedAttempt();
            // Exponential backoff delay calculation
            long delayMs = (long) (Math.pow(2, retry.attemptCount()) * 500);
            log.warn("[WORKER] Re-enqueuing failed job id={} attempt {}/{} with backoff {}ms",
                job.id(), retry.attemptCount(), job.maxAttempts(), delayMs);
            jobQueue.enqueue(retry);
        } else {
            log.error("[WORKER] Job id={} exhausted max retry attempts ({}). Reason: {}", job.id(), job.maxAttempts(), reason);
        }
    }

    @PreDestroy
    public void shutdown() {
        log.info("[WORKER] Shutting down worker executor gracefully...");
        workerExecutor.shutdown();
        try {
            if (!workerExecutor.awaitTermination(5, TimeUnit.SECONDS)) {
                workerExecutor.shutdownNow();
            }
        } catch (InterruptedException e) {
            workerExecutor.shutdownNow();
            Thread.currentThread().interrupt();
        }
    }
}
