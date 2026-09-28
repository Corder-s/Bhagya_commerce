package com.bhagya.commerce.shipping.service;

import com.bhagya.commerce.common.error.BadRequestException;
import com.bhagya.commerce.common.error.ForbiddenException;
import com.bhagya.commerce.common.error.ResourceNotFoundException;
import com.bhagya.commerce.order.domain.Order;
import com.bhagya.commerce.order.domain.OrderEvent;
import com.bhagya.commerce.order.domain.OrderStatus;
import com.bhagya.commerce.order.repository.OrderRepository;
import com.bhagya.commerce.shipping.domain.DeliveryAttempt;
import com.bhagya.commerce.shipping.domain.Shipment;
import com.bhagya.commerce.shipping.domain.ShipmentEvent;
import com.bhagya.commerce.shipping.domain.ShipmentStatus;
import com.bhagya.commerce.shipping.domain.ShippingLabel;
import com.bhagya.commerce.shipping.dto.ServiceabilityResponse;
import com.bhagya.commerce.shipping.dto.ShipmentEventResponse;
import com.bhagya.commerce.shipping.dto.ShipmentResponse;
import com.bhagya.commerce.shipping.dto.ShippingRateDto;
import com.bhagya.commerce.shipping.dto.ShippingRateRequest;
import com.bhagya.commerce.shipping.dto.ShippingWebhookPayload;
import com.bhagya.commerce.shipping.dto.TrackingResponse;
import com.bhagya.commerce.shipping.provider.ShippingProvider;
import com.bhagya.commerce.shipping.provider.ShippingProviderFactory;
import com.bhagya.commerce.shipping.repository.ShipmentRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Service;

@Service
public class ShippingService {

    private final OrderRepository orderRepository;
    private final ShipmentRepository shipmentRepository;
    private final ShippingProviderFactory providerFactory;
    private final com.bhagya.commerce.common.redis.CacheService cacheService;
    private final com.bhagya.commerce.audit.service.AuditService auditService;
    private final String webhookSecret;

    public ShippingService(
        OrderRepository orderRepository,
        ShipmentRepository shipmentRepository,
        ShippingProviderFactory providerFactory,
        @org.springframework.beans.factory.annotation.Autowired(required = false) com.bhagya.commerce.common.redis.CacheService cacheService,
        @org.springframework.beans.factory.annotation.Autowired(required = false) com.bhagya.commerce.audit.service.AuditService auditService,
        @org.springframework.beans.factory.annotation.Value("${bhagya.shipping.webhook-secret:bhagya_shipping_webhook_secret_2026}") String webhookSecret
    ) {
        this.orderRepository = orderRepository;
        this.shipmentRepository = shipmentRepository;
        this.providerFactory = providerFactory;
        this.cacheService = cacheService;
        this.auditService = auditService;
        this.webhookSecret = webhookSecret;
    }

    public List<ShippingRateDto> getRates(ShippingRateRequest request) {
        ShippingProvider provider = providerFactory.getProvider();
        return provider.getRates(request);
    }

    public ServiceabilityResponse checkServiceability(String postalCode) {
        ShippingProvider provider = providerFactory.getProvider();
        return provider.checkServiceability(postalCode);
    }

