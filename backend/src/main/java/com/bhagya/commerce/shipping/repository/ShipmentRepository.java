package com.bhagya.commerce.shipping.repository;

import com.bhagya.commerce.shipping.domain.DeliveryAttempt;
import com.bhagya.commerce.shipping.domain.PickupRequest;
import com.bhagya.commerce.shipping.domain.Shipment;
import com.bhagya.commerce.shipping.domain.ShipmentEvent;
import com.bhagya.commerce.shipping.domain.ShipmentStatus;
import com.bhagya.commerce.shipping.domain.ShippingLabel;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import org.springframework.stereotype.Repository;

@Repository
public class ShipmentRepository {

    private final Map<String, Shipment> shipmentStorage = new ConcurrentHashMap<>();
    private final Map<String, String> trackingIndex = new ConcurrentHashMap<>();
    private final Map<String, List<ShipmentEvent>> eventStorage = new ConcurrentHashMap<>();
    private final Map<String, ShippingLabel> labelStorage = new ConcurrentHashMap<>();
    private final Map<String, PickupRequest> pickupStorage = new ConcurrentHashMap<>();
    private final Map<String, List<DeliveryAttempt>> attemptStorage = new ConcurrentHashMap<>();

    public ShipmentRepository() {
        // Seed default shipment for ord_9812
        Shipment s = new Shipment(
            "ship_ord_9812",
            "ord_9812",
            "Delhivery Express",
            "DLH-99281745",
            ShipmentStatus.OUT_FOR_DELIVERY,
            Instant.now().plus(4, ChronoUnit.HOURS)
        );
        s.setOrigin("Varanasi Artisan Hub, UP");
        s.setDestination("Bengaluru Hub, KA");
        save(s);

        List<ShipmentEvent> events = new CopyOnWriteArrayList<>();
        events.add(new ShipmentEvent("se_1", s.getId(), ShipmentStatus.MANIFESTED, "Varanasi Hub", "Electronic manifest created", Instant.now().minus(24, ChronoUnit.HOURS), "DELHIVERY_CARRIER"));
        events.add(new ShipmentEvent("se_2", s.getId(), ShipmentStatus.PICKED_UP, "Varanasi Workshop", "Package received from artisan", Instant.now().minus(18, ChronoUnit.HOURS), "DELHIVERY_CARRIER"));
        events.add(new ShipmentEvent("se_3", s.getId(), ShipmentStatus.IN_TRANSIT, "Delhi Gateway", "Surface transit processed", Instant.now().minus(10, ChronoUnit.HOURS), "DELHIVERY_CARRIER"));
        events.add(new ShipmentEvent("se_4", s.getId(), ShipmentStatus.OUT_FOR_DELIVERY, "Bengaluru Central", "Out for delivery with executive Rajesh K.", Instant.now().minus(1, ChronoUnit.HOURS), "DELHIVERY_CARRIER"));
        eventStorage.put(s.getId(), events);

        ShippingLabel label = new ShippingLabel(
            "lbl_ord_9812",
            s.getId(),
            "labels/ship_ord_9812/label.pdf",
            s.getTrackingNumber(),
            "/api/v1/merchant/shipments/" + s.getId() + "/label"
        );
        labelStorage.put(s.getId(), label);
    }

    public Optional<Shipment> findById(String id) {
        return Optional.ofNullable(shipmentStorage.get(id));
    }

    public Optional<Shipment> findByTrackingNumber(String trackingNumber) {
        String id = trackingIndex.get(trackingNumber);
        return id != null ? Optional.ofNullable(shipmentStorage.get(id)) : Optional.empty();
    }

    public List<Shipment> findByOrderId(String orderId) {
        return shipmentStorage.values().stream()
            .filter(s -> s.getOrderId().equals(orderId))
            .toList();
    }

    public List<Shipment> findAll() {
        return new ArrayList<>(shipmentStorage.values());
    }

    public Shipment save(Shipment shipment) {
        if (shipment.getId() == null) {
            shipment.setId("ship_" + System.currentTimeMillis());
        }
        shipmentStorage.put(shipment.getId(), shipment);
        if (shipment.getTrackingNumber() != null) {
            trackingIndex.put(shipment.getTrackingNumber(), shipment.getId());
        }
        return shipment;
    }

    public List<ShipmentEvent> findEventsByShipmentId(String shipmentId) {
        return eventStorage.getOrDefault(shipmentId, Collections.emptyList());
    }

    public void addEvent(ShipmentEvent event) {
        eventStorage.computeIfAbsent(event.getShipmentId(), k -> new CopyOnWriteArrayList<>()).add(event);
    }

    public Optional<ShippingLabel> findLabelByShipmentId(String shipmentId) {
        return Optional.ofNullable(labelStorage.get(shipmentId));
    }

    public void saveLabel(ShippingLabel label) {
        labelStorage.put(label.getShipmentId(), label);
    }

    public Optional<PickupRequest> findPickupByShipmentId(String shipmentId) {
        return Optional.ofNullable(pickupStorage.get(shipmentId));
    }

    public void savePickup(PickupRequest request) {
        pickupStorage.put(request.getShipmentId(), request);
    }

    public List<DeliveryAttempt> findAttemptsByShipmentId(String shipmentId) {
        return attemptStorage.getOrDefault(shipmentId, Collections.emptyList());
    }

    public void addAttempt(DeliveryAttempt attempt) {
        attemptStorage.computeIfAbsent(attempt.getShipmentId(), k -> new CopyOnWriteArrayList<>()).add(attempt);
    }
}
