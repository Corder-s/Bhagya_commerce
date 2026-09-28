package com.bhagya.commerce.analytics.repository;

import com.bhagya.commerce.analytics.domain.IntelligenceInsight;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Repository;

@Repository
public class IntelligenceInsightRepository {

    private final Map<String, IntelligenceInsight> storage = new ConcurrentHashMap<>();

    public IntelligenceInsightRepository() {
        seedInitialInsights();
    }

    private void seedInitialInsights() {
        String storeId = "store_varanasi_silk";

        IntelligenceInsight ins1 = new IntelligenceInsight(
            "ins_perf_01",
            storeId,
            "PERFORMANCE",
            "INFO",
            "Chanderi Silk Saree driving 72% of net revenue",
            "Net sales for Handloom Chanderi Silk Saree reached ₹3,850.00 across recent transactions, making it the primary catalog revenue contributor.",
            "Authoritative Order Ledger (ORD-2026-9812): 1 unit @ ₹3,850.00. 12 units remaining in stock.",
            "NET_REVENUE",
            "Consider bundling with brass temple accessories or highlighting on the storefront hero banner."
        );
        save(ins1);

        IntelligenceInsight ins2 = new IntelligenceInsight(
            "ins_inv_02",
            storeId,
            "INVENTORY",
            "WARNING",
            "Inventory depletion velocity accelerating for Sandalwood Cones",
            "Stock decreased to 3 units following consecutive order dispatches. At current customer purchase rates, stockout will occur shortly.",
            "Current stock: 3 units. Recent order velocity: ~1.5 units/day over 7-day period.",
            "STOCKOUT_RISK",
            "Consider initiating batch reordering with your Mysore artisans to preserve order fulfillment continuity."
        );
        save(ins2);

        IntelligenceInsight ins3 = new IntelligenceInsight(
            "ins_cust_03",
            storeId,
            "CUSTOMER",
            "INFO",
            "Patron repeat engagement rate steady at 33.3%",
            "Returning patrons represent 1 out of 3 customers in the last 30 days with verified lifetime average order value above ₹4,000.",
            "Customer cohort analysis: 3 unique patrons in window, 1 returning patron with multiple lifetime transactions.",
            "REPEAT_PURCHASE_RATE",
            "Consider engaging High-Value and At-Risk segments with curated GI craft loyalty points campaigns."
        );
        save(ins3);
    }

    public IntelligenceInsight save(IntelligenceInsight insight) {
        if (insight.getId() == null || insight.getId().isBlank()) {
            insight.setId("ins_" + System.currentTimeMillis() + "_" + (int) (Math.random() * 1000));
        }
        storage.put(insight.getId(), insight);
        return insight;
    }

    public Optional<IntelligenceInsight> findById(String id) {
        return Optional.ofNullable(storage.get(id));
    }

    public List<IntelligenceInsight> findByStoreId(String storeId) {
        return storage.values().stream()
            .filter(i -> storeId == null || i.getStoreId().equals(storeId))
            .sorted(Comparator.comparing(IntelligenceInsight::getDetectedAt).reversed())
            .toList();
    }
}
