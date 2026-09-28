package com.bhagya.commerce.analytics.service;

import com.bhagya.commerce.analytics.domain.AlertStatus;
import com.bhagya.commerce.analytics.domain.IntelligenceAlert;
import com.bhagya.commerce.analytics.dto.OpportunitySignalResponse;
import com.bhagya.commerce.analytics.repository.IntelligenceAlertRepository;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class CommerceAlertService {

    private static final Logger log = LoggerFactory.getLogger(CommerceAlertService.class);

    private final IntelligenceAlertRepository alertRepository;
    private final AnomalyDetectionService anomalyDetectionService;
    private final CommerceOpportunityService opportunityService;
    private final InventoryIntelligenceService inventoryIntelligenceService;

    public CommerceAlertService(
        IntelligenceAlertRepository alertRepository,
        AnomalyDetectionService anomalyDetectionService,
        CommerceOpportunityService opportunityService,
        InventoryIntelligenceService inventoryIntelligenceService
    ) {
        this.alertRepository = alertRepository;
        this.anomalyDetectionService = anomalyDetectionService;
        this.opportunityService = opportunityService;
        this.inventoryIntelligenceService = inventoryIntelligenceService;
    }

    public List<IntelligenceAlert> getActiveAlerts(String storeId) {
        syncLiveAlerts(storeId);
        return alertRepository.findByStoreId(storeId).stream()
            .filter(a -> a.getStatus() == AlertStatus.NEW || a.getStatus() == AlertStatus.ACKNOWLEDGED)
            .toList();
    }

    public List<IntelligenceAlert> getAllAlerts(String storeId, AlertStatus status) {
        if (status == null) {
            return alertRepository.findByStoreId(storeId);
        }
        return alertRepository.findByStoreIdAndStatus(storeId, status);
    }

    public Optional<IntelligenceAlert> acknowledgeAlert(String storeId, String alertId) {
        Optional<IntelligenceAlert> alertOpt = alertRepository.findById(alertId);
        if (alertOpt.isPresent()) {
            IntelligenceAlert alert = alertOpt.get();
            if (storeId == null || alert.getStoreId().equals(storeId)) {
                alert.setStatus(AlertStatus.ACKNOWLEDGED);
                alert.setAcknowledgedAt(Instant.now());
                alertRepository.save(alert);
                log.info("Merchant acknowledged alert {} for store {}", alertId, storeId);
                return Optional.of(alert);
            }
        }
        return Optional.empty();
    }

    public Optional<IntelligenceAlert> dismissAlert(String storeId, String alertId) {
        Optional<IntelligenceAlert> alertOpt = alertRepository.findById(alertId);
        if (alertOpt.isPresent()) {
            IntelligenceAlert alert = alertOpt.get();
            if (storeId == null || alert.getStoreId().equals(storeId)) {
                alert.setStatus(AlertStatus.DISMISSED);
                alert.setResolvedAt(Instant.now());
                alertRepository.save(alert);
                log.info("Merchant dismissed alert {} for store {}", alertId, storeId);
                return Optional.of(alert);
            }
        }
        return Optional.empty();
    }

    public Optional<IntelligenceAlert> resolveAlert(String storeId, String alertId) {
        Optional<IntelligenceAlert> alertOpt = alertRepository.findById(alertId);
        if (alertOpt.isPresent()) {
            IntelligenceAlert alert = alertOpt.get();
            if (storeId == null || alert.getStoreId().equals(storeId)) {
                alert.setStatus(AlertStatus.RESOLVED);
                alert.setResolvedAt(Instant.now());
                alertRepository.save(alert);
                log.info("Alert {} resolved for store {}", alertId, storeId);
                return Optional.of(alert);
            }
        }
        return Optional.empty();
    }

    /**
     * Periodically or lazily checks for new anomalies and inventory stockout risks
     * and persists them as alerts if not already existing.
     */
    public synchronized void syncLiveAlerts(String storeId) {
        try {
            // 1. Sync inventory signals
            Map<String, Object> invSignals = inventoryIntelligenceService.getInventorySignals(storeId);
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> stockoutRisks = (List<Map<String, Object>>) invSignals.get("stockoutRiskProducts");
            if (stockoutRisks != null) {
                for (Map<String, Object> risk : stockoutRisks) {
                    String prodId = (String) risk.get("productId");
                    String prodName = (String) risk.get("productName");
                    Number stock = (Number) risk.get("currentStock");
                    String alertKey = "inv_" + prodId;

                    boolean alreadyExists = alertRepository.findByStoreId(storeId).stream()
                        .anyMatch(a -> alertKey.equals(a.getMetricName()) && a.getStatus() != AlertStatus.RESOLVED && a.getStatus() != AlertStatus.DISMISSED);

                    if (!alreadyExists) {
                        IntelligenceAlert alert = new IntelligenceAlert(
                            "alt_" + System.currentTimeMillis() + "_" + prodId.hashCode() % 1000,
                            storeId,
                            "LOW_STOCK",
                            stock != null && stock.intValue() <= 1 ? "CRITICAL" : "WARNING",
                            alertKey,
                            stock != null ? BigDecimal.valueOf(stock.longValue()) : BigDecimal.ZERO,
                            BigDecimal.valueOf(10),
                            "Low Inventory Alert: " + prodName,
                            "Only " + stock + " units remaining. Recent order velocity indicates imminent stockout risk."
                        );
                        alert.getMetadata().put("productId", prodId);
                        alert.getMetadata().put("productName", prodName);
                        alertRepository.save(alert);
                    }
                }
            }

            // 2. Sync anomaly alerts
            List<IntelligenceAlert> anomalies = anomalyDetectionService.detectAnomalies(storeId);
            for (IntelligenceAlert anomaly : anomalies) {
                boolean alreadyExists = alertRepository.findByStoreId(storeId).stream()
                    .anyMatch(a -> a.getMetricName() != null && a.getMetricName().equals(anomaly.getMetricName())
                        && a.getAlertType().equals(anomaly.getAlertType())
                        && a.getStatus() != AlertStatus.RESOLVED && a.getStatus() != AlertStatus.DISMISSED);

                if (!alreadyExists) {
                    alertRepository.save(anomaly);
                }
            }
        } catch (Exception e) {
            log.warn("Error syncing live commerce alerts for store {}: {}", storeId, e.getMessage());
        }
    }
}
