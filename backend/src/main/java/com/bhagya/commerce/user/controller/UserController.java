package com.bhagya.commerce.user.controller;

import com.bhagya.commerce.common.api.ApiResponse;
import com.bhagya.commerce.common.security.CurrentUser;
import com.bhagya.commerce.common.security.UserPrincipal;
import com.bhagya.commerce.user.dto.UserPreferencesRequest;
import com.bhagya.commerce.user.dto.UserPreferencesResponse;
import com.bhagya.commerce.user.dto.UserResponse;
import com.bhagya.commerce.user.dto.UserUpdateRequest;
import com.bhagya.commerce.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
@Tag(name = "Users", description = "Authenticated User Identity & Account Preferences")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user profile")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(@CurrentUser UserPrincipal principal) {
        UserResponse profile = userService.getUserProfile(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(profile));
    }

    @PatchMapping("/me")
    @Operation(summary = "Update current user profile")
    public ResponseEntity<ApiResponse<UserResponse>> updateCurrentUser(
        @CurrentUser UserPrincipal principal,
        @Valid @RequestBody UserUpdateRequest request
    ) {
        UserResponse updated = userService.updateUserProfile(principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok(updated, "Profile updated successfully"));
    }

    @GetMapping("/me/preferences")
    @Operation(summary = "Get user communication and category preferences")
    public ResponseEntity<ApiResponse<UserPreferencesResponse>> getUserPreferences(@CurrentUser UserPrincipal principal) {
        UserPreferencesResponse preferences = userService.getUserPreferences(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(preferences));
    }

    @PatchMapping("/me/preferences")
    @Operation(summary = "Update user communication and category preferences")
    public ResponseEntity<ApiResponse<UserPreferencesResponse>> updateUserPreferences(
        @CurrentUser UserPrincipal principal,
        @Valid @RequestBody UserPreferencesRequest request
    ) {
        UserPreferencesResponse updated = userService.updateUserPreferences(principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok(updated, "Preferences updated successfully"));
    }
}
