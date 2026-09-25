package com.bhagya.commerce.analytics.repository;

import com.bhagya.commerce.analytics.domain.AnalyticsEvent;
import com.bhagya.commerce.analytics.domain.AnalyticsEventType;
import com.bhagya.commerce.analytics.domain.AnalyticsSource;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Repository;

@Repository
public class AnalyticsEventRepository {

    private final Map<String, AnalyticsEvent> events = new ConcurrentHashMap<>();

    public AnalyticsEventRepository() {
        seedInitialEvents();
    }

    private void seedInitialEvents() {
        Instant now = Instant.now();
        String storeId = "store_varanasi_silk";

        // Seed customer behavioral funnel events across the last 7 days
        for (int i = 0; i < 7; i++) {
            Instant day = now.minus(i, ChronoUnit.DAYS);
            
            // Sessions & Views
            for (int v = 0; v < 40; v++) {
                String sessId = "sess_" + i + "_" + v;
                save(new AnalyticsEvent(
                    "evt_v_" + i + "_" + v,
                    AnalyticsEventType.PRODUCT_VIEWED,
                    "usr_cust_" + (v % 10),
                    "usr_cust_" + (v % 10),
                    "org_varanasi",
                    storeId,
                    sessId,
                    "PRODUCT",
                    "prod_01",
                    Map.of("category", "Sarees", "price", 3850, "utm_source", v % 3 == 0 ? "google" : "direct"),
                    day.minusSeconds(v * 600L),
                    AnalyticsSource.WEB
                ));

                if (v < 20) {
                    save(new AnalyticsEvent(
                        "evt_c_" + i + "_" + v,
                        AnalyticsEventType.PRODUCT_ADDED_TO_CART,
                        "usr_cust_" + (v % 10),
                        "usr_cust_" + (v % 10),
                        "org_varanasi",
                        storeId,
                        sessId,
                        "PRODUCT",
                        "prod_01",
                        Map.of("quantity", 1, "price", 3850),
                        day.minusSeconds(v * 500L),
                        AnalyticsSource.WEB
                    ));
                }

                if (v < 12) {
                    save(new AnalyticsEvent(
                        "evt_chk_" + i + "_" + v,
                        AnalyticsEventType.CHECKOUT_STARTED,
                        "usr_cust_" + (v % 10),
                        "usr_cust_" + (v % 10),
                        "org_varanasi",
                        storeId,
                        sessId,
                        "CART",
                        "cart_" + i + "_" + v,
                        Map.of("total", 3850),
                        day.minusSeconds(v * 400L),
                        AnalyticsSource.WEB
                    ));
                }

                if (v < 8) {
                    save(new AnalyticsEvent(
                        "evt_pay_" + i + "_" + v,
                        AnalyticsEventType.PAYMENT_STARTED,
                        "usr_cust_" + (v % 10),
                        "usr_cust_" + (v % 10),
                        "org_varanasi",
                        storeId,
                        sessId,
                        "PAYMENT",
                        "pay_" + i + "_" + v,
                        Map.of("method", "UPI", "amount", 3850),
                        day.minusSeconds(v * 300L),
                        AnalyticsSource.WEB
                    ));
                }

                if (v < 6) {
                    save(new AnalyticsEvent(
                        "evt_ord_" + i + "_" + v,
                        AnalyticsEventType.ORDER_CREATED,
                        "usr_cust_" + (v % 10),
                        "usr_cust_" + (v % 10),
                        "org_varanasi",
                        storeId,
                        sessId,
                        "ORDER",
                        "ord_" + i + "_" + v,
                        Map.of("total", 3850, "itemsCount", 1),
                        day.minusSeconds(v * 200L),
                        AnalyticsSource.BACKEND
                    ));
                }
            }
        }
    }

    public AnalyticsEvent save(AnalyticsEvent event) {
        if (event.getId() == null || event.getId().isBlank()) {
            event.setId("evt_" + System.currentTimeMillis() + "_" + (int) (Math.random() * 10000));
        }
        events.put(event.getId(), event);
        return event;
    }

    public Optional<AnalyticsEvent> findById(String id) {
        return Optional.ofNullable(events.get(id));
    }

    public List<AnalyticsEvent> findAll() {
        return new ArrayList<>(events.values());
    }

    public List<AnalyticsEvent> findByStoreIdAndOccurredAtBetween(String storeId, Instant start, Instant end) {
        return events.values().stream()
            .filter(e -> storeId == null || storeId.equals(e.getStoreId()))
            .filter(e -> (start == null || !e.getOccurredAt().isBefore(start)) && (end == null || !e.getOccurredAt().isAfter(end)))
            .toList();
    }

    public List<AnalyticsEvent> findByOccurredAtBetween(Instant start, Instant end) {
        return events.values().stream()
            .filter(e -> (start == null || !e.getOccurredAt().isBefore(start)) && (end == null || !e.getOccurredAt().isAfter(end)))
            .toList();
    }

    public long countByEventType(String storeId, AnalyticsEventType eventType, Instant start, Instant end) {
        return events.values().stream()
            .filter(e -> storeId == null || storeId.equals(e.getStoreId()))
            .filter(e -> e.getEventType() == eventType)
            .filter(e -> (start == null || !e.getOccurredAt().isBefore(start)) && (end == null || !e.getOccurredAt().isAfter(end)))
            .count();
    }

    public long countDistinctSessions(String storeId, Instant start, Instant end) {
        return events.values().stream()
            .filter(e -> storeId == null || storeId.equals(e.getStoreId()))
            .filter(e -> e.getSessionId() != null && !e.getSessionId().isBlank())
            .filter(e -> (start == null || !e.getOccurredAt().isBefore(start)) && (end == null || !e.getOccurredAt().isAfter(end)))
            .map(AnalyticsEvent::getSessionId)
            .distinct()
            .count();
    }
}
