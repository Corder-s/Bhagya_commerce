package com.bhagya.commerce.analytics.controller;

import com.bhagya.commerce.analytics.domain.AnalyticsEvent;
import com.bhagya.commerce.analytics.dto.AnalyticsEventIngestRequest;
import com.bhagya.commerce.analytics.service.AnalyticsEventTracker;
import com.bhagya.commerce.common.api.ApiResponse;
import com.bhagya.commerce.common.redis.RateLimitService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/analytics")
@Tag(name = "Analytics Ingestion", description = "Public & client behavioral event tracking")
public class AnalyticsEventController {

    private final AnalyticsEventTracker eventTracker;
    private final RateLimitService rateLimitService;

    public AnalyticsEventController(
        AnalyticsEventTracker eventTracker,
        RateLimitService rateLimitService
    ) {
        this.eventTracker = eventTracker;
        this.rateLimitService = rateLimitService;
    }

    @PostMapping("/events")
    @Operation(summary = "Ingest behavioral analytics event from web/mobile client")
    public ResponseEntity<ApiResponse<Map<String, Object>>> ingestEvent(
        @Valid @RequestBody AnalyticsEventIngestRequest request,
        HttpServletRequest httpRequest,
        Principal principal
    ) {
        String clientIp = httpRequest.getRemoteAddr();
        String rateLimitKey = "rl:analytics:" + (principal != null ? principal.getName() : clientIp);

        // Max 120 analytics events per minute per client
        if (rateLimitService != null && !rateLimitService.allowRequest(rateLimitKey, 120, 60)) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                .body(ApiResponse.error("Rate limit exceeded for analytics ingestion."));
        }

        String userId = principal != null ? principal.getName() : null;
        AnalyticsEvent saved = eventTracker.ingestClientEvent(request, userId, null);

        return ResponseEntity.ok(ApiResponse.success(
            Map.of("eventId", saved.getId(), "status", "INGESTED", "occurredAt", saved.getOccurredAt()),
            "Event ingested successfully"
        ));
    }
}
