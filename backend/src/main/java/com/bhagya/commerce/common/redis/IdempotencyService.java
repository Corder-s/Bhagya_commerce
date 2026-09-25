package com.bhagya.commerce.common.redis;

import java.time.Duration;
import java.util.Optional;
import org.springframework.stereotype.Service;

@Service
public class IdempotencyService {

    private static final String IDEMPOTENCY_PREFIX = "idempotency:";
    private static final Duration DEFAULT_TTL = Duration.ofHours(24);

    private final CacheService cacheService;

    public IdempotencyService(CacheService cacheService) {
        this.cacheService = cacheService;
    }

    public <T> Optional<T> getProcessedResult(String idempotencyKey, Class<T> resultClass) {
        if (idempotencyKey == null || idempotencyKey.isBlank()) {
            return Optional.empty();
        }
        return cacheService.get(IDEMPOTENCY_PREFIX + idempotencyKey, resultClass);
    }

    public void storeResult(String idempotencyKey, Object result) {
        if (idempotencyKey != null && !idempotencyKey.isBlank() && result != null) {
            cacheService.set(IDEMPOTENCY_PREFIX + idempotencyKey, result, DEFAULT_TTL);
        }
    }
}
