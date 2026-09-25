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
    private static final String QUEUE_KEY = "bhagya:job_queue";

    private final RedisTemplate<String, Object> redisTemplate;
    private final BlockingQueue<JobMessage> inMemoryQueue = new LinkedBlockingQueue<>(1000);

    public JobQueue(@Autowired(required = false) RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public void enqueue(JobMessage message) {
        log.info("[QUEUE] Enqueuing job id={} type={}", message.id(), message.type());
        if (redisTemplate != null) {
            try {
                redisTemplate.opsForList().rightPush(QUEUE_KEY, message);
                return;
            } catch (Exception e) {
                log.warn("Failed to push to Redis queue, pushing to in-memory queue: {}", e.getMessage());
            }
        }
        inMemoryQueue.offer(message);
    }

    public Optional<JobMessage> dequeue() {
        if (redisTemplate != null) {
            try {
                Object item = redisTemplate.opsForList().leftPop(QUEUE_KEY);
                if (item instanceof JobMessage jm) {
                    return Optional.of(jm);
                }
            } catch (Exception e) {
                log.warn("Failed to pop from Redis queue: {}", e.getMessage());
            }
        }
        return Optional.ofNullable(inMemoryQueue.poll());
    }

    public long size() {
        if (redisTemplate != null) {
            try {
                Long size = redisTemplate.opsForList().size(QUEUE_KEY);
                if (size != null) return size;
            } catch (Exception e) {
                // fall through
            }
        }
        return inMemoryQueue.size();
    }
}
