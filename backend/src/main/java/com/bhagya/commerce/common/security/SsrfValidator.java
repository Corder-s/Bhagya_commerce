package com.bhagya.commerce.common.security;

import com.bhagya.commerce.common.error.ValidationException;
import java.net.InetAddress;
import java.net.URI;
import java.net.UnknownHostException;
import java.util.Locale;
import java.util.Set;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * Server-Side Request Forgery (SSRF) Protection Validator.
 *
 * Validates external destination URLs to prevent backend systems from fetching:
 *  - Cloud metadata endpoints (e.g. 169.254.169.254)
 *  - Loopback interfaces (127.0.0.0/8, ::1, localhost)
 *  - Private internal networks (RFC 1918: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16)
 *  - Link-local and multicast addresses
 *  - Internal hostnames (Docker, Kubernetes services)
 */
@Component
public class SsrfValidator {

    private static final Logger log = LoggerFactory.getLogger(SsrfValidator.class);

    private static final Set<String> ALLOWED_SCHEMES = Set.of("http", "https");
    private static final Set<String> BLOCKED_HOST_SUFFIXES = Set.of(
        "localhost",
        ".local",
        ".internal",
        ".lan",
        ".intranet",
        "host.docker.internal"
    );

    public void validateSafeUrl(String urlString) {
        if (urlString == null || urlString.isBlank()) {
            throw new ValidationException("URL cannot be empty.");
        }

        URI uri;
        try {
            uri = URI.create(urlString.trim());
        } catch (IllegalArgumentException e) {
            throw new ValidationException("Malformed URL destination.");
        }

        String scheme = uri.getScheme();
        if (scheme == null || !ALLOWED_SCHEMES.contains(scheme.toLowerCase(Locale.ROOT))) {
            throw new ValidationException("Unsupported URL scheme: " + scheme + ". Only HTTP and HTTPS are permitted.");
        }

        String host = uri.getHost();
        if (host == null || host.isBlank()) {
            throw new ValidationException("URL must contain a valid hostname.");
        }

        String lowerHost = host.toLowerCase(Locale.ROOT);
        for (String suffix : BLOCKED_HOST_SUFFIXES) {
            if (lowerHost.equals(suffix) || lowerHost.endsWith("." + suffix)) {
                log.warn("[SECURITY] Blocked SSRF attempt to internal host: {}", host);
                throw new ValidationException("Access to internal host " + host + " is forbidden.");
            }
        }

        // Resolve DNS and check all resolved IP addresses
        try {
            InetAddress[] addresses = InetAddress.getAllByName(host);
            for (InetAddress addr : addresses) {
                if (isPrivateOrLocalAddress(addr)) {
                    log.warn("[SECURITY] Blocked SSRF attempt to resolved private IP: {} for host: {}", addr.getHostAddress(), host);
                    throw new ValidationException("Access to internal/private IP " + addr.getHostAddress() + " is forbidden.");
                }
            }
        } catch (UnknownHostException e) {
            throw new ValidationException("Unable to resolve destination hostname: " + host);
        }
    }

    public boolean isPrivateOrLocalAddress(InetAddress addr) {
        if (addr.isLoopbackAddress() || addr.isAnyLocalAddress() || addr.isLinkLocalAddress()) {
            return true;
        }

        if (addr.isSiteLocalAddress()) {
            return true;
        }

        if (addr.isMulticastAddress()) {
            return true;
        }

        byte[] raw = addr.getAddress();

        // Check IPv4 link-local (169.254.0.0/16) and AWS/GCP cloud metadata 169.254.169.254
        if (raw.length == 4) {
            int b0 = raw[0] & 0xFF;
            int b1 = raw[1] & 0xFF;

            // 169.254.x.x (Cloud metadata)
            if (b0 == 169 && b1 == 254) {
                return true;
            }

            // 10.0.0.0/8
            if (b0 == 10) {
                return true;
            }

            // 172.16.0.0/12
            if (b0 == 172 && (b1 >= 16 && b1 <= 31)) {
                return true;
            }

            // 192.168.0.0/16
            if (b0 == 192 && b1 == 168) {
                return true;
            }

            // 127.0.0.0/8
            if (b0 == 127) {
                return true;
            }

            // 0.0.0.0/8
            if (b0 == 0) {
                return true;
            }
        }

        // IPv6 Unique Local Address (fc00::/7) or IPv6 Link-Local (fe80::/10)
        if (raw.length == 16) {
            int b0 = raw[0] & 0xFF;
            if ((b0 & 0xFE) == 0xFC) { // fc00::/7
                return true;
            }
            if ((b0 == 0xFE) && ((raw[1] & 0xC0) == 0x80)) { // fe80::/10
                return true;
            }
        }

        return false;
    }

    public boolean isSafeHttpUrl(String urlString) {
        try {
            validateSafeUrl(urlString);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
