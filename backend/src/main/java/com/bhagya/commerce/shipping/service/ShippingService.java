package com.bhagya.commerce.shipping.service;

import com.bhagya.commerce.common.error.ForbiddenException;
import com.bhagya.commerce.common.error.ResourceNotFoundException;
import com.bhagya.commerce.order.domain.Order;
import com.bhagya.commerce.order.repository.OrderRepository;
import com.bhagya.commerce.shipping.dto.ShipmentEventResponse;
import com.bhagya.commerce.shipping.dto.ShipmentResponse;
import com.bhagya.commerce.shipping.dto.TrackingResponse;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ShippingService {

    private final OrderRepository orderRepository;

    public ShippingService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public TrackingResponse getTrackingInfo(String orderIdOrNumber, String userId) {
        Order order = findOrder(orderIdOrNumber);

        if (!order.getUserId().equals(userId)) {
            throw new ForbiddenException("You are not authorized to view tracking for this order.");
        }

        List<ShipmentEventResponse> timeline = List.of(
            new ShipmentEventResponse("ev_1", "ORDER_CONFIRMED", "Order Placed & Payment Verified", "Order confirmed by Bhagya Commerce", "Varanasi Hub", order.getCreatedAt()),
            new ShipmentEventResponse("ev_2", "PROCESSING", "Handcrafted & Packed", "Artisan verified and packed in sustainable packaging", "Varanasi Workshop", order.getCreatedAt().plus(4, ChronoUnit.HOURS)),
            new ShipmentEventResponse("ev_3", "SHIPPED", "Handed over to Delhivery Express", "Air transit in progress", "Delhi Gateway", order.getCreatedAt().plus(14, ChronoUnit.HOURS)),
            new ShipmentEventResponse("ev_4", "OUT_FOR_DELIVERY", "Out for Delivery", "Courier executive Rajesh K. (+919876543299) is delivering", "Bengaluru Hub", Instant.now())
        );

        String city = order.getShippingAddress() != null ? order.getShippingAddress().getCity() : "Bengaluru";

        return new TrackingResponse(
            order.getOrderNumber(),
            "Delhivery Express",
            "DLH-99281745",
            order.getStatus().name(),
            "Today by 6:00 PM",
            city,
            3,
            timeline
        );
    }

    public ShipmentResponse getShipment(String orderIdOrNumber, String userId) {
        Order order = findOrder(orderIdOrNumber);

        if (!order.getUserId().equals(userId)) {
            throw new ForbiddenException("You are not authorized to view this shipment.");
        }

        return new ShipmentResponse(
            "ship_" + order.getId(),
            order.getId(),
            "Delhivery Express",
            "DLH-99281745",
            order.getStatus().name(),
            "Today by 6:00 PM",
            order.getCreatedAt().plus(14, ChronoUnit.HOURS)
        );
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
