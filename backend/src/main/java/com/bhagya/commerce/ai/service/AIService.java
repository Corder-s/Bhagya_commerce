package com.bhagya.commerce.ai.service;

import com.bhagya.commerce.ai.domain.*;
import com.bhagya.commerce.ai.dto.*;
import com.bhagya.commerce.ai.provider.AIModelProvider;
import com.bhagya.commerce.ai.repository.*;
import com.bhagya.commerce.ai.tool.AITool;
import com.bhagya.commerce.ai.tool.AIToolContext;
import com.bhagya.commerce.ai.tool.AIToolRegistry;
import com.bhagya.commerce.audit.service.AuditService;
import com.bhagya.commerce.common.error.ResourceNotFoundException;
import com.bhagya.commerce.common.security.UserPrincipal;
import java.time.Instant;
import java.util.*;
import org.springframework.stereotype.Service;

@Service
public class AIService {

    private final AIConversationRepository conversationRepository;
    private final AIMessageRepository messageRepository;
    private final AIToolExecutionRepository toolExecutionRepository;
    private final AIFeedbackRepository feedbackRepository;
    private final AIContextService contextService;
    private final AIToolRegistry toolRegistry;
    private final AIModelProvider modelProvider;
    private final AuditService auditService;
    private final com.bhagya.commerce.common.security.InputSanitizer inputSanitizer;

