package com.bhagya.commerce.analytics;

import static org.junit.jupiter.api.Assertions.*;

import com.bhagya.commerce.analytics.domain.DateRangePeriod;
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

public class AnalyticsCalculationTest {

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
    @DisplayName("Should correctly calculate Gross Sales, Discounts, Refunds, Net Sales, and AOV")
    void testFinancialCalculations() {
        String testStoreId = "store_test_calc";
        Instant now = Instant.now();

        // Order 1: Subtotal = 1000, Discount = 100, Net = 900, PAID
        Order o1 = new Order();
        o1.setId("ord_test_1");
        o1.setStoreId(testStoreId);
        o1.setStatus(OrderStatus.CONFIRMED);
        o1.setPaymentStatus("PAID");
        o1.setSubtotalInr(new BigDecimal("1000.00"));
        o1.setDiscountInr(new BigDecimal("100.00"));
        o1.setTotalInr(new BigDecimal("900.00"));
        o1.setCreatedAt(now.minus(1, ChronoUnit.HOURS));
        orderRepository.save(o1);

        // Order 2: Subtotal = 2500, Discount = 0, Net = 2500, PAID
        Order o2 = new Order();
        o2.setId("ord_test_2");
        o2.setStoreId(testStoreId);
        o2.setStatus(OrderStatus.DELIVERED);
        o2.setPaymentStatus("PAID");
        o2.setSubtotalInr(new BigDecimal("2500.00"));
        o2.setDiscountInr(BigDecimal.ZERO);
        o2.setTotalInr(new BigDecimal("2500.00"));
        o2.setCreatedAt(now.minus(2, ChronoUnit.HOURS));
        orderRepository.save(o2);

        // Order 3: Subtotal = 500, Refunded = 500, REFUNDED
        Order o3 = new Order();
        o3.setId("ord_test_3");
        o3.setStoreId(testStoreId);
        o3.setStatus(OrderStatus.CONFIRMED);
        o3.setPaymentStatus("REFUNDED");
        o3.setSubtotalInr(new BigDecimal("500.00"));
        o3.setDiscountInr(BigDecimal.ZERO);
        o3.setTotalInr(new BigDecimal("500.00"));
        o3.setCreatedAt(now.minus(3, ChronoUnit.HOURS));
        orderRepository.save(o3);

        // Order 4: Cancelled Order = 1200 (Must not count towards gross sales)
        Order o4 = new Order();
        o4.setId("ord_test_4");
        o4.setStoreId(testStoreId);
        o4.setStatus(OrderStatus.CANCELLED);
        o4.setPaymentStatus("REFUNDED");
        o4.setSubtotalInr(new BigDecimal("1200.00"));
        o4.setDiscountInr(BigDecimal.ZERO);
        o4.setTotalInr(new BigDecimal("1200.00"));
        o4.setCreatedAt(now.minus(4, ChronoUnit.HOURS));
        orderRepository.save(o4);

        SalesSummaryResponse summary = aggregationService.calculateSalesSummary(testStoreId, "TODAY", now.minus(1, ChronoUnit.DAYS), now.plus(1, ChronoUnit.DAYS));

        // Gross = 1000 + 2500 + 500 = 4000
        assertEquals(new BigDecimal("4000.00"), summary.grossSales());
        // Discounts = 100
        assertEquals(new BigDecimal("100.00"), summary.discounts());
        // Refunds = 500 + 1200 (refunded)
        assertEquals(new BigDecimal("1700.00"), summary.refunds());
        // Net Sales = 4000 - 100 - 1700 = 2200.00
        assertEquals(new BigDecimal("2200.00"), summary.netSales());
        // Paid orders count = 2 (o1, o2)
        assertEquals(2, summary.paidOrders());
        // AOV = 2200 / 2 = 1100.00
        assertEquals(new BigDecimal("1100.00"), summary.averageOrderValue());
    }
}
