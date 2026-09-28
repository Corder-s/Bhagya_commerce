package com.bhagya.commerce.common.queue;

import java.util.Optional;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class JobQueue {

    private static final Logger log = LoggerFactory.getLogger(JobQueue.class);
    private static final String QUEUE_KEY_CRITICAL = "bhagya:job_queue:critical";
    private static final String QUEUE_KEY_BULK = "bhagya:job_queue:bulk";
    private static final int BACKPRESSURE_THRESHOLD = 500;

    private final RedisTemplate<String, Object> redisTemplate;
    private final BlockingQueue<JobMessage> criticalInMemoryQueue = new LinkedBlockingQueue<>(1000);
    private final BlockingQueue<JobMessage> bulkInMemoryQueue = new LinkedBlockingQueue<>(2000);

    public JobQueue(@Autowired(required = false) RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public static boolean isCritical(JobType type) {
        if (type == null) return false;
        return switch (type) {
            case SEND_NOTIFICATION, SEND_EMAIL, SEND_WHATSAPP, SEND_SMS -> true;
            default -> false;
        };
    }

    public void enqueue(JobMessage message) {
        boolean critical = isCritical(message.type());
        String redisKey = critical ? QUEUE_KEY_CRITICAL : QUEUE_KEY_BULK;
        log.info("[QUEUE] Enqueuing {} job id={} type={}", critical ? "CRITICAL" : "BULK", message.id(), message.type());

        if (redisTemplate != null) {
            try {
                redisTemplate.opsForList().rightPush(redisKey, message);
                return;
            } catch (Exception e) {
                log.warn("Failed to push to Redis queue {}, falling back to in-memory queue: {}", redisKey, e.getMessage());
            }
        }

        if (critical) {
            criticalInMemoryQueue.offer(message);
        } else {
            bulkInMemoryQueue.offer(message);
        }
    }

    /**
     * Prioritized dequeue: always drains urgent transactional jobs (Email, SMS, WhatsApp)
     * before processing background/bulk jobs (Analytics, Exports, Image processing).
     */
    public Optional<JobMessage> dequeue() {
        // 1. Try Critical Redis Queue
        if (redisTemplate != null) {
            try {
                Object item = redisTemplate.opsForList().leftPop(QUEUE_KEY_CRITICAL);
                if (item instanceof JobMessage jm) {
                    return Optional.of(jm);
                }
            } catch (Exception e) {
                log.warn("Failed to pop from critical Redis queue: {}", e.getMessage());
            }
        }

        // 2. Try Critical In-Memory Queue
        JobMessage criticalMem = criticalInMemoryQueue.poll();
        if (criticalMem != null) {
            return Optional.of(criticalMem);
        }

        // 3. If no critical jobs, dequeue from Bulk Redis Queue
        if (redisTemplate != null) {
            try {
                Object item = redisTemplate.opsForList().leftPop(QUEUE_KEY_BULK);
                if (item instanceof JobMessage jm) {
                    return Optional.of(jm);
                }
            } catch (Exception e) {
                log.warn("Failed to pop from bulk Redis queue: {}", e.getMessage());
            }
        }

        // 4. Try Bulk In-Memory Queue
        return Optional.ofNullable(bulkInMemoryQueue.poll());
    }

    public long size() {
        return criticalSize() + bulkSize();
    }

    public long criticalSize() {
        if (redisTemplate != null) {
            try {
                Long size = redisTemplate.opsForList().size(QUEUE_KEY_CRITICAL);
                if (size != null) return size;
            } catch (Exception e) {
                // fall through
            }
        }
        return criticalInMemoryQueue.size();
    }

    public long bulkSize() {
        if (redisTemplate != null) {
            try {
                Long size = redisTemplate.opsForList().size(QUEUE_KEY_BULK);
                if (size != null) return size;
            } catch (Exception e) {
                // fall through
            }
        }
        return bulkInMemoryQueue.size();
    }

    public boolean isBackpressured() {
        return size() >= BACKPRESSURE_THRESHOLD;
    }
}
