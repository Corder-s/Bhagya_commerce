package com.bhagya.commerce.analytics.repository;

import com.bhagya.commerce.analytics.domain.ForecastRecord;
import java.math.BigDecimal;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Repository;

@Repository
public class ForecastRecordRepository {

    private final Map<String, ForecastRecord> storage = new ConcurrentHashMap<>();

    public ForecastRecordRepository() {
        seedInitialForecasts();
    }

    private void seedInitialForecasts() {
        String storeId = "store_varanasi_silk";

        ForecastRecord f1 = new ForecastRecord(
            "fc_rev_30d",
            storeId,
            "NET_REVENUE",
            30,
            new BigDecimal("142500.00"),
            new BigDecimal("128000.00"),
            new BigDecimal("158000.00"),
            "EXPONENTIAL_SMOOTHING",
            60,
            new BigDecimal("3450.00"),
            "Model-based estimate grounded in recent 60-day transactional run-rate. Actual performance may vary due to seasonality, festive promotions, and external logistics factors."
        );
        save(f1);

        ForecastRecord f2 = new ForecastRecord(
            "fc_ord_30d",
            storeId,
            "ORDER_COUNT",
            30,
            new BigDecimal("38.00"),
            new BigDecimal("32.00"),
            new BigDecimal("44.00"),
            "WEIGHTED_MOVING_AVERAGE",
            30,
            new BigDecimal("2.20"),
            "Calculated using 30-day weighted moving average. Assumes stable conversion and inventory availability."
        );
        save(f2);
    }

    public ForecastRecord save(ForecastRecord record) {
        if (record.getId() == null || record.getId().isBlank()) {
            record.setId("fc_" + System.currentTimeMillis() + "_" + (int) (Math.random() * 1000));
        }
        storage.put(record.getId(), record);
        return record;
    }

    public Optional<ForecastRecord> findById(String id) {
        return Optional.ofNullable(storage.get(id));
    }

    public List<ForecastRecord> findByStoreId(String storeId) {
        return storage.values().stream()
            .filter(f -> storeId == null || f.getStoreId().equals(storeId))
            .sorted(Comparator.comparing(ForecastRecord::getGeneratedAt).reversed())
            .toList();
    }

    public Optional<ForecastRecord> findLatestByStoreIdAndMetric(String storeId, String metricName) {
        return storage.values().stream()
            .filter(f -> (storeId == null || f.getStoreId().equals(storeId)) && f.getMetricName().equalsIgnoreCase(metricName))
            .max(Comparator.comparing(ForecastRecord::getGeneratedAt));
    }
}
