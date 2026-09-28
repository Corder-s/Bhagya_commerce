package com.bhagya.commerce.ai.service;

import com.bhagya.commerce.ai.domain.AIActionConfirmation;
import com.bhagya.commerce.ai.domain.AIActionStatus;
import com.bhagya.commerce.ai.dto.AIActionConfirmationDto;
import com.bhagya.commerce.ai.repository.AIActionConfirmationRepository;
import com.bhagya.commerce.audit.service.AuditService;
import com.bhagya.commerce.catalog.product.domain.Product;
import com.bhagya.commerce.catalog.product.repository.ProductRepository;
import com.bhagya.commerce.common.error.BadRequestException;
import com.bhagya.commerce.common.error.ForbiddenException;
import com.bhagya.commerce.common.error.ResourceNotFoundException;
import com.bhagya.commerce.order.service.OrderService;
import java.time.Instant;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class AIActionConfirmationService {

    private final AIActionConfirmationRepository confirmationRepository;
    private final ProductRepository productRepository;
    private final OrderService orderService;
    private final AuditService auditService;

    public AIActionConfirmationService(
        AIActionConfirmationRepository confirmationRepository,
        ProductRepository productRepository,
        OrderService orderService,
        AuditService auditService
    ) {
        this.confirmationRepository = confirmationRepository;
        this.productRepository = productRepository;
        this.orderService = orderService;
        this.auditService = auditService;
    }

    public AIActionConfirmationDto confirmOrCancelAction(String actionId, String userId, boolean confirmed) {
        AIActionConfirmation action = confirmationRepository.findById(actionId)
            .orElseThrow(() -> new ResourceNotFoundException("AI action confirmation not found: " + actionId));

        // Ownership and authorization revalidation
        if (!action.getUserId().equals(userId)) {
            throw new ForbiddenException("You are not authorized to confirm this action.");
        }

        if (action.isExpired()) {
            action.setStatus(AIActionStatus.FAILED);
            confirmationRepository.save(action);
            throw new BadRequestException("This AI proposed action has expired. Please initiate the request again.");
        }

        if (action.getStatus() != AIActionStatus.PENDING_CONFIRMATION) {
            throw new BadRequestException("Action has already been processed with status: " + action.getStatus());
        }

        if (!confirmed) {
            action.setStatus(AIActionStatus.CANCELLED);
            action.setConfirmedAt(Instant.now());
            confirmationRepository.save(action);

            auditService.record(
                "AI_ACTION_CANCELLED",
                userId,
                "AI_ACTION",
                actionId,
                Map.of("actionType", action.getActionType(), "summary", action.getSummary())
            );

            return mapToDto(action);
        }

        // Execute authoritative mutation based on actionType
        Map<String, Object> payload = action.getActionPayload();
        Map<String, Object> result;

        try {
            switch (action.getActionType()) {
                case "UPDATE_INVENTORY_STOCK" -> {
                    String productId = (String) payload.get("productId");
                    int newStock = ((Number) payload.get("newStock")).intValue();

                    Product product = productRepository.findById(productId)
                        .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + productId));

                    int oldStock = product.getStockQuantity();
                    product.setStockQuantity(newStock);
                    productRepository.save(product);

                    result = Map.of(
                        "productId", productId,
                        "productName", product.getName(),
                        "previousStock", oldStock,
                        "updatedStock", newStock,
                        "executedAt", Instant.now().toString()
                    );
                }
                case "CANCEL_ORDER" -> {
                    String orderId = (String) payload.get("orderId");
                    String reason = (String) payload.getOrDefault("reason", "Cancelled by merchant via AI Copilot");

                    var cancelledOrder = orderService.cancelOrder(orderId, userId, reason);
                    result = Map.of(
                        "orderId", cancelledOrder.id(),
                        "orderNumber", cancelledOrder.orderNumber(),
                        "status", cancelledOrder.status().name(),
                        "executedAt", Instant.now().toString()
                    );
                }
                default -> throw new BadRequestException("Unsupported mutating action type: " + action.getActionType());
            }

            action.setStatus(AIActionStatus.EXECUTED);
            action.setConfirmedAt(Instant.now());
            action.setExecutionResult(result);
            confirmationRepository.save(action);

            auditService.record(
                "AI_ACTION_EXECUTED",
                userId,
                "AI_ACTION",
                actionId,
                Map.of("actionType", action.getActionType(), "result", result)
            );

            return mapToDto(action);
        } catch (Exception e) {
            action.setStatus(AIActionStatus.FAILED);
            confirmationRepository.save(action);
            auditService.record(
                "AI_ACTION_FAILED",
                userId,
                "AI_ACTION",
                actionId,
                Map.of("error", e.getMessage())
            );
            throw new BadRequestException("Action execution failed: " + e.getMessage());
        }
    }

    public AIActionConfirmationDto getAction(String actionId, String userId) {
        AIActionConfirmation action = confirmationRepository.findById(actionId)
            .orElseThrow(() -> new ResourceNotFoundException("Action not found: " + actionId));

        if (!action.getUserId().equals(userId)) {
            throw new ForbiddenException("Unauthorized to view this action.");
        }

        return mapToDto(action);
    }

    private AIActionConfirmationDto mapToDto(AIActionConfirmation a) {
        return new AIActionConfirmationDto(
            a.getId(),
            a.getActionType(),
            a.getStatus().name(),
            a.getSummary(),
            a.getActionPayload(),
            a.getExpiresAt()
        );
    }
}
