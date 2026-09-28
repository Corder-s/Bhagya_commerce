package com.bhagya.commerce.analytics.repository;

import com.bhagya.commerce.analytics.domain.AlertStatus;
import com.bhagya.commerce.analytics.domain.IntelligenceAlert;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Repository;

@Repository
public class IntelligenceAlertRepository {

    private final Map<String, IntelligenceAlert> storage = new ConcurrentHashMap<>();

    public IntelligenceAlertRepository() {
        seedInitialAlerts();
    }

    private void seedInitialAlerts() {
        String storeId = "store_varanasi_silk";
        IntelligenceAlert a1 = new IntelligenceAlert(
            "alt_inv_01",
            storeId,
            "LOW_STOCK",
            "WARNING",
            "prod_03",
            new java.math.BigDecimal("3"),
            new java.math.BigDecimal("15"),
            "Low Inventory Alert: Mysore Sandalwood Incense Cones",
            "Only 3 units remaining. Current 7-day velocity indicates possible stockout within 48 hours."
        );
        a1.getMetadata().put("productId", "prod_03");
        a1.getMetadata().put("productName", "Mysore Sandalwood Incense Cones");
        a1.getMetadata().put("velocityPerDay", 1.8);
        save(a1);

        IntelligenceAlert a2 = new IntelligenceAlert(
            "alt_perf_02",
            storeId,
            "CONVERSION_OPPORTUNITY",
            "INFO",
            "prod_04",
            new java.math.BigDecimal("0.0"),
            new java.math.BigDecimal("3.5"),
            "High Traffic / Low Conversion Signal: Jaipur Blue Pottery",
            "Product received 85 views this week but zero completed orders. High interest with low conversion."
        );
        a2.getMetadata().put("productId", "prod_04");
        a2.getMetadata().put("views", 85);
        a2.getMetadata().put("conversions", 0);
        save(a2);
    }

    public IntelligenceAlert save(IntelligenceAlert alert) {
        if (alert.getId() == null || alert.getId().isBlank()) {
            alert.setId("alt_" + System.currentTimeMillis() + "_" + (int) (Math.random() * 1000));
        }
        storage.put(alert.getId(), alert);
        return alert;
    }

    public Optional<IntelligenceAlert> findById(String id) {
        return Optional.ofNullable(storage.get(id));
    }

    public List<IntelligenceAlert> findByStoreId(String storeId) {
        return storage.values().stream()
            .filter(a -> storeId == null || a.getStoreId().equals(storeId))
            .sorted(Comparator.comparing(IntelligenceAlert::getDetectedAt).reversed())
            .toList();
    }

    public List<IntelligenceAlert> findByStoreIdAndStatus(String storeId, AlertStatus status) {
        return storage.values().stream()
            .filter(a -> (storeId == null || a.getStoreId().equals(storeId)) && a.getStatus() == status)
            .sorted(Comparator.comparing(IntelligenceAlert::getDetectedAt).reversed())
            .toList();
    }
}
