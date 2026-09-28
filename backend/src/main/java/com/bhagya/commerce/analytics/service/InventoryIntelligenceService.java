package com.bhagya.commerce.analytics.service;

import com.bhagya.commerce.catalog.product.domain.Product;
import com.bhagya.commerce.catalog.product.repository.ProductRepository;
import com.bhagya.commerce.order.domain.Order;
import com.bhagya.commerce.order.domain.OrderItem;
import com.bhagya.commerce.order.domain.OrderStatus;
import com.bhagya.commerce.order.repository.OrderRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import org.springframework.stereotype.Service;

@Service
public class InventoryIntelligenceService {

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    public InventoryIntelligenceService(
        ProductRepository productRepository,
        OrderRepository orderRepository
    ) {
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
    }

    public record ProductInventorySignal(
        String productId,
        String productName,
        String sku,
        int currentStock,
        long unitsSold30d,
        double dailyVelocity,
        Integer daysOfStockRemaining, // null if velocity is zero
        String stockHealth, // "HEALTHY", "LOW_STOCK", "OUT_OF_STOCK", "CRITICAL_PRESSURE"
        boolean reorderSignal,
        String reorderRecommendation,
        BigDecimal priceInr,
        BigDecimal inventoryValueInr
    ) {}

    public record InventoryIntelligenceSummary(
        String storeId,
        int totalCatalogItems,
        int inStockCount,
        int lowStockCount,
        int outOfStockCount,
        BigDecimal totalInventoryValueInr,
        double catalogStockoutRate,
        List<ProductInventorySignal> productSignals,
        List<String> keyRecommendations
    ) {}

    public Map<String, Object> getInventorySignals(String storeId) {
        InventoryIntelligenceSummary summary = analyzeInventoryHealth(storeId);
        List<Map<String, Object>> stockoutRisks = summary.productSignals().stream()
            .filter(p -> p.reorderSignal() || "OUT_OF_STOCK".equals(p.stockHealth()) || "LOW_STOCK".equals(p.stockHealth()) || "CRITICAL_PRESSURE".equals(p.stockHealth()))
            .map(p -> {
                Map<String, Object> m = new HashMap<>();
                m.put("productId", p.productId());
                m.put("productName", p.productName());
                m.put("currentStock", p.currentStock());
                m.put("dailyVelocity", p.dailyVelocity());
                m.put("daysOfStockRemaining", p.daysOfStockRemaining());
                m.put("stockHealth", p.stockHealth());
                m.put("recommendation", p.reorderRecommendation());
                return m;
            })
            .toList();

        Map<String, Object> res = new HashMap<>();
        res.put("storeId", summary.storeId());
        res.put("totalCatalogItems", summary.totalCatalogItems());
        res.put("inStockCount", summary.inStockCount());
        res.put("lowStockCount", summary.lowStockCount());
        res.put("outOfStockCount", summary.outOfStockCount());
        res.put("totalInventoryValueInr", summary.totalInventoryValueInr());
        res.put("catalogStockoutRate", summary.catalogStockoutRate());
        res.put("productSignals", summary.productSignals());
        res.put("stockoutRiskProducts", stockoutRisks);
        res.put("keyRecommendations", summary.keyRecommendations());
        return res;
    }

    public InventoryIntelligenceSummary analyzeInventoryHealth(String storeId) {
        List<Product> products = storeId != null
            ? productRepository.findByStoreId(storeId)
            : productRepository.findAll();

        Instant thirtyDaysAgo = Instant.now().minus(30, ChronoUnit.DAYS);
        List<Order> recentOrders = (storeId != null ? orderRepository.findByStoreId(storeId) : orderRepository.findAll())
            .stream()
            .filter(o -> o.getStatus() != OrderStatus.CANCELLED && !o.getCreatedAt().isBefore(thirtyDaysAgo))
            .toList();

        Map<String, Long> unitsSoldMap = new HashMap<>();
        for (Order o : recentOrders) {
            for (OrderItem item : o.getItems()) {
                unitsSoldMap.put(item.getProductId(), unitsSoldMap.getOrDefault(item.getProductId(), 0L) + item.getQuantity());
            }
        }

        List<ProductInventorySignal> signals = new ArrayList<>();
        int lowStock = 0;
        int outStock = 0;
        int inStock = 0;
        BigDecimal totalValue = BigDecimal.ZERO;
        List<String> recommendations = new ArrayList<>();

        for (Product p : products) {
            int stock = p.getStockQuantity();
            long sold30d = unitsSoldMap.getOrDefault(p.getId(), 0L);
            double velocity = Math.round((sold30d / 30.0) * 10.0) / 10.0;

            Integer daysRemaining = null;
            if (velocity > 0) {
                daysRemaining = (int) Math.round(stock / velocity);
            }

            String health;
            boolean reorder = false;
            String recText;

            if (stock <= 0) {
                health = "OUT_OF_STOCK";
                outStock++;
                reorder = true;
                recText = "Item is out of stock. Contact craft cluster artisans to check replenishment timeline.";
                recommendations.add("Replenish stock for '" + p.getName() + "' (currently 0 units).");
            } else if (daysRemaining != null && daysRemaining <= 7) {
                health = "CRITICAL_PRESSURE";
                lowStock++;
                reorder = true;
                recText = "Depletion rate indicates ~" + daysRemaining + " days of remaining stock. Immediate replenishment recommended.";
                recommendations.add("High velocity / low stock for '" + p.getName() + "': ~" + daysRemaining + " days remaining.");
            } else if (stock <= 5) {
                health = "LOW_STOCK";
                lowStock++;
                reorder = true;
                recText = "Low stock threshold reached (" + stock + " units). Monitor daily order volume.";
            } else {
                health = "HEALTHY";
                inStock++;
                recText = "Adequate inventory levels for current sales velocity.";
            }

            BigDecimal pPrice = p.getPriceInr() != null ? p.getPriceInr() : BigDecimal.ZERO;
            BigDecimal pVal = pPrice.multiply(BigDecimal.valueOf(stock));
            totalValue = totalValue.add(pVal);

            signals.add(new ProductInventorySignal(
                p.getId(),
                p.getName(),
                p.getSku() != null ? p.getSku() : "SKU-" + p.getId().toUpperCase(),
                stock,
                sold30d,
                velocity,
                daysRemaining,
                health,
                reorder,
                recText,
                pPrice.setScale(2, RoundingMode.HALF_UP),
                pVal.setScale(2, RoundingMode.HALF_UP)
            ));
        }

        double stockoutRate = products.isEmpty() ? 0.0 : Math.round(((double) outStock / products.size()) * 1000.0) / 10.0;

        return new InventoryIntelligenceSummary(
            storeId,
            products.size(),
            inStock,
            lowStock,
            outStock,
            totalValue.setScale(2, RoundingMode.HALF_UP),
            stockoutRate,
            signals,
            recommendations
        );
    }
}
