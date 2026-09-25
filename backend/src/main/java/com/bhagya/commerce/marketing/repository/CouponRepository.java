package com.bhagya.commerce.marketing.repository;

import com.bhagya.commerce.marketing.domain.Coupon;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Repository;

@Repository
public class CouponRepository {

    private final Map<String, Coupon> storage = new ConcurrentHashMap<>();

    public CouponRepository() {
        seedInitialCoupons();
    }

    private void seedInitialCoupons() {
        Instant now = Instant.now();
        String storeId = "store_varanasi_silk";

        Coupon c1 = new Coupon(
            "coup_festive_15",
            "promo_festive_15",
            storeId,
            "NAVRATRI15",
            500,
            1,
            now.minus(5, ChronoUnit.DAYS),
            now.plus(25, ChronoUnit.DAYS)
        );
        c1.setUsageCount(18);
        save(c1);

        Coupon c2 = new Coupon(
            "coup_welcome_500",
            "promo_welcome_500",
            storeId,
            "WELCOME500",
            1000,
            1,
            now.minus(15, ChronoUnit.DAYS),
            now.plus(60, ChronoUnit.DAYS)
        );
        c2.setUsageCount(42);
        save(c2);
    }

    public Coupon save(Coupon coupon) {
        if (coupon.getId() == null || coupon.getId().isBlank()) {
            coupon.setId("coup_" + System.currentTimeMillis() + "_" + (int) (Math.random() * 10000));
        }
        storage.put(coupon.getId(), coupon);
        return coupon;
    }

    public Optional<Coupon> findById(String id) {
        return Optional.ofNullable(storage.get(id));
    }

    public Optional<Coupon> findByStoreIdAndCode(String storeId, String code) {
        if (code == null) return Optional.empty();
        String norm = code.trim().toUpperCase();
        return storage.values().stream()
            .filter(c -> storeId == null || storeId.equals(c.getStoreId()))
            .filter(c -> norm.equals(c.getCode()))
            .findFirst();
    }

    public Optional<Coupon> findByPromotionId(String promotionId) {
        return storage.values().stream()
            .filter(c -> c.getPromotionId().equals(promotionId))
            .findFirst();
    }

    public List<Coupon> findByStoreId(String storeId) {
        return storage.values().stream()
            .filter(c -> storeId == null || storeId.equals(c.getStoreId()))
            .toList();
    }
}
