package com.bhagya.commerce.common.security;

import com.bhagya.commerce.common.redis.CacheService;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.time.Instant;
import java.util.HexFormat;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Authoritative Token Revocation & Session Invalidation Service.
 *
 * Implements Redis/cache-backed token blocklisting for:
 *  - Explicit user logouts
 *  - Password resets (invalidates all prior tokens for the user)
 *  - Compromised credential revocations
 *  - Administrative account suspensions
 */
@Service
public class TokenRevocationService {

    private static final Logger log = LoggerFactory.getLogger(TokenRevocationService.class);
    private static final String REVOKED_TOKEN_PREFIX = "auth:revoked_token:";
    private static final String USER_REVOCATION_PREFIX = "auth:user_revoked_at:";

    private final CacheService cacheService;

    public TokenRevocationService(CacheService cacheService) {
        this.cacheService = cacheService;
    }

    /**
     * Blocklists a single JWT token until its natural expiration.
     */
    public void revokeToken(String token, long remainingValiditySeconds) {
        if (token == null || token.isBlank()) return;
        String tokenHash = hashToken(token);
        long ttl = Math.max(remainingValiditySeconds, 60); // At least 1 minute
        cacheService.set(REVOKED_TOKEN_PREFIX + tokenHash, "revoked", Duration.ofSeconds(ttl));
        log.info("[SECURITY] Token revoked hash={}", tokenHash);
    }

    /**
     * Checks if a specific JWT token has been explicitly blocklisted.
     */
    public boolean isTokenRevoked(String token) {
        if (token == null || token.isBlank()) return false;
        String tokenHash = hashToken(token);
        return cacheService.hasKey(REVOKED_TOKEN_PREFIX + tokenHash);
    }

    /**
     * Revokes all active sessions for a user (e.g. after password reset).
     */
    public void revokeAllUserSessions(String userId, long maxTokenValiditySeconds) {
        if (userId == null || userId.isBlank()) return;
        long nowMillis = Instant.now().toEpochMilli();
        cacheService.set(USER_REVOCATION_PREFIX + userId, String.valueOf(nowMillis), Duration.ofSeconds(maxTokenValiditySeconds));
        log.info("[SECURITY] Revoked all sessions for userId={}", userId);
    }

    /**
     * Checks if a token was issued before the user's latest session revocation timestamp.
     */
    public boolean isSessionRevokedForUser(String userId, Instant tokenIssuedAt) {
        if (userId == null || tokenIssuedAt == null) return false;
        Optional<String> revokedAtStr = cacheService.get(USER_REVOCATION_PREFIX + userId, String.class);
        if (revokedAtStr.isEmpty()) return false;

        try {
            long revokedAtMillis = Long.parseLong(revokedAtStr.get());
            return tokenIssuedAt.toEpochMilli() < revokedAtMillis;
        } catch (NumberFormatException e) {
            return false;
        }
    }

    private String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(token.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm unavailable", e);
        }
    }
}
