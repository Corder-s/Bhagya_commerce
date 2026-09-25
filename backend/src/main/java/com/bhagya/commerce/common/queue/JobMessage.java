package com.bhagya.commerce.common.queue;

import java.time.Instant;
import java.util.Map;

public record JobMessage(
    String id,
    JobType type,
    Map<String, Object> payload,
    int attemptCount,
    int maxAttempts,
    Instant createdAt,
    String status
) {
    public static JobMessage create(String id, JobType type, Map<String, Object> payload) {
        return new JobMessage(id, type, payload, 0, 3, Instant.now(), "ENQUEUED");
    }

    public JobMessage withIncrementedAttempt() {
        return new JobMessage(id, type, payload, attemptCount + 1, maxAttempts, createdAt, "PROCESSING");
    }

    public JobMessage withStatus(String newStatus) {
        return new JobMessage(id, type, payload, attemptCount, maxAttempts, createdAt, newStatus);
    }
}
