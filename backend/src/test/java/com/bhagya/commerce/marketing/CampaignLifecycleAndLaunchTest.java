package com.bhagya.commerce.marketing;

import static org.junit.jupiter.api.Assertions.*;

import com.bhagya.commerce.marketing.domain.CampaignChannel;
import com.bhagya.commerce.marketing.domain.CampaignStatus;
import com.bhagya.commerce.marketing.dto.CampaignCreateRequest;
import com.bhagya.commerce.marketing.dto.CampaignLaunchResponse;
import com.bhagya.commerce.marketing.dto.CampaignResponse;
import com.bhagya.commerce.marketing.repository.CampaignRecipientRepository;
import com.bhagya.commerce.marketing.repository.CampaignRepository;
import com.bhagya.commerce.marketing.repository.CustomerSegmentRepository;
import com.bhagya.commerce.marketing.service.AudienceService;
import com.bhagya.commerce.marketing.service.CampaignService;
import com.bhagya.commerce.order.repository.OrderRepository;
import com.bhagya.commerce.user.repository.UserRepository;
import java.time.Instant;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class CampaignLifecycleAndLaunchTest {

    private CampaignService campaignService;
    private final String storeId = "store_test_camp";

    @BeforeEach
    void setUp() {
        CampaignRepository campaignRepository = new CampaignRepository();
        CampaignRecipientRepository recipientRepository = new CampaignRecipientRepository();
        CustomerSegmentRepository segmentRepository = new CustomerSegmentRepository();
        OrderRepository orderRepository = new OrderRepository();
        UserRepository userRepository = new UserRepository();

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
    @DisplayName("Should create, launch, and complete campaign dispatch")
    void testCampaignLaunch() {
        CampaignResponse created = campaignService.createCampaign(storeId, new CampaignCreateRequest(
            "Festive Zari Broadcast",
            "WhatsApp festive offer",
            CampaignChannel.WHATSAPP,
            "seg_all",
            "All Verified Customers",
            "promo_101",
            "Festive Offer",
            "Namaste! Enjoy 15% off using code FESTIVE15",
            null
        ));

        assertEquals(CampaignStatus.DRAFT, created.status());

        CampaignLaunchResponse launchRes = campaignService.launchCampaign(created.id(), storeId);
        assertNotNull(launchRes);
        assertEquals("COMPLETED", launchRes.status());
        assertTrue(launchRes.queuedRecipients() > 0);

        CampaignResponse fetched = campaignService.getCampaignById(created.id(), storeId);
        assertEquals(CampaignStatus.COMPLETED, fetched.status());
        assertEquals(launchRes.queuedRecipients(), fetched.sentCount());
    }
}
