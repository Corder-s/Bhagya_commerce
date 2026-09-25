package com.bhagya.commerce.common.redis;

import java.time.Duration;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class CacheService {

    private static final Logger log = LoggerFactory.getLogger(CacheService.class);

    private final RedisTemplate<String, Object> redisTemplate;
    // Fast in-memory local fallback cache
    private final ConcurrentHashMap<String, CacheEntry> localFallback = new ConcurrentHashMap<>();

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

    public void deleteByPrefix(String prefix) {
        if (redisTemplate != null) {
            try {
                Set<String> keys = redisTemplate.keys(prefix + "*");
                if (keys != null && !keys.isEmpty()) {
                    redisTemplate.delete(keys);
                }
            } catch (Exception e) {
                log.warn("Redis deleteByPrefix failed for prefix={}: {}", prefix, e.getMessage());
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
