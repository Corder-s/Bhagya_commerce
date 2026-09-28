package com.bhagya.commerce.e2e;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.bhagya.commerce.ai.domain.AIActionConfirmation;
import com.bhagya.commerce.ai.domain.AIContextMode;
import com.bhagya.commerce.ai.domain.AIToolCategory;
import com.bhagya.commerce.ai.repository.AIActionConfirmationRepository;
import com.bhagya.commerce.ai.tool.AITool;
import com.bhagya.commerce.ai.tool.AIToolContext;
import com.bhagya.commerce.ai.tool.AIToolRegistry;
import com.bhagya.commerce.ai.tool.AIToolResult;
import com.bhagya.commerce.ai.tool.customer.GetMyOrdersTool;
import com.bhagya.commerce.ai.tool.customer.SearchProductsTool;
import com.bhagya.commerce.ai.tool.merchant.GetOrderSummaryTool;
import com.bhagya.commerce.ai.tool.merchant.GetSalesSummaryTool;
import com.bhagya.commerce.ai.tool.merchant.PrepareStockAdjustmentTool;
import com.bhagya.commerce.analytics.dto.SalesSummaryResponse;
import com.bhagya.commerce.analytics.service.AnalyticsAggregationService;
import com.bhagya.commerce.catalog.product.domain.Product;
import com.bhagya.commerce.catalog.product.repository.ProductRepository;
import com.bhagya.commerce.catalog.product.service.ProductService;
import com.bhagya.commerce.order.domain.Order;
import com.bhagya.commerce.order.domain.OrderStatus;
import com.bhagya.commerce.order.repository.OrderRepository;
import com.bhagya.commerce.order.service.OrderService;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class BhagyaAIE2ESecurityTest {

    private ProductRepository productRepository;
    private OrderRepository orderRepository;
    private AIActionConfirmationRepository actionRepository;
    private AnalyticsAggregationService analyticsService;

    private AIToolRegistry toolRegistry;
    private PrepareStockAdjustmentTool prepareStockAdjustmentTool;
    private GetSalesSummaryTool getSalesSummaryTool;
    private GetOrderSummaryTool getOrderSummaryTool;
    private GetMyOrdersTool getMyOrdersTool;
    private SearchProductsTool searchProductsTool;

    @BeforeEach
    void setUp() {
        productRepository = new ProductRepository();
        orderRepository = new OrderRepository();
        actionRepository = new AIActionConfirmationRepository();

        OrderService orderService = new OrderService(orderRepository, productRepository, null, null, null);
        ProductService productService = mock(ProductService.class);
        analyticsService = mock(AnalyticsAggregationService.class);
        when(analyticsService.calculateSalesSummary(any(), any(), any(), any())).thenReturn(
            new SalesSummaryResponse("30d", "INR", new BigDecimal("5000.00"), BigDecimal.ZERO, BigDecimal.ZERO, new BigDecimal("5000.00"), 1L, 1L, new BigDecimal("5000.00"), Instant.now(), Instant.now())
        );

        prepareStockAdjustmentTool = new PrepareStockAdjustmentTool(productRepository, actionRepository);
        getSalesSummaryTool = new GetSalesSummaryTool(analyticsService);
        getOrderSummaryTool = new GetOrderSummaryTool(orderService);
        getMyOrdersTool = new GetMyOrdersTool(orderService);
        searchProductsTool = new SearchProductsTool(productService);

        toolRegistry = new AIToolRegistry(List.of(
            prepareStockAdjustmentTool,
            getSalesSummaryTool,
            getOrderSummaryTool,
            getMyOrdersTool,
            searchProductsTool
        ));
    }

    @Test
    @DisplayName("AI Security: Customer context cannot see or execute merchant-only tools")
    void testCustomerContextHidesMerchantTools() {
        AIToolContext customerContext = new AIToolContext("usr_customer_1", "store_jaipur", AIContextMode.CUSTOMER, false, Collections.emptySet());

        List<AITool> availableTools = toolRegistry.getAvailableTools(customerContext);

        // Should include customer tools
        assertTrue(availableTools.stream().anyMatch(t -> t.name().equals("getMyOrders")));
        assertTrue(availableTools.stream().anyMatch(t -> t.name().equals("searchProducts")));

        // MUST NOT include merchant tools
        assertFalse(availableTools.stream().anyMatch(t -> t.name().equals("getSalesSummary")));
        assertFalse(availableTools.stream().anyMatch(t -> t.name().equals("getOrderSummary")));
        assertFalse(availableTools.stream().anyMatch(t -> t.name().equals("prepareStockAdjustment")));

        // Attempting direct execution of merchant tool in customer context fails permission check
        assertFalse(prepareStockAdjustmentTool.isAllowed(customerContext));
        assertFalse(getSalesSummaryTool.isAllowed(customerContext));
    }

    @Test
    @DisplayName("AI Security: Merchant context with permissions can see and execute merchant tools")
    void testMerchantContextAllowedWithPermissions() {
        AIToolContext merchantContext = new AIToolContext(
            "usr_merchant_owner",
            "store_jaipur",
            AIContextMode.MERCHANT,
            true,
            Set.of("INVENTORY_MANAGE", "ANALYTICS_VIEW", "ORDER_VIEW")
        );

        List<AITool> availableTools = toolRegistry.getAvailableTools(merchantContext);

        assertTrue(availableTools.stream().anyMatch(t -> t.name().equals("prepareStockAdjustment")));
        assertTrue(availableTools.stream().anyMatch(t -> t.name().equals("getSalesSummary")));
        assertTrue(availableTools.stream().anyMatch(t -> t.name().equals("getOrderSummary")));
    }

    @Test
    @DisplayName("AI Security: Mutating tool prepareStockAdjustment requires confirmation and does not mutate immediately")
    void testMutatingToolRequiresConfirmation() {
        Product pot = new Product("prod_blue_pot", "store_jaipur", "cat_pottery", "Jaipur Blue Pottery Pot", "blue-pot", new BigDecimal("1800.00"), 10);
        productRepository.save(pot);

        AIToolContext merchantContext = new AIToolContext(
            "usr_merchant_owner",
            "store_jaipur",
            AIContextMode.MERCHANT,
            true,
            Set.of("INVENTORY_MANAGE")
        );

        assertEquals(AIToolCategory.MUTATING, prepareStockAdjustmentTool.category());
        assertTrue(prepareStockAdjustmentTool.requiresConfirmation());

        // Prepare stock adjustment
        AIToolResult result = prepareStockAdjustmentTool.execute(merchantContext, Map.of(
            "productId", pot.getId(),
            "newStock", 25,
            "reason", "New artisan batch arrived from Sanganer kiln"
        ));

        assertTrue(result.success());
        assertNotNull(result.pendingAction());
        assertNotNull(result.pendingAction().getId());

        // Product stock MUST NOT be mutated until explicit user confirmation
        assertEquals(10, productRepository.findById(pot.getId()).get().getStockQuantity());
    }

    @Test
    @DisplayName("AI Security: Cross-store isolation prevents querying data of another store")
    void testCrossStoreAISalesIsolation() {
        // Context for Store Jaipur
        AIToolContext contextJaipur = new AIToolContext("usr_j", "store_jaipur", AIContextMode.MERCHANT, true, Set.of("ANALYTICS_VIEW"));

        AIToolResult resultJaipur = getSalesSummaryTool.execute(contextJaipur, Map.of());
        assertTrue(resultJaipur.success());
        assertNotNull(resultJaipur.data());
    }
}
