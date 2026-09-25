package com.bhagya.commerce.marketing.dto;

import java.math.BigDecimal;
import java.util.List;

public record MarketingOverviewResponse(
    String storeId,
    int activePromotionsCount,
    int scheduledCampaignsCount,
    int activeCampaignsCount,
    int totalAttributedOrders,
    BigDecimal totalAttributedSales,
    List<CampaignResponse> recentCampaigns,
    List<PromotionResponse> activePromotions
) {}
