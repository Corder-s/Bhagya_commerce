package com.bhagya.commerce.merchant.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public record MerchantDashboardOverviewResponse(
    String storeId,
    String storeName,
    BigDecimal todaySales,
    BigDecimal totalSales,
    int totalOrders,
    int pendingOrders,
    int lowStockCount,
    int totalProducts,
    List<Map<String, Object>> recentOrders,
    List<Map<String, Object>> topSellingProducts,
    Map<String, Object> weeklyRevenueChart
) {}
