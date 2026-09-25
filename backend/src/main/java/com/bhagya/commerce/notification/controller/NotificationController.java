package com.bhagya.commerce.notification.controller;

import com.bhagya.commerce.common.api.ApiResponse;
import com.bhagya.commerce.common.security.CurrentUser;
import com.bhagya.commerce.common.security.UserPrincipal;
import com.bhagya.commerce.notification.dto.NotificationResponse;
import com.bhagya.commerce.notification.dto.UnreadCountResponse;
import com.bhagya.commerce.notification.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/notifications")
@Tag(name = "Notifications", description = "Customer notification center and alerts APIs")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get current user notifications", description = "Returns chronological list of notifications for the authenticated user")
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getNotifications(
        @CurrentUser UserPrincipal principal
    ) {
        List<NotificationResponse> list = notificationService.getNotificationsForUser(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(list, "Notifications retrieved successfully"));
    }

    @GetMapping("/unread-count")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get unread notification count", description = "Returns count of unread notifications for badge display")
    public ResponseEntity<ApiResponse<UnreadCountResponse>> getUnreadCount(
        @CurrentUser UserPrincipal principal
    ) {
        UnreadCountResponse count = notificationService.getUnreadCount(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(count, "Unread count retrieved"));
    }

    @PatchMapping("/{notificationId}/read")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Mark single notification as read", description = "Updates status of specific notification")
    public ResponseEntity<ApiResponse<NotificationResponse>> markAsRead(
        @PathVariable String notificationId,
        @CurrentUser UserPrincipal principal
    ) {
        NotificationResponse updated = notificationService.markAsRead(notificationId, principal.getId());
        return ResponseEntity.ok(ApiResponse.success(updated, "Notification marked as read"));
    }

    @PostMapping("/read-all")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Mark all notifications as read", description = "Clears unread badge for the authenticated user")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(
        @CurrentUser UserPrincipal principal
    ) {
        notificationService.markAllAsRead(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(null, "All notifications marked as read"));
    }
}
