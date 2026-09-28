package com.bhagya.commerce.shipping.service;

import com.bhagya.commerce.common.error.BadRequestException;
import com.bhagya.commerce.common.error.ForbiddenException;
import com.bhagya.commerce.common.error.ResourceNotFoundException;
import com.bhagya.commerce.order.domain.Order;
import com.bhagya.commerce.order.domain.OrderEvent;
import com.bhagya.commerce.order.domain.OrderStatus;
import com.bhagya.commerce.order.repository.OrderRepository;
import com.bhagya.commerce.shipping.domain.DeliveryAttempt;
import com.bhagya.commerce.shipping.domain.Fulfillment;
import com.bhagya.commerce.shipping.domain.FulfillmentStatus;
import com.bhagya.commerce.shipping.domain.PickupRequest;
import com.bhagya.commerce.shipping.domain.Shipment;
import com.bhagya.commerce.shipping.domain.ShipmentEvent;
import com.bhagya.commerce.shipping.domain.ShipmentStatus;
import com.bhagya.commerce.shipping.domain.ShippingLabel;
import com.bhagya.commerce.shipping.dto.CreateShipmentRequest;
import com.bhagya.commerce.shipping.dto.FulfillmentActionRequest;
import com.bhagya.commerce.shipping.dto.PickupRequestDto;
import com.bhagya.commerce.shipping.provider.ShippingProvider;
import com.bhagya.commerce.shipping.provider.ShippingProviderFactory;
import com.bhagya.commerce.shipping.repository.FulfillmentRepository;
import com.bhagya.commerce.shipping.repository.ShipmentRepository;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class FulfillmentService {

    private final FulfillmentRepository fulfillmentRepository;
    private final ShipmentRepository shipmentRepository;
    private final OrderRepository orderRepository;
    private final ShippingProviderFactory providerFactory;

    public FulfillmentService(
        FulfillmentRepository fulfillmentRepository,
        ShipmentRepository shipmentRepository,
        OrderRepository orderRepository,
        ShippingProviderFactory providerFactory
    ) {
        this.fulfillmentRepository = fulfillmentRepository;
        this.shipmentRepository = shipmentRepository;
        this.orderRepository = orderRepository;
        this.providerFactory = providerFactory;
    }

    public Fulfillment getOrCreateFulfillment(String orderId, String storeId) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));

        if (storeId != null && !storeId.equals(order.getStoreId())) {
            throw new ForbiddenException("Order does not belong to this store.");
        }

        return fulfillmentRepository.findByOrderId(orderId).orElseGet(() -> {
            Fulfillment f = new Fulfillment(
                "ful_" + UUID.randomUUID().toString().substring(0, 8),
                orderId,
                order.getStoreId()
            );
            return fulfillmentRepository.save(f);
        });
    }

    public Fulfillment handleAction(String orderId, String storeId, FulfillmentActionRequest request) {
        Fulfillment fulfillment = getOrCreateFulfillment(orderId, storeId);
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));

        String action = request.action() != null ? request.action().toUpperCase() : "PROCESS";

        switch (action) {
            case "PROCESS" -> {
                fulfillment.setStatus(FulfillmentStatus.PROCESSING);
                order.setStatus(OrderStatus.PROCESSING);
                order.getEvents().add(new OrderEvent("oe_" + System.currentTimeMillis(), orderId, OrderStatus.PROCESSING, "Order Processing Started", "Merchant verified items and began packaging."));
            }
            case "PACK" -> {
                fulfillment.setStatus(FulfillmentStatus.PACKED);
                if (request.weightKg() != null) fulfillment.setPackageWeightKg(request.weightKg());
                if (request.dimensions() != null) fulfillment.setPackageDimensions(request.dimensions());
                if (request.notes() != null) fulfillment.setNotes(request.notes());
                order.getEvents().add(new OrderEvent("oe_" + System.currentTimeMillis(), orderId, OrderStatus.PROCESSING, "Package Packed & Inspected", "Enclosed authenticity certificate and eco-packaging."));
            }
            case "CREATE_SHIPMENT" -> {
                ShippingProvider provider = providerFactory.getProvider();
                CreateShipmentRequest shipReq = new CreateShipmentRequest(
                    orderId,
                    request.carrier() != null ? request.carrier() : "Delhivery Express",
                    request.weightKg() != null ? request.weightKg() : fulfillment.getPackageWeightKg(),
                    request.dimensions() != null ? request.dimensions() : fulfillment.getPackageDimensions(),
                    request.notes()
                );
                Shipment shipment = provider.createShipment(shipReq, order.getOrderNumber());
                shipmentRepository.save(shipment);

                // Create initial shipment event
                ShipmentEvent ev = new ShipmentEvent(
                    "se_" + System.currentTimeMillis(),
                    shipment.getId(),
                    ShipmentStatus.MANIFESTED,
                    "Merchant Artisan Hub",
                    "Shipping manifest generated with AWB " + shipment.getTrackingNumber(),
                    Instant.now(),
                    provider.getProviderName()
                );
                shipmentRepository.addEvent(ev);

                // Generate label
                ShippingLabel label = provider.generateLabel(shipment.getId(), shipment.getTrackingNumber());
                shipmentRepository.saveLabel(label);

                fulfillment.setStatus(FulfillmentStatus.READY_FOR_PICKUP);
                fulfillment.setCarrier(shipment.getCarrier());
                fulfillment.setTrackingNumber(shipment.getTrackingNumber());
            }
            case "REQUEST_PICKUP" -> {
                ShippingProvider provider = providerFactory.getProvider();
                List<Shipment> shipments = shipmentRepository.findByOrderId(orderId);
                String shipmentId = shipments.isEmpty() ? "ship_" + orderId : shipments.get(0).getId();

                PickupRequestDto pickupDto = new PickupRequestDto(
                    shipmentId,
                    fulfillment.getCarrier() != null ? fulfillment.getCarrier() : "Delhivery Express",
                    Instant.now().plusSeconds(86400),
                    request.notes() != null ? request.notes() : "Pick up at front warehouse desk"
                );
                PickupRequest pickup = provider.requestPickup(pickupDto);
                shipmentRepository.savePickup(pickup);

                fulfillment.setStatus(FulfillmentStatus.READY_FOR_PICKUP);
            }
            case "SHIP" -> {
                fulfillment.setStatus(FulfillmentStatus.SHIPPED);
                order.setStatus(OrderStatus.SHIPPED);
                order.getEvents().add(new OrderEvent("oe_" + System.currentTimeMillis(), orderId, OrderStatus.SHIPPED, "Handed to Courier", "Shipment handed over to courier partner."));
            }
            case "DELIVER" -> {
                fulfillment.setStatus(FulfillmentStatus.DELIVERED);
                order.setStatus(OrderStatus.DELIVERED);
                order.getEvents().add(new OrderEvent("oe_" + System.currentTimeMillis(), orderId, OrderStatus.DELIVERED, "Order Delivered", "Delivered successfully to customer."));
            }
            case "CANCEL" -> {
                fulfillment.setStatus(FulfillmentStatus.CANCELLED);
                order.setStatus(OrderStatus.CANCELLED);
                order.getEvents().add(new OrderEvent("oe_" + System.currentTimeMillis(), orderId, OrderStatus.CANCELLED, "Fulfillment Cancelled", "Merchant cancelled fulfillment."));
            }
            default -> throw new BadRequestException("Unknown fulfillment action: " + action);
        }

        orderRepository.save(order);
        return fulfillmentRepository.save(fulfillment);
    }
}