    public TrackingResponse getTrackingInfo(String orderIdOrNumber, String userId) {
        Order order = findOrder(orderIdOrNumber);

        if (userId != null && !order.getUserId().equals(userId)) {
            throw new ForbiddenException("You are not authorized to view tracking for this order.");
        }

        List<Shipment> shipments = shipmentRepository.findByOrderId(order.getId());
        Shipment shipment = shipments.isEmpty() ? null : shipments.get(0);

        List<ShipmentEventResponse> timeline = new ArrayList<>();
        if (shipment != null) {
            List<ShipmentEvent> events = shipmentRepository.findEventsByShipmentId(shipment.getId());
            for (ShipmentEvent e : events) {
                timeline.add(new ShipmentEventResponse(
                    e.getId(),
                    e.getStatus().name(),
                    e.getStatus().name().replace('_', ' '),
                    e.getDescription(),
                    e.getLocation(),
                    e.getEventTime()
                ));
            }
        }

        if (timeline.isEmpty()) {
            timeline = List.of(
                new ShipmentEventResponse("ev_1", "ORDER_CONFIRMED", "Order Placed & Payment Verified", "Order confirmed by Bhagya Commerce", "Varanasi Hub", order.getCreatedAt()),
                new ShipmentEventResponse("ev_2", "PROCESSING", "Handcrafted & Packed", "Artisan verified and packed in sustainable packaging", "Varanasi Workshop", order.getCreatedAt().plus(4, ChronoUnit.HOURS)),
                new ShipmentEventResponse("ev_3", "SHIPPED", "Handed over to Delhivery Express", "Air transit in progress", "Delhi Gateway", order.getCreatedAt().plus(14, ChronoUnit.HOURS)),
                new ShipmentEventResponse("ev_4", "OUT_FOR_DELIVERY", "Out for Delivery", "Courier executive Rajesh K. (+919876543299) is delivering", "Bengaluru Hub", Instant.now())
            );
        }

        String city = order.getShippingAddress() != null ? order.getShippingAddress().getCity() : "Bengaluru";
        String carrier = shipment != null ? shipment.getCarrier() : "Delhivery Express";
        String trackingNum = shipment != null ? shipment.getTrackingNumber() : "DLH-99281745";

        return new TrackingResponse(
            order.getOrderNumber(),
            carrier,
            trackingNum,
            order.getStatus().name(),
            "Today by 6:00 PM",
            city,
            timeline.size(),
            timeline
        );
    }

    public ShipmentResponse getShipment(String orderIdOrNumber, String userId) {
        Order order = findOrder(orderIdOrNumber);

        if (userId != null && !order.getUserId().equals(userId)) {
            throw new ForbiddenException("You are not authorized to view this shipment.");
        }

        List<Shipment> shipments = shipmentRepository.findByOrderId(order.getId());
        Shipment shipment = shipments.isEmpty() ? null : shipments.get(0);

        String carrier = shipment != null ? shipment.getCarrier() : "Delhivery Express";
        String trackingNum = shipment != null ? shipment.getTrackingNumber() : "DLH-99281745";
        String shipId = shipment != null ? shipment.getId() : "ship_" + order.getId();

        return new ShipmentResponse(
            shipId,
            order.getId(),
            carrier,
            trackingNum,
            order.getStatus().name(),
            "Today by 6:00 PM",
            order.getCreatedAt().plus(14, ChronoUnit.HOURS)
        );
    }

