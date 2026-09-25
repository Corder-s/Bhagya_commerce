package com.bhagya.commerce.common.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtTokenProvider {

    private final SecretKey secretKey;
    private final long validityInMilliseconds;

    public JwtTokenProvider(
        @Value("${bhagya.security.jwt.secret}") String secret,
        @Value("${bhagya.security.jwt.access-token-validity-seconds:86400}") long validityInSeconds
    ) {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.validityInMilliseconds = validityInSeconds * 1000;
    }

    public String generateToken(UserPrincipal principal) {
        Date now = new Date();
        Date validity = new Date(now.getTime() + validityInMilliseconds);

        return Jwts.builder()
            .subject(principal.getId())
            .claim("phone", principal.getPhone())
            .claim("email", principal.getEmail())
            .claim("name", principal.getName())
            .claim("storeId", principal.getStoreId())
            .claim("organizationId", principal.getOrganizationId())
            .claim("role", principal.getAuthorities().iterator().next().getAuthority().replace("ROLE_", ""))
            .issuedAt(now)
            .expiration(validity)
            .signWith(secretKey)
            .compact();
    }

    public UserPrincipal parseToken(String token) {
        Claims claims = Jwts.parser()
            .verifyWith(secretKey)
            .build()
            .parseSignedClaims(token)
            .getPayload();

        return new UserPrincipal(
            claims.getSubject(),
            claims.get("phone", String.class),
            claims.get("email", String.class),
            claims.get("name", String.class),
            claims.get("storeId", String.class),
            claims.get("organizationId", String.class),
            claims.get("role", String.class)
        );
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
