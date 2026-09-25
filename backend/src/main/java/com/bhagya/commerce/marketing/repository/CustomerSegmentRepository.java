package com.bhagya.commerce.marketing.repository;

import com.bhagya.commerce.marketing.domain.CustomerSegment;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Repository;

@Repository
public class CustomerSegmentRepository {

    private final Map<String, CustomerSegment> storage = new ConcurrentHashMap<>();

    public CustomerSegmentRepository() {
        seedInitialSegments();
    }

    private void seedInitialSegments() {
        String storeId = "store_varanasi_silk";

        save(new CustomerSegment(
            "seg_all",
            storeId,
            "All Verified Customers",
            "Every customer who has created an account or placed an order with the store",
            Map.of("type", "ALL_CUSTOMERS"),
            142
        ));

        save(new CustomerSegment(
            "seg_returning",
            storeId,
            "Repeat Buyers & Connoisseurs",
            "Customers with 2 or more delivered handcrafted orders",
            Map.of("type", "RETURNING_CUSTOMERS", "minOrders", 2),
            38
        ));

        save(new CustomerSegment(
            "seg_high_value",
            storeId,
            "High-Value Silk Collectors",
            "Customers who have spent above ?10,000 in total",
            Map.of("type", "SPEND_THRESHOLD", "minSpend", 10000),
            24
        ));

        save(new CustomerSegment(
            "seg_cart_abandoners",
            storeId,
            "Recent Cart Drop-offs",
            "Customers who added items to bag in the last 7 days without checking out",
            Map.of("type", "CART_DROP_OFF", "daysWindow", 7),
            19
        ));
    }

    public CustomerSegment save(CustomerSegment segment) {
        if (segment.getId() == null || segment.getId().isBlank()) {
            segment.setId("seg_" + System.currentTimeMillis() + "_" + (int) (Math.random() * 10000));
        }
        storage.put(segment.getId(), segment);
        return segment;
    }

    public Optional<CustomerSegment> findById(String id) {
        return Optional.ofNullable(storage.get(id));
    }

    public List<CustomerSegment> findByStoreId(String storeId) {
        return storage.values().stream()
            .filter(s -> storeId == null || storeId.equals(s.getStoreId()))
            .toList();
    }

    public List<CustomerSegment> findAll() {
        return new ArrayList<>(storage.values());
    }
}
