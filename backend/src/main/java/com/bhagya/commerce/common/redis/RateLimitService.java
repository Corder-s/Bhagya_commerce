package com.bhagya.commerce.common.redis;

import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class RateLimitService {

    private static final Logger log = LoggerFactory.getLogger(RateLimitService.class);

    private final RedisTemplate<String, Object> redisTemplate;
    private final ConcurrentHashMap<String, RateLimitCounter> localCounters = new ConcurrentHashMap<>();

    public RateLimitService(@Autowired(required = false) RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public boolean tryAcquire(String key, int maxRequests, Duration window) {
        String rateLimitKey = "ratelimit:" + key;
        if (redisTemplate != null) {
            try {
                Long count = redisTemplate.opsForValue().increment(rateLimitKey);
                if (count != null && count == 1) {
                    redisTemplate.expire(rateLimitKey, window);
                }
                return count != null && count <= maxRequests;
            } catch (Exception e) {
                log.warn("Redis rate limiter unavailable, falling back to in-memory: {}", e.getMessage());
            }
        }

        RateLimitCounter counter = localCounters.compute(rateLimitKey, (k, existing) -> {
            long now = System.currentTimeMillis();
            if (existing == null || now > existing.expiresAt) {
                return new RateLimitCounter(new AtomicInteger(1), now + window.toMillis());
            }
            existing.count.incrementAndGet();
            return existing;
        });

        return counter.count.get() <= maxRequests;
    }

    private record RateLimitCounter(AtomicInteger count, long expiresAt) {}
}
