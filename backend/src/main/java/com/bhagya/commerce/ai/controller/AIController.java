package com.bhagya.commerce.ai.controller;

import com.bhagya.commerce.ai.dto.AIChatRequest;
import com.bhagya.commerce.ai.dto.AIChatResponse;
import com.bhagya.commerce.ai.dto.AICreateConversationRequest;
import com.bhagya.commerce.ai.dto.AIConversationResponse;
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
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/ai")
@Tag(name = "Bhagya AI", description = "Autonomous intelligence, heritage discovery, customer assistant, and merchant co-pilot APIs")
public class AIController {

    private final AIService aiService;

    public AIController(AIService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/chat")
    @Operation(summary = "Send message to Bhagya AI", description = "Orchestrates intent parsing, tool routing, product recommendations, and context-aware responses")
    public ResponseEntity<ApiResponse<AIChatResponse>> chat(
        @Valid @RequestBody AIChatRequest request,
        @CurrentUser UserPrincipal principal
    ) {
        String userId = principal != null ? principal.getId() : "usr_anonymous";
        AIChatResponse response = aiService.processChat(request, userId);
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
        AIConversationResponse created = aiService.createConversation(request, principal.getId());
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
}
