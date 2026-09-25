package com.bhagya.commerce.marketing;

import static org.junit.jupiter.api.Assertions.*;

import com.bhagya.commerce.common.error.ValidationException;
import com.bhagya.commerce.marketing.domain.CampaignChannel;
import com.bhagya.commerce.marketing.domain.PromotionType;
import com.bhagya.commerce.marketing.dto.CampaignCreateRequest;
import com.bhagya.commerce.marketing.dto.CampaignResponse;
import com.bhagya.commerce.marketing.dto.PromotionCreateRequest;
import com.bhagya.commerce.marketing.dto.PromotionResponse;
import com.bhagya.commerce.marketing.repository.CampaignRecipientRepository;
import com.bhagya.commerce.marketing.repository.CampaignRepository;
import com.bhagya.commerce.marketing.repository.CouponRepository;
import com.bhagya.commerce.marketing.repository.CustomerSegmentRepository;
import com.bhagya.commerce.marketing.repository.PromotionRepository;
import com.bhagya.commerce.marketing.service.AudienceService;
import com.bhagya.commerce.marketing.service.CampaignService;
import com.bhagya.commerce.marketing.service.PromotionService;
import com.bhagya.commerce.order.repository.OrderRepository;
import com.bhagya.commerce.user.repository.UserRepository;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.Collections;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class MarketingStoreIsolationTest {

    private PromotionService promotionService;
    private CampaignService campaignService;

    @BeforeEach
    void setUp() {
        PromotionRepository promotionRepository = new PromotionRepository();
        CouponRepository couponRepository = new CouponRepository();
        CampaignRepository campaignRepository = new CampaignRepository();
        CampaignRecipientRepository recipientRepository = new CampaignRecipientRepository();
        CustomerSegmentRepository segmentRepository = new CustomerSegmentRepository();
        OrderRepository orderRepository = new OrderRepository();
        UserRepository userRepository = new UserRepository();

        promotionService = new PromotionService(promotionRepository, couponRepository);
        AudienceService audienceService = new AudienceService(segmentRepository, orderRepository, userRepository);
        campaignService = new CampaignService(
            campaignRepository,
            recipientRepository,
            audienceService,
            null,
            null,
            null,
            null,
            null
        );
    }

    @Test
    @DisplayName("Store A cannot view or launch Store B campaigns or promotions")
    void testMarketingMultiTenantIsolation() {
        // Create in Store A
        PromotionResponse promoA = promotionService.createPromotion("store_A", new PromotionCreateRequest(
            "Promo A", "Desc", PromotionType.FIXED_DISCOUNT, new BigDecimal("100"), BigDecimal.ZERO, null, "CODEA", Instant.now(), null, 100, 1, Collections.emptyList(), Collections.emptyList()
        ));
        CampaignResponse campA = campaignService.createCampaign("store_A", new CampaignCreateRequest(
            "Camp A", "Desc", CampaignChannel.EMAIL, null, null, promoA.id(), "Sub A", "Body A", null
        ));

        // Store B should be forbidden from accessing Store A's records
        assertThrows(ValidationException.class, () -> promotionService.getPromotionById(promoA.id(), "store_B"));
        assertThrows(ValidationException.class, () -> campaignService.getCampaignById(campA.id(), "store_B"));
        assertThrows(ValidationException.class, () -> campaignService.launchCampaign(campA.id(), "store_B"));
    }
}
