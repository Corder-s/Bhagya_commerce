package com.bhagya.commerce.marketing.repository;

import com.bhagya.commerce.marketing.domain.Promotion;
import com.bhagya.commerce.marketing.domain.PromotionStatus;
import com.bhagya.commerce.marketing.domain.PromotionType;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Repository;

@Repository
public class PromotionRepository {

    private final Map<String, Promotion> storage = new ConcurrentHashMap<>();

    public PromotionRepository() {
        seedInitialPromotions();
    }

    private void seedInitialPromotions() {
        Instant now = Instant.now();
        String storeId = "store_varanasi_silk";

        Promotion p1 = new Promotion(
            "promo_festive_15",
            storeId,
            "Navratri Festive Offer",
            "15% off on pure GI-tagged handloom Banarasi sarees",
            PromotionType.PERCENTAGE_DISCOUNT,
            PromotionStatus.ACTIVE,
            new BigDecimal("15.00"),
            "INR",
            new BigDecimal("2999.00"),
            new BigDecimal("1500.00"),
            now.minus(5, ChronoUnit.DAYS),
            now.plus(25, ChronoUnit.DAYS),
            500,
            1
        );
        p1.setUsageCount(18);
        save(p1);

        Promotion p2 = new Promotion(
            "promo_welcome_500",
            storeId,
            "Artisan Heritage Welcome",
            "Flat ?500 off on your first handcrafted purchase above ?2,499",
            PromotionType.FIXED_DISCOUNT,
            PromotionStatus.ACTIVE,
            new BigDecimal("500.00"),
            "INR",
            new BigDecimal("2499.00"),
            new BigDecimal("500.00"),
            now.minus(15, ChronoUnit.DAYS),
            now.plus(60, ChronoUnit.DAYS),
            1000,
            1
        );
        p2.setUsageCount(42);
        save(p2);
    }

    public Promotion save(Promotion promotion) {
        if (promotion.getId() == null || promotion.getId().isBlank()) {
            promotion.setId("promo_" + System.currentTimeMillis() + "_" + (int) (Math.random() * 10000));
        }
        storage.put(promotion.getId(), promotion);
        return promotion;
    }

    public Optional<Promotion> findById(String id) {
        return Optional.ofNullable(storage.get(id));
    }

    public List<Promotion> findByStoreId(String storeId) {
        return storage.values().stream()
            .filter(p -> storeId == null || storeId.equals(p.getStoreId()))
            .toList();
    }

    public List<Promotion> findAll() {
        return new ArrayList<>(storage.values());
    }

    public void deleteById(String id) {
        storage.remove(id);
    }
}
