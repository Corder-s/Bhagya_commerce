package com.bhagya.commerce.shipping.repository;

import com.bhagya.commerce.shipping.domain.Fulfillment;
import com.bhagya.commerce.shipping.domain.FulfillmentStatus;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Repository;

@Repository
public class FulfillmentRepository {

    private final Map<String, Fulfillment> storage = new ConcurrentHashMap<>();
    private final Map<String, String> orderIndex = new ConcurrentHashMap<>();

    public FulfillmentRepository() {
        // Seed initial fulfillment for seed order ord_9812
        Fulfillment f = new Fulfillment("ful_9812", "ord_9812", "store_varanasi_silk");
        f.setStatus(FulfillmentStatus.SHIPPED);
        f.setCarrier("Delhivery Express");
        f.setTrackingNumber("DLH-99281745");
        f.setNotes("High-value silk package with authentic weave certificate enclosed.");
        save(f);
    }

    public Optional<Fulfillment> findById(String id) {
        return Optional.ofNullable(storage.get(id));
    }

    public Optional<Fulfillment> findByOrderId(String orderId) {
        String id = orderIndex.get(orderId);
        return id != null ? Optional.ofNullable(storage.get(id)) : Optional.empty();
    }

    public List<Fulfillment> findByStoreId(String storeId) {
        return storage.values().stream()
            .filter(f -> f.getStoreId().equals(storeId))
            .toList();
    }

    public List<Fulfillment> findAll() {
        return new ArrayList<>(storage.values());
    }

    public Fulfillment save(Fulfillment fulfillment) {
        if (fulfillment.getId() == null) {
            fulfillment.setId("ful_" + System.currentTimeMillis());
        }
        storage.put(fulfillment.getId(), fulfillment);
        if (fulfillment.getOrderId() != null) {
            orderIndex.put(fulfillment.getOrderId(), fulfillment.getId());
        }
        return fulfillment;
    }
}
