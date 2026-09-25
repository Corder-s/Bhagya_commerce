package com.bhagya.commerce.marketing.service;

import com.bhagya.commerce.marketing.domain.Campaign;
import com.bhagya.commerce.marketing.domain.CampaignStatus;
import com.bhagya.commerce.marketing.domain.Promotion;
import com.bhagya.commerce.marketing.domain.PromotionStatus;
import com.bhagya.commerce.marketing.dto.CampaignResponse;
import com.bhagya.commerce.marketing.dto.MarketingOverviewResponse;
import com.bhagya.commerce.marketing.dto.PromotionResponse;
import com.bhagya.commerce.marketing.repository.CampaignRepository;
import com.bhagya.commerce.marketing.repository.CouponRepository;
import com.bhagya.commerce.marketing.repository.PromotionRepository;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class MarketingAnalyticsService {

    private final PromotionRepository promotionRepository;
    private final CouponRepository couponRepository;
    private final CampaignRepository campaignRepository;

    public MarketingAnalyticsService(
        PromotionRepository promotionRepository,
        CouponRepository couponRepository,
        CampaignRepository campaignRepository
    ) {
        this.promotionRepository = promotionRepository;
        this.couponRepository = couponRepository;
        this.campaignRepository = campaignRepository;
    }

    public MarketingOverviewResponse getMarketingOverview(String storeId) {
        List<Promotion> promotions = promotionRepository.findByStoreId(storeId);
        List<Campaign> campaigns = campaignRepository.findByStoreId(storeId);

        int activePromos = (int) promotions.stream().filter(p -> p.getStatus() == PromotionStatus.ACTIVE).count();
        int scheduledCamps = (int) campaigns.stream().filter(c -> c.getStatus() == CampaignStatus.SCHEDULED).count();
        int activeCamps = (int) campaigns.stream().filter(c -> c.getStatus() == CampaignStatus.ACTIVE || c.getStatus() == CampaignStatus.RUNNING).count();

        int totalAttributedOrders = campaigns.stream().mapToInt(Campaign::getAttributedOrders).sum();
        BigDecimal totalAttributedSales = campaigns.stream()
            .map(Campaign::getAttributedSales)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<PromotionResponse> activePromotionResponses = promotions.stream()
            .filter(p -> p.getStatus() == PromotionStatus.ACTIVE)
            .map(p -> {
                String code = couponRepository.findByPromotionId(p.getId()).map(c -> c.getCode()).orElse(null);
                return PromotionResponse.fromDomain(p, code);
            })
            .toList();

        List<CampaignResponse> recentCampaignResponses = campaigns.stream()
            .map(CampaignResponse::fromDomain)
            .toList();

        return new MarketingOverviewResponse(
            storeId,
            activePromos,
            scheduledCamps,
            activeCamps,
            totalAttributedOrders,
            totalAttributedSales,
            recentCampaignResponses,
            activePromotionResponses
        );
    }
}
