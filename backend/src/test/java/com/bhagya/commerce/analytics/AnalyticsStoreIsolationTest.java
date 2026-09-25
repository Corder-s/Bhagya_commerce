package com.bhagya.commerce.analytics;

import static org.junit.jupiter.api.Assertions.*;

import com.bhagya.commerce.analytics.dto.SalesSummaryResponse;
import com.bhagya.commerce.analytics.repository.AnalyticsEventRepository;
import com.bhagya.commerce.analytics.service.AnalyticsAggregationService;
import com.bhagya.commerce.catalog.product.repository.ProductRepository;
import com.bhagya.commerce.order.domain.Order;
import com.bhagya.commerce.order.domain.OrderStatus;
import com.bhagya.commerce.order.repository.OrderRepository;
import com.bhagya.commerce.store.repository.StoreRepository;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class AnalyticsStoreIsolationTest {

    private OrderRepository orderRepository;
    private AnalyticsAggregationService aggregationService;

    @BeforeEach
    void setUp() {
        orderRepository = new OrderRepository();
        ProductRepository productRepository = new ProductRepository();
        StoreRepository storeRepository = new StoreRepository();
        AnalyticsEventRepository eventRepository = new AnalyticsEventRepository();

        aggregationService = new AnalyticsAggregationService(
            orderRepository,
            productRepository,
            storeRepository,
            eventRepository,
            null
        );
    }

    @Test
    @DisplayName("Store A analytics must never include Store B data")
    void testStrictStoreIsolation() {
        Instant now = Instant.now();

        // Store A Order
        Order orderA = new Order();
        orderA.setId("ord_a_1");
        orderA.setStoreId("store_A");
        orderA.setStatus(OrderStatus.CONFIRMED);
        orderA.setPaymentStatus("PAID");
        orderA.setSubtotalInr(new BigDecimal("1500.00"));
        orderA.setDiscountInr(BigDecimal.ZERO);
        orderA.setTotalInr(new BigDecimal("1500.00"));
        orderA.setCreatedAt(now.minus(2, ChronoUnit.HOURS));
        orderRepository.save(orderA);

        // Store B Order
        Order orderB = new Order();
        orderB.setId("ord_b_1");
        orderB.setStoreId("store_B");
        orderB.setStatus(OrderStatus.CONFIRMED);
        orderB.setPaymentStatus("PAID");
        orderB.setSubtotalInr(new BigDecimal("8800.00"));
        orderB.setDiscountInr(BigDecimal.ZERO);
        orderB.setTotalInr(new BigDecimal("8800.00"));
        orderB.setCreatedAt(now.minus(1, ChronoUnit.HOURS));
        orderRepository.save(orderB);

        SalesSummaryResponse summaryA = aggregationService.calculateSalesSummary("store_A", "TODAY", now.minus(1, ChronoUnit.DAYS), now.plus(1, ChronoUnit.DAYS));
        SalesSummaryResponse summaryB = aggregationService.calculateSalesSummary("store_B", "TODAY", now.minus(1, ChronoUnit.DAYS), now.plus(1, ChronoUnit.DAYS));

        assertEquals(new BigDecimal("1500.00"), summaryA.grossSales());
        assertEquals(new BigDecimal("1500.00"), summaryA.netSales());
        assertEquals(1, summaryA.totalOrders());

        assertEquals(new BigDecimal("8800.00"), summaryB.grossSales());
        assertEquals(new BigDecimal("8800.00"), summaryB.netSales());
        assertEquals(1, summaryB.totalOrders());
    }
}
