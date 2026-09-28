package com.bhagya.commerce.ai.controller;

import com.bhagya.commerce.ai.dto.*;
import com.bhagya.commerce.ai.service.AIActionConfirmationService;
import com.bhagya.commerce.ai.service.AIService;
import com.bhagya.commerce.common.api.ApiResponse;
import com.bhagya.commerce.common.security.CurrentUser;
import com.bhagya.commerce.common.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.bhagya.commerce.common.error.RateLimitException;
import com.bhagya.commerce.common.redis.RateLimitService;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/v1/ai")
@Tag(name = "Bhagya AI", description = "Autonomous intelligence, heritage discovery, customer assistant, and merchant co-pilot APIs")
public class AIController {

    private final AIService aiService;
    private final AIActionConfirmationService actionConfirmationService;
    private final RateLimitService rateLimitService;

    public AIController(
        AIService aiService,
        AIActionConfirmationService actionConfirmationService,
        RateLimitService rateLimitService
    ) {
        this.aiService = aiService;
        this.actionConfirmationService = actionConfirmationService;
        this.rateLimitService = rateLimitService;
    }

    private String getClientIp(HttpServletRequest request) {
        String xForwarded = request.getHeader("X-Forwarded-For");
        if (xForwarded != null && !xForwarded.isBlank()) {
            return xForwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr() != null ? request.getRemoteAddr() : "127.0.0.1";
    }

    @PostMapping("/chat")
    @Operation(summary = "Send message to Bhagya AI", description = "Orchestrates intent parsing, tool routing, product recommendations, and context-aware responses")
    public ResponseEntity<ApiResponse<AIChatResponse>> chat(
        @Valid @RequestBody AIChatRequest request,
        @CurrentUser UserPrincipal principal,
        HttpServletRequest httpRequest
    ) {
        String rateKey = principal != null ? "ai_chat_user:" + principal.getId() : "ai_chat_ip:" + getClientIp(httpRequest);
        if (!rateLimitService.allowRequest(rateKey, 30, 60)) {
            throw new RateLimitException("Too many AI queries. Please slow down and try again shortly.");
        }

        AIChatResponse response = aiService.processChat(request, principal);
        return ResponseEntity.ok(ApiResponse.success(response, "AI response generated successfully"));
    }

    @GetMapping("/conversations")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get user AI conversations", description = "Retrieves conversation history threads for the current user")
    public ResponseEntity<ApiResponse<List<AIConversationResponse>>> getConversations(
        @CurrentUser UserPrincipal principal
    ) {
        List<AIConversationResponse> list = aiService.getConversationsForUser(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(list, "Conversations retrieved"));
    }

    @GetMapping("/conversations/{id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get conversation by ID", description = "Retrieves specific conversation message history")
    public ResponseEntity<ApiResponse<AIConversationResponse>> getConversation(
        @PathVariable String id,
        @CurrentUser UserPrincipal principal
    ) {
        AIConversationResponse conv = aiService.getConversation(id, principal.getId());
        return ResponseEntity.ok(ApiResponse.success(conv, "Conversation retrieved"));
    }

    @PostMapping("/conversations")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Create a new AI conversation thread", description = "Initializes a thread for customer discovery or merchant assistance")
    public ResponseEntity<ApiResponse<AIConversationResponse>> createConversation(
        @RequestBody AICreateConversationRequest request,
        @CurrentUser UserPrincipal principal
    ) {
        AIConversationResponse created = aiService.createConversation(request, principal);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(created, "Conversation created"));
    }

    @DeleteMapping("/conversations/{id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Delete an AI conversation", description = "Removes conversation history for the current user")
    public ResponseEntity<ApiResponse<Void>> deleteConversation(
        @PathVariable String id,
        @CurrentUser UserPrincipal principal
    ) {
        aiService.deleteConversation(id, principal.getId());
        return ResponseEntity.ok(ApiResponse.success(null, "Conversation deleted"));
    }

    @PostMapping("/actions/{actionId}/confirm")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Confirm or cancel a high-impact AI action", description = "Executes or cancels a mutating AI-proposed action with full audit logging")
    public ResponseEntity<ApiResponse<AIActionConfirmationDto>> confirmAction(
        @PathVariable String actionId,
        @RequestBody AIActionConfirmRequest request,
        @CurrentUser UserPrincipal principal
    ) {
        AIActionConfirmationDto result = actionConfirmationService.confirmOrCancelAction(
            actionId,
            principal.getId(),
            request.confirmed()
        );
        String msg = request.confirmed() ? "Action confirmed and executed successfully" : "Action cancelled";
        return ResponseEntity.ok(ApiResponse.success(result, msg));
    }

    @GetMapping("/actions/{actionId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get AI action details", description = "Retrieves preview and current status of an AI proposed action")
    public ResponseEntity<ApiResponse<AIActionConfirmationDto>> getAction(
        @PathVariable String actionId,
        @CurrentUser UserPrincipal principal
    ) {
        AIActionConfirmationDto action = actionConfirmationService.getAction(actionId, principal.getId());
        return ResponseEntity.ok(ApiResponse.success(action, "Action details retrieved"));
    }

    @PostMapping("/feedback")
    @Operation(summary = "Submit AI feedback", description = "Records patron helpfulness ratings for AI responses")
    public ResponseEntity<ApiResponse<Void>> submitFeedback(
        @Valid @RequestBody AIFeedbackRequest request,
        @CurrentUser UserPrincipal principal
    ) {
        String userId = principal != null ? principal.getId() : "usr_anonymous";
        aiService.recordFeedback(request, userId);
        return ResponseEntity.ok(ApiResponse.success(null, "Feedback recorded"));
    }
}
