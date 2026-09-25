package com.bhagya.commerce.admin.controller;

import com.bhagya.commerce.common.api.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Platform Admin", description = "Reserved platform administration endpoints")
public class AdminController {

    @GetMapping("/status")
    @Operation(summary = "Platform health and metrics overview (Admin only)")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPlatformStatus() {
        return ResponseEntity.ok(ApiResponse.success(
            Map.of(
                "status", "HEALTHY",
                "version", "1.0.0-PROD-FOUNDATION",
                "activeTenants", 1,
                "uptimeSeconds", 86400
            ),
            "Admin platform status retrieved"
        ));
    }
}