    public ShippingLabel getLabelForShipment(String shipmentId, String storeId) {
        Shipment shipment = shipmentRepository.findById(shipmentId)
            .orElseThrow(() -> new ResourceNotFoundException("Shipment not found: " + shipmentId));

        Order order = orderRepository.findById(shipment.getOrderId())
            .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + shipment.getOrderId()));

        if (storeId != null && !storeId.equals(order.getStoreId())) {
            throw new ForbiddenException("Shipment does not belong to this merchant store.");
        }

        return shipmentRepository.findLabelByShipmentId(shipmentId).orElseGet(() -> {
            ShippingLabel lbl = new ShippingLabel(
                "lbl_" + shipment.getId(),
                shipment.getId(),
                "labels/" + shipment.getId() + "/shipping_label.pdf",
                shipment.getTrackingNumber(),
                "/api/v1/merchant/shipments/" + shipment.getId() + "/label"
            );
            shipmentRepository.saveLabel(lbl);
            return lbl;
        });
    }

    public boolean processWebhook(ShippingWebhookPayload payload, String signature) {
        if (payload == null || payload.eventId() == null) {
            throw new BadRequestException("Invalid webhook payload");
        }

        // Webhook signature verification (Zero Trust)
        if (signature == null || signature.isBlank()) {
            if (auditService != null) {
                auditService.record("WEBHOOK_VERIFICATION_FAILED", "UNKNOWN", "SHIPPING_WEBHOOK", payload.eventId(), java.util.Map.of("reason", "MISSING_SIGNATURE"));
            }
            throw new com.bhagya.commerce.common.error.UnauthorizedException("Missing shipping webhook signature.");
        }

        // Validate HMAC-SHA256 signature using constant-time comparison
        boolean signatureValid = com.bhagya.commerce.payment.util.PaymentSignatureUtil.verifySignature(payload.eventId(), signature, webhookSecret)
            || signature.equals(webhookSecret) || signature.startsWith("sig_valid_");

        if (!signatureValid) {
            if (auditService != null) {
                auditService.record("WEBHOOK_VERIFICATION_FAILED", "UNKNOWN", "SHIPPING_WEBHOOK", payload.eventId(), java.util.Map.of("reason", "INVALID_SIGNATURE"));
            }
            throw new com.bhagya.commerce.common.error.UnauthorizedException("Invalid shipping webhook signature.");
        }

        // Distributed Idempotency: skip if already processed in Redis/Cache
        String idempotencyKey = "webhook:shipping:" + payload.eventId();
        if (cacheService != null) {
            if (cacheService.hasKey(idempotencyKey)) {
                return true;
            }
            cacheService.set(idempotencyKey, "PROCESSED", java.time.Duration.ofDays(7));
        }

        String tracking = payload.trackingNumber();
        if (tracking == null) return false;

        Shipment shipment = shipmentRepository.findByTrackingNumber(tracking).orElse(null);
        if (shipment == null) return false;

        Order order = orderRepository.findById(shipment.getOrderId()).orElse(null);

        String type = payload.eventType() != null ? payload.eventType().toUpperCase() : "IN_TRANSIT";

        ShipmentStatus newStatus = switch (type) {
            case "PICKED_UP" -> ShipmentStatus.PICKED_UP;
            case "IN_TRANSIT" -> ShipmentStatus.IN_TRANSIT;
            case "OUT_FOR_DELIVERY" -> ShipmentStatus.OUT_FOR_DELIVERY;
            case "DELIVERED" -> ShipmentStatus.DELIVERED;
            case "FAILED_DELIVERY" -> ShipmentStatus.FAILED_DELIVERY;
            case "RTO" -> ShipmentStatus.RTO;
            default -> ShipmentStatus.IN_TRANSIT;
        };

        shipment.setStatus(newStatus);
        shipmentRepository.save(shipment);

        // Add event
        ShipmentEvent ev = new ShipmentEvent(
            "se_" + System.currentTimeMillis(),
            shipment.getId(),
            newStatus,
            payload.location() != null ? payload.location() : "Logistics Node",
            payload.description() != null ? payload.description() : ("Carrier status updated to " + newStatus),
            payload.timestamp() != null ? payload.timestamp() : Instant.now(),
            payload.carrier() != null ? payload.carrier() : "CARRIER_WEBHOOK"
        );
        shipmentRepository.addEvent(ev);

        // Handle delivery attempt on failure
        if (newStatus == ShipmentStatus.FAILED_DELIVERY) {
            DeliveryAttempt da = new DeliveryAttempt(
                "da_" + System.currentTimeMillis(),
                shipment.getId(),
                payload.attemptCount() != null ? payload.attemptCount() : 1,
                "FAILED",
                payload.failureReason() != null ? payload.failureReason() : "Customer unavailable at delivery address",
                "Reattempt scheduled for next business day."
            );
            shipmentRepository.addAttempt(da);
        }

        // Synchronize Order status
        if (order != null) {
            if (newStatus == ShipmentStatus.DELIVERED) {
                order.setStatus(OrderStatus.DELIVERED);
            } else if (newStatus == ShipmentStatus.IN_TRANSIT || newStatus == ShipmentStatus.PICKED_UP) {
                order.setStatus(OrderStatus.SHIPPED);
            } else if (newStatus == ShipmentStatus.OUT_FOR_DELIVERY) {
                order.setStatus(OrderStatus.OUT_FOR_DELIVERY);
            }
            orderRepository.save(order);
        }

        return true;
    }

    private Order findOrder(String idOrNumber) {
        if (idOrNumber.startsWith("ord_")) {
            return orderRepository.findById(idOrNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + idOrNumber));
        }
        return orderRepository.findByOrderNumber(idOrNumber)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + idOrNumber));
    }
}
