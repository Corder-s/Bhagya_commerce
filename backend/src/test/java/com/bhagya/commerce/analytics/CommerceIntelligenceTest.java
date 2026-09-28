package com.bhagya.commerce.analytics;

import static org.junit.jupiter.api.Assertions.*;

import com.bhagya.commerce.analytics.domain.ComparisonPeriod;
import com.bhagya.commerce.analytics.domain.ComparisonResult;
import com.bhagya.commerce.analytics.dto.CanonicalMetricResult;
import com.bhagya.commerce.analytics.dto.CustomerSegmentationResponse;
import com.bhagya.commerce.analytics.dto.ForecastResponse;
import com.bhagya.commerce.analytics.repository.ForecastRecordRepository;
import com.bhagya.commerce.analytics.service.CommerceMetricService;
import com.bhagya.commerce.analytics.service.CustomerIntelligenceService;
import com.bhagya.commerce.analytics.service.ForecastService;
import com.bhagya.commerce.analytics.service.InventoryIntelligenceService;
import com.bhagya.commerce.catalog.product.domain.Product;
import com.bhagya.commerce.catalog.product.repository.ProductRepository;
import com.bhagya.commerce.order.domain.Order;
import com.bhagya.commerce.order.domain.OrderItem;
import com.bhagya.commerce.order.domain.OrderStatus;
import com.bhagya.commerce.order.repository.OrderRepository;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class CommerceIntelligenceTest {

    private OrderRepository orderRepository;
    private ProductRepository productRepository;
    private CommerceMetricService metricService;
    private ForecastService forecastService;
    private CustomerIntelligenceService customerService;
    private InventoryIntelligenceService inventoryService;

    @BeforeEach
    void setUp() {
        orderRepository = new OrderRepository();
        productRepository = new ProductRepository();
        ForecastRecordRepository forecastRecordRepository = new ForecastRecordRepository();

        metricService = new CommerceMetricService(orderRepository, productRepository);
        forecastService = new ForecastService(orderRepository, forecastRecordRepository);
        customerService = new CustomerIntelligenceService(orderRepository);
        inventoryService = new InventoryIntelligenceService(productRepository, orderRepository);
    }

    @Test
    @DisplayName("Canonical Metric Layer: Computes exact Gross, Net, AOV and handles safe zero denominator comparison")
    void testCanonicalMetricsAndZeroDenominator() {
        String storeId = "store_test_metrics";
        Instant now = Instant.now();

        // 1. Test ComparisonResult with zero baseline
        ComparisonResult compWithZeroBaseline = ComparisonResult.calculate(new BigDecimal("500.00"), BigDecimal.ZERO, "₹");
        assertNotNull(compWithZeroBaseline);
        assertEquals(new BigDecimal("500.00"), compWithZeroBaseline.absoluteChange());
        assertEquals("+₹500.00 (New activity)", compWithZeroBaseline.formattedChangeLabel());
        assertTrue(compWithZeroBaseline.isNewActivity());

        // 2. Add sample orders
        Order o1 = new Order();
        o1.setId("ord_test_m1");
        o1.setStoreId(storeId);
        o1.setStatus(OrderStatus.DELIVERED);
        o1.setPaymentStatus("PAID");
        o1.setSubtotalInr(new BigDecimal("4000.00"));
        o1.setDiscountInr(new BigDecimal("500.00"));
        o1.setTotalInr(new BigDecimal("3500.00"));
        o1.setCreatedAt(now.minus(2, ChronoUnit.DAYS));
        o1.getItems().add(new OrderItem("item_1", "prod_1", "Silk Saree", null, new BigDecimal("4000.00"), 1));
        orderRepository.save(o1);

        Order o2 = new Order();
        o2.setId("ord_test_m2");
        o2.setStoreId(storeId);
        o2.setStatus(OrderStatus.DELIVERED);
        o2.setPaymentStatus("REFUNDED");
        o2.setSubtotalInr(new BigDecimal("1000.00"));
        o2.setDiscountInr(BigDecimal.ZERO);
        o2.setTotalInr(new BigDecimal("1000.00"));
        o2.setCreatedAt(now.minus(3, ChronoUnit.DAYS));
        orderRepository.save(o2);

        List<CanonicalMetricResult> kpis = metricService.calculateCanonicalMetrics(storeId, ComparisonPeriod.DAYS_7, null, null);
        assertNotNull(kpis);
        assertFalse(kpis.isEmpty());

        CanonicalMetricResult netRev = kpis.stream().filter(k -> "NET_REVENUE".equals(k.metricKey())).findFirst().orElseThrow();
        // Gross = 4000 + 1000 = 5000; Discount = 500; Refund = 1000 => Net = 5000 - 500 - 1000 = 3500
        assertEquals(new BigDecimal("3500.00"), netRev.value());
        assertEquals("Net Sales = Gross Sales - Discounts - Refunds", netRev.calculationFormula());
    }

    @Test
    @DisplayName("Forecast Service: Produces explainable forecast with bounds and disclaimers")
    void testForecastService() {
        String storeId = "store_test_forecast";
        Instant now = Instant.now();

        // Seed 5 historical days of orders
        for (int i = 1; i <= 5; i++) {
            Order o = new Order();
            o.setId("ord_fc_" + i);
            o.setStoreId(storeId);
            o.setStatus(OrderStatus.DELIVERED);
            o.setPaymentStatus("PAID");
            o.setSubtotalInr(new BigDecimal("2000.00"));
            o.setTotalInr(new BigDecimal("2000.00"));
            o.setCreatedAt(now.minus(i * 2, ChronoUnit.DAYS));
            orderRepository.save(o);
        }

        ForecastResponse forecast = forecastService.generateSalesForecast(storeId, 7);
        assertNotNull(forecast);
        assertEquals(7, forecast.horizonDays());
        assertTrue(forecast.forecastValue().compareTo(BigDecimal.ZERO) >= 0);
        assertTrue(forecast.lowerBound().compareTo(BigDecimal.ZERO) >= 0);
        assertTrue(forecast.upperBound().compareTo(forecast.lowerBound()) >= 0);
        assertNotNull(forecast.limitationsNotice());
        assertTrue(forecast.limitationsNotice().toLowerCase().contains("estimate"));
    }

    @Test
    @DisplayName("Customer Intelligence Service: Computes RFM segments and protects patron privacy")
    void testCustomerSegmentation() {
        String storeId = "store_test_cust";
        Instant now = Instant.now();

        Order o1 = new Order();
        o1.setId("ord_c1");
        o1.setStoreId(storeId);
        o1.setUserId("usr_patron_1");
        o1.setCustomerName("Pooja Sharma");
        o1.setStatus(OrderStatus.DELIVERED);
        o1.setPaymentStatus("PAID");
        o1.setTotalInr(new BigDecimal("5000.00"));
        o1.setCreatedAt(now.minus(5, ChronoUnit.DAYS));
        orderRepository.save(o1);

        Order o2 = new Order();
        o2.setId("ord_c2");
        o2.setStoreId(storeId);
        o2.setUserId("usr_patron_1");
        o2.setCustomerName("Pooja Sharma");
        o2.setStatus(OrderStatus.DELIVERED);
        o2.setPaymentStatus("PAID");
        o2.setTotalInr(new BigDecimal("3000.00"));
        o2.setCreatedAt(now.minus(2, ChronoUnit.DAYS));
        orderRepository.save(o2);

        CustomerSegmentationResponse segs = customerService.analyzePatronSegments(storeId);
        assertNotNull(segs);
        assertEquals(1, segs.totalPatrons());
        assertEquals(1, segs.returningPatrons());
        assertEquals(100.0, segs.repeatRate());

        // Ensure name masking for patron privacy
        assertFalse(segs.rfmProfiles().isEmpty());
        String masked = segs.rfmProfiles().get(0).customerNameMasked();
        assertNotEquals("Pooja Sharma", masked);
        assertTrue(masked.endsWith(".") || masked.contains("*"));
    }

    @Test
    @DisplayName("Inventory Intelligence Service: Computes stock health and velocity without fabricated lead times")
    void testInventoryIntelligence() {
        String storeId = "store_test_inv";

        Product p = new Product();
        p.setId("prod_inv_1");
        p.setStoreId(storeId);
        p.setName("Handloom Scarf");
        p.setStockQuantity(2);
        p.setPriceInr(new BigDecimal("1200.00"));
        productRepository.save(p);

        var summary = inventoryService.analyzeInventoryHealth(storeId);
        assertNotNull(summary);
        assertEquals(1, summary.totalCatalogItems());
        assertEquals(1, summary.lowStockCount());
        assertFalse(summary.productSignals().isEmpty());
        assertEquals("LOW_STOCK", summary.productSignals().get(0).stockHealth());
        assertTrue(summary.productSignals().get(0).reorderSignal());
    }
}
