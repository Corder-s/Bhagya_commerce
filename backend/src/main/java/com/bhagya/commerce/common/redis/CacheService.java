package com.bhagya.commerce.common.redis;

import java.time.Duration;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ThreadLocalRandom;
import java.util.function.Supplier;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.Cursor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ScanOptions;
import org.springframework.stereotype.Service;

@Service
public class CacheService {

    private static final Logger log = LoggerFactory.getLogger(CacheService.class);

    private final RedisTemplate<String, Object> redisTemplate;
    // Fast in-memory local fallback cache
    private final ConcurrentHashMap<String, CacheEntry> localFallback = new ConcurrentHashMap<>();
    // Fine-grained key-level locks for request coalescing (stampede protection)
    private final ConcurrentHashMap<String, Object> keyLocks = new ConcurrentHashMap<>();

    public CacheService(@Autowired(required = false) RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public <T> Optional<T> get(String key, Class<T> targetClass) {
        if (redisTemplate != null) {
            try {
                Object value = redisTemplate.opsForValue().get(key);
                if (value != null && targetClass.isInstance(value)) {
                    return Optional.of(targetClass.cast(value));
                }
            } catch (Exception e) {
                log.warn("Redis get failed for key={}, falling back to local: {}", key, e.getMessage());
            }
        }

        CacheEntry entry = localFallback.get(key);
        if (entry != null && !entry.isExpired()) {
            if (targetClass.isInstance(entry.value())) {
                return Optional.of(targetClass.cast(entry.value()));
            }
        }
        return Optional.empty();
    }

    /**
     * Request coalescing / thundering herd protection.
     * Guarantees that for concurrent cold cache requests on the same key,
     * the compute loader is executed exactly once while other threads await the result.
     */
    public <T> T getOrCompute(String key, Class<T> targetClass, Duration ttl, Supplier<T> loader) {
        Optional<T> cached = get(key, targetClass);
        if (cached.isPresent()) {
            return cached.get();
        }

        Object lock = keyLocks.computeIfAbsent(key, k -> new Object());
        synchronized (lock) {
            try {
                // Double-checked locking
                cached = get(key, targetClass);
                if (cached.isPresent()) {
                    return cached.get();
                }

                T computed = loader.get();
                if (computed != null) {
                    setWithJitter(key, computed, ttl, 0.15);
                }
                return computed;
            } finally {
                keyLocks.remove(key, lock);
            }
        }
    }

    public void set(String key, Object value, long ttlSeconds) {
        set(key, value, Duration.ofSeconds(ttlSeconds));
    }

    public void set(String key, Object value, Duration ttl) {
        if (redisTemplate != null) {
            try {
                redisTemplate.opsForValue().set(key, value, ttl);
            } catch (Exception e) {
                log.warn("Redis set failed for key={}, caching in local fallback: {}", key, e.getMessage());
            }
        }
        localFallback.put(key, new CacheEntry(value, System.currentTimeMillis() + ttl.toMillis()));
    }

    /**
     * Sets value with a randomized TTL jitter (e.g. ±15%) to prevent mass simultaneous
     * cache expiration and backend thundering-herd stampedes.
     */
    public void setWithJitter(String key, Object value, Duration baseTtl, double jitterFraction) {
        long baseMillis = baseTtl.toMillis();
        double factor = 1.0 + (ThreadLocalRandom.current().nextDouble() * 2.0 - 1.0) * Math.min(Math.max(jitterFraction, 0.0), 0.5);
        long actualMillis = Math.max(1000L, (long) (baseMillis * factor));
        set(key, value, Duration.ofMillis(actualMillis));
    }

    public void delete(String key) {
        if (redisTemplate != null) {
            try {
                redisTemplate.delete(key);
            } catch (Exception e) {
                log.warn("Redis delete failed for key={}: {}", key, e.getMessage());
            }
        }
        localFallback.remove(key);
    }

    /**
     * Deletes keys matching a prefix using non-blocking SCAN when possible to avoid
     * blocking the Redis main event loop with the KEYS command.
     */
    public void deleteByPrefix(String prefix) {
        if (redisTemplate != null) {
            try {
                ScanOptions options = ScanOptions.scanOptions().match(prefix + "*").count(100).build();
                Set<String> keys = redisTemplate.execute((org.springframework.data.redis.core.RedisCallback<Set<String>>) connection -> {
                    Set<String> matching = new java.util.HashSet<>();
                    Cursor<byte[]> cursor = connection.keyCommands().scan(options);
                    while (cursor.hasNext()) {
                        matching.add(new String(cursor.next()));
                    }
                    return matching;
                });
                if (keys != null && !keys.isEmpty()) {
                    redisTemplate.delete(keys);
                }
            } catch (Exception e) {
                try {
                    Set<String> keys = redisTemplate.keys(prefix + "*");
                    if (keys != null && !keys.isEmpty()) {
                        redisTemplate.delete(keys);
                    }
                } catch (Exception ex) {
                    log.warn("Redis deleteByPrefix failed for prefix={}, deleting from local fallback: {}", prefix, ex.getMessage());
                }
            }
        }
        localFallback.keySet().removeIf(k -> k.startsWith(prefix));
    }

    public boolean hasKey(String key) {
        if (redisTemplate != null) {
            try {
                Boolean exists = redisTemplate.hasKey(key);
                if (Boolean.TRUE.equals(exists)) return true;
            } catch (Exception e) {
                // fall through
            }
        }
        CacheEntry entry = localFallback.get(key);
        return entry != null && !entry.isExpired();
    }

    private record CacheEntry(Object value, long expiresAt) {
        boolean isExpired() {
            return System.currentTimeMillis() > expiresAt;
        }
    }
}
