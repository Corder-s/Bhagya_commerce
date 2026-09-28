package com.bhagya.commerce.analytics.service;

import com.bhagya.commerce.analytics.domain.AnalyticsEvent;
import com.bhagya.commerce.analytics.domain.AnalyticsEventType;
import com.bhagya.commerce.analytics.dto.OpportunitySignalResponse;
import com.bhagya.commerce.analytics.repository.AnalyticsEventRepository;
import com.bhagya.commerce.catalog.product.domain.Product;
import com.bhagya.commerce.catalog.product.repository.ProductRepository;
import com.bhagya.commerce.order.domain.Order;
import com.bhagya.commerce.order.domain.OrderItem;
import com.bhagya.commerce.order.domain.OrderStatus;
import com.bhagya.commerce.order.repository.OrderRepository;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import org.springframework.stereotype.Service;

@Service
public class CommerceOpportunityService {

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final AnalyticsEventRepository eventRepository;

    public CommerceOpportunityService(
        ProductRepository productRepository,
        OrderRepository orderRepository,
        AnalyticsEventRepository eventRepository
    ) {
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.eventRepository = eventRepository;
    }

    public List<OpportunitySignalResponse> detectOpportunities(String storeId) {
        List<OpportunitySignalResponse> signals = new ArrayList<>();
        Instant thirtyDaysAgo = Instant.now().minus(30, ChronoUnit.DAYS);

        List<Product> products = storeId != null
            ? productRepository.findByStoreId(storeId)
            : productRepository.findAll();

        List<Order> orders = (storeId != null ? orderRepository.findByStoreId(storeId) : orderRepository.findAll())
            .stream()
            .filter(o -> o.getStatus() != OrderStatus.CANCELLED && !o.getCreatedAt().isBefore(thirtyDaysAgo))
            .toList();

        List<AnalyticsEvent> events = eventRepository.findByStoreIdAndOccurredAtBetween(storeId, thirtyDaysAgo, Instant.now());

        Map<String, Long> unitsSoldMap = new HashMap<>();
        Map<String, BigDecimal> revenueMap = new HashMap<>();
        for (Order o : orders) {
            for (OrderItem item : o.getItems()) {
                unitsSoldMap.put(item.getProductId(), unitsSoldMap.getOrDefault(item.getProductId(), 0L) + item.getQuantity());
                BigDecimal rev = item.getTotalInr() != null ? item.getTotalInr() : BigDecimal.ZERO;
                revenueMap.put(item.getProductId(), revenueMap.getOrDefault(item.getProductId(), BigDecimal.ZERO).add(rev));
            }
        }

        Map<String, Long> viewsMap = new HashMap<>();
        for (AnalyticsEvent e : events) {
            if (e.getEventType() == AnalyticsEventType.PRODUCT_VIEWED && e.getEntityId() != null) {
                viewsMap.put(e.getEntityId(), viewsMap.getOrDefault(e.getEntityId(), 0L) + 1);
            }
        }

        for (Product p : products) {
            long views = viewsMap.getOrDefault(p.getId(), 0L);
            long units = unitsSoldMap.getOrDefault(p.getId(), 0L);
            int stock = p.getStockQuantity();

            // 1. High Views + Low Conversion Signal
            if (views >= 10 && units == 0) {
                signals.add(new OpportunitySignalResponse(
                    "sig_conv_" + p.getId(),
                    "CONVERSION_OPPORTUNITY",
                    "INFO",
                    "Possible Conversion Opportunity: " + p.getName(),
                    "Product attracted significant shopper views (" + views + " views) without corresponding purchase completions.",
                    views + " product page views, 0 completed units sold in last 30 days.",
                    "Consider optimizing hero imagery, enriching craft story details, or reviewing competitive price points.",
                    "PRODUCT",
                    p.getId(),
                    p.getName(),
                    Instant.now().toString()
                ));
            }

            // 2. High Sales + Low Stock Signal
            if (units >= 1 && stock <= 3) {
                signals.add(new OpportunitySignalResponse(
                    "sig_inv_" + p.getId(),
                    "INVENTORY_PRESSURE",
                    "WARNING",
                    "Inventory Depletion Signal: " + p.getName(),
                    "Strong patron purchasing activity accompanied by critically low remaining units (" + stock + " remaining).",
                    units + " units ordered recently. Current stock balance: " + stock + " units.",
                    "Consider initiating a craft restocking cycle to prevent missed patron orders.",
                    "PRODUCT",
                    p.getId(),
                    p.getName(),
                    Instant.now().toString()
                ));
            }

            // 3. High Rating & Strong Review Volume Signal
            if (p.getReviewCount() >= 10 && p.getRatingValue() >= 4.8) {
                signals.add(new OpportunitySignalResponse(
                    "sig_merit_" + p.getId(),
                    "HERITAGE_EXCELLENCE",
                    "INFO",
                    "Artisan Heritage Highlight: " + p.getName(),
                    "Consistent top-tier customer ratings and positive feedback volume.",
                    p.getReviewCount() + " verified customer reviews with " + p.getRatingValue() + " star rating.",
                    "Consider featuring this verified masterpiece in upcoming festival marketing campaigns.",
                    "PRODUCT",
                    p.getId(),
                    p.getName(),
                    Instant.now().toString()
                ));
            }
        }

        return signals;
    }
}
