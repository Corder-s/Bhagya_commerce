package com.bhagya.commerce.analytics.service;

import com.bhagya.commerce.analytics.domain.IntelligenceAlert;
import com.bhagya.commerce.analytics.repository.IntelligenceAlertRepository;
import com.bhagya.commerce.order.domain.Order;
import com.bhagya.commerce.order.domain.OrderStatus;
import com.bhagya.commerce.order.repository.OrderRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class AnomalyDetectionService {

    private static final Logger log = LoggerFactory.getLogger(AnomalyDetectionService.class);
    private final OrderRepository orderRepository;
    private final IntelligenceAlertRepository alertRepository;

    public AnomalyDetectionService(
        OrderRepository orderRepository,
        IntelligenceAlertRepository alertRepository
    ) {
        this.orderRepository = orderRepository;
        this.alertRepository = alertRepository;
    }

    public List<IntelligenceAlert> detectAnomalies(String storeId) {
        return runAnomalyDetection(storeId);
    }

    public List<IntelligenceAlert> runAnomalyDetection(String storeId) {
        List<IntelligenceAlert> detected = new ArrayList<>();
        Instant now = Instant.now();
        Instant recentWindow = now.minus(7, ChronoUnit.DAYS);
        Instant baselineWindow = now.minus(28, ChronoUnit.DAYS);

        List<Order> allOrders = storeId != null ? orderRepository.findByStoreId(storeId) : orderRepository.findAll();

        List<Order> recent = allOrders.stream()
            .filter(o -> !o.getCreatedAt().isBefore(recentWindow))
            .toList();

        List<Order> baseline = allOrders.stream()
            .filter(o -> o.getCreatedAt().isBefore(recentWindow) && !o.getCreatedAt().isBefore(baselineWindow))
            .toList();

        // 1. Check Refund Rate Anomaly
        long recentRefunds = recent.stream().filter(o -> "REFUNDED".equalsIgnoreCase(o.getPaymentStatus())).count();
        long baselineRefunds = baseline.stream().filter(o -> "REFUNDED".equalsIgnoreCase(o.getPaymentStatus())).count();

        double recentRefundRate = recent.size() > 0 ? ((double) recentRefunds / recent.size()) * 100.0 : 0.0;
        double baselineRefundRate = baseline.size() > 0 ? ((double) baselineRefunds / baseline.size()) * 100.0 : 0.0;

        if (recentRefundRate > 15.0 && recentRefundRate > (baselineRefundRate * 1.5)) {
            IntelligenceAlert alert = new IntelligenceAlert(
                "alt_anom_ref_" + System.currentTimeMillis(),
                storeId != null ? storeId : "store_main",
                "REFUND_SPIKE",
                "WARNING",
                "REFUND_RATE",
                BigDecimal.valueOf(Math.round(recentRefundRate * 10.0) / 10.0),
                BigDecimal.valueOf(Math.round(baselineRefundRate * 10.0) / 10.0),
                "Unusual refund rate increase detected",
                "Refund rate reached " + Math.round(recentRefundRate) + "% over the last 7 days compared with historical baseline of " + Math.round(baselineRefundRate) + "%."
            );
            alert.getMetadata().put("recentRefundCount", recentRefunds);
            alert.getMetadata().put("totalOrdersInWindow", recent.size());
            alertRepository.save(alert);
            detected.add(alert);
        }

        // 2. Check Cancellation Rate Anomaly
        long recentCancelled = recent.stream().filter(o -> o.getStatus() == OrderStatus.CANCELLED).count();
        double recentCancelRate = recent.size() > 0 ? ((double) recentCancelled / recent.size()) * 100.0 : 0.0;

        if (recentCancelRate > 20.0) {
            IntelligenceAlert alert = new IntelligenceAlert(
                "alt_anom_cnc_" + System.currentTimeMillis(),
                storeId != null ? storeId : "store_main",
                "CANCELLATION_SPIKE",
                "WARNING",
                "CANCELLATION_RATE",
                BigDecimal.valueOf(Math.round(recentCancelRate * 10.0) / 10.0),
                new BigDecimal("5.0"),
                "Elevated order cancellation rate",
                "Order cancellation rate reached " + Math.round(recentCancelRate) + "% in the current weekly cycle."
            );
            alertRepository.save(alert);
            detected.add(alert);
        }

        return detected;
    }
}