    public AIService(
        AIConversationRepository conversationRepository,
        AIMessageRepository messageRepository,
        AIToolExecutionRepository toolExecutionRepository,
        AIFeedbackRepository feedbackRepository,
        AIContextService contextService,
        AIToolRegistry toolRegistry,
        AIModelProvider modelProvider,
        AuditService auditService,
        com.bhagya.commerce.common.security.InputSanitizer inputSanitizer
    ) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.toolExecutionRepository = toolExecutionRepository;
        this.feedbackRepository = feedbackRepository;
        this.contextService = contextService;
        this.toolRegistry = toolRegistry;
        this.modelProvider = modelProvider;
        this.auditService = auditService;
        this.inputSanitizer = inputSanitizer;
    }

    public AIChatResponse processChat(AIChatRequest request, UserPrincipal principal) {
        AIToolContext context = contextService.resolveContext(principal, request.contextMode(), request.storeId());
        String userId = context.userId();

        // 1. Get or create persistent conversation with IDOR check
        String convId = request.conversationId();
        AIConversation conversation = null;
        if (convId != null && !convId.isBlank()) {
            conversation = conversationRepository.findById(convId).orElse(null);
            if (conversation != null && !conversation.getUserId().equals(userId)) {
                throw new com.bhagya.commerce.common.error.ForbiddenException("Access denied: You do not own this AI conversation.");
            }
        }

        // 2. Sanitize prompt input against injection attacks
        String sanitizedMessage = inputSanitizer.sanitizePromptInput(request.message());

        if (conversation == null) {
            String title = sanitizedMessage.length() > 30
                ? sanitizedMessage.substring(0, 30) + "..."
                : sanitizedMessage;
            conversation = new AIConversation(
                convId,
                userId,
                context.storeId(),
                context.contextMode(),
                title,
                Instant.now(),
                Instant.now()
            );
            conversation = conversationRepository.save(conversation);
        }

        // 3. Persist user message
        AIMessage userMessage = new AIMessage(
            null,
            conversation.getId(),
            AIMessageRole.USER,
            sanitizedMessage,
            null,
            null,
            Instant.now()
        );
        messageRepository.save(userMessage);

        // 4. Resolve permitted safe tools
        List<AITool> availableTools = toolRegistry.getAvailableTools(context);

        // 5. Process via model provider
        AIChatResponse response = modelProvider.process(
            conversation.getId(),
            sanitizedMessage,
            context,
            availableTools,
            request.metadata()
        );

        // 5. Persist assistant message
        AIMessage assistantMessage = new AIMessage(
            response.id(),
            conversation.getId(),
            AIMessageRole.ASSISTANT,
            response.reply(),
            response.intent(),
            response.structuredData(),
            response.timestamp()
        );
        messageRepository.save(assistantMessage);

        // 6. Record tool executions
        if (response.toolCalls() != null) {
            for (AIToolCallDto tc : response.toolCalls()) {
                AIToolExecution exec = new AIToolExecution(
                    tc.id(),
                    conversation.getId(),
                    assistantMessage.getId(),
                    tc.name(),
                    AIToolCategory.valueOf(tc.category()),
                    AIToolStatus.valueOf(tc.status()),
                    tc.input(),
                    tc.output(),
                    null,
                    tc.durationMs(),
                    Instant.now()
                );
                toolExecutionRepository.save(exec);
            }
        }

        // 7. Touch conversation updated timestamp
        conversation.setUpdatedAt(Instant.now());
        conversationRepository.save(conversation);

        return response;
    }

    public List<AIConversationResponse> getConversationsForUser(String userId) {
        List<AIConversation> convs = conversationRepository.findByUserId(userId);
        return convs.stream().map(c -> {
            List<AIMessage> msgs = messageRepository.findByConversationId(c.getId());
            List<Map<String, Object>> msgMaps = msgs.stream()
                .map(m -> Map.<String, Object>of(
                    "role", m.getRole().name().toLowerCase(),
                    "text", m.getContent(),
                    "time", m.getCreatedAt().toString()
                ))
                .toList();

            return new AIConversationResponse(
                c.getId(),
                c.getTitle(),
                c.getContextMode().name(),
                msgs.size(),
                c.getUpdatedAt(),
                msgMaps
            );
        }).toList();
    }

    public AIConversationResponse getConversation(String id, String userId) {
        AIConversation c = conversationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Conversation not found: " + id));

        if (!c.getUserId().equals(userId)) {
            throw new ResourceNotFoundException("Conversation not found for current user.");
        }

        List<AIMessage> msgs = messageRepository.findByConversationId(c.getId());
        List<Map<String, Object>> msgMaps = msgs.stream()
            .map(m -> Map.<String, Object>of(
                "role", m.getRole().name().toLowerCase(),
                "text", m.getContent(),
                "time", m.getCreatedAt().toString()
            ))
            .toList();

        return new AIConversationResponse(
            c.getId(),
            c.getTitle(),
            c.getContextMode().name(),
            msgs.size(),
            c.getUpdatedAt(),
            msgMaps
        );
    }

    public AIConversationResponse createConversation(AICreateConversationRequest request, UserPrincipal principal) {
        AIToolContext ctx = contextService.resolveContext(principal, request.mode(), null);
        String title = request.title() != null && !request.title().isBlank()
            ? inputSanitizer.sanitizeText(request.title())
            : "New Conversation";
        if (title.length() > 60) {
            title = title.substring(0, 60);
        }

        AIConversation conversation = new AIConversation(
            null,
            ctx.userId(),
            ctx.storeId(),
            ctx.contextMode(),
            title,
            Instant.now(),
            Instant.now()
        );
        conversation = conversationRepository.save(conversation);

        return new AIConversationResponse(
            conversation.getId(),
            conversation.getTitle(),
            conversation.getContextMode().name(),
            0,
            conversation.getCreatedAt(),
            List.of()
        );
    }

    public void deleteConversation(String id, String userId) {
        AIConversation c = conversationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Conversation not found: " + id));
        if (!c.getUserId().equals(userId)) {
            throw new com.bhagya.commerce.common.error.ForbiddenException("Access denied: You do not own this conversation.");
        }
        messageRepository.deleteByConversationId(id);
        conversationRepository.deleteById(id);
    }

    public void recordFeedback(AIFeedbackRequest request, String userId) {
        AIFeedbackRating rating = "HELPFUL".equalsIgnoreCase(request.rating())
            ? AIFeedbackRating.HELPFUL
            : AIFeedbackRating.NOT_HELPFUL;

        AIFeedback feedback = new AIFeedback(
            null,
            request.messageId(),
            userId,
            rating,
            request.feedbackText(),
            Instant.now()
        );
        feedbackRepository.save(feedback);

        auditService.record(
            "AI_FEEDBACK_SUBMITTED",
            userId,
            "AI_MESSAGE",
            request.messageId() != null ? request.messageId() : "unknown",
            Map.of("rating", rating.name(), "text", request.feedbackText() != null ? request.feedbackText() : "")
        );
    }
}
