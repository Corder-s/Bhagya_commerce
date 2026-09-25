package com.bhagya.commerce.marketing.repository;

import com.bhagya.commerce.marketing.domain.Campaign;
import com.bhagya.commerce.marketing.domain.CampaignChannel;
import com.bhagya.commerce.marketing.domain.CampaignStatus;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Repository;

@Repository
public class CampaignRepository {

    private final Map<String, Campaign> storage = new ConcurrentHashMap<>();

    public CampaignRepository() {
        seedInitialCampaigns();
    }

    private void seedInitialCampaigns() {
        Instant now = Instant.now();
        String storeId = "store_varanasi_silk";

        Campaign c1 = new Campaign(
            "camp_festive_broadcast",
            storeId,
            "Navratri Heritage Silk Broadcast",
            "Celebratory announcement for handcrafted Banarasi zari saree collection",
            CampaignChannel.WHATSAPP,
            CampaignStatus.COMPLETED,
            "seg_all",
            "All Verified Customers",
            "promo_festive_15",
            "Festive Zari Weaves Announcement",
            "Namaste from Varanasi Handloom Guild! Explore our new GI-tagged festive Katan silks with 15% off using code NAVRATRI15. View collection: https://bhagya.commerce/shop",
            now.minus(4, ChronoUnit.DAYS)
        );
        c1.setTotalRecipients(142);
        c1.setSentCount(142);
        c1.setDeliveredCount(138);
        c1.setAttributedOrders(14);
        c1.setAttributedSales(new BigDecimal("53900.00"));
        c1.setStartedAt(now.minus(4, ChronoUnit.DAYS));
        c1.setCompletedAt(now.minus(4, ChronoUnit.DAYS).plusSeconds(180));
        save(c1);

        Campaign c2 = new Campaign(
            "camp_repeat_buyer_vip",
            storeId,
            "Exclusive VIP Master Artisan Preview",
            "Private email catalog preview for repeat connoisseurs",
            CampaignChannel.EMAIL,
            CampaignStatus.ACTIVE,
            "seg_returning",
            "Repeat Buyers & Connoisseurs",
            "promo_welcome_500",
            "Exclusive Preview: Rare Kadwa Weave Silk Sarees ?",
            "Dear Patron, Master Artisan Rajesh invites you to preview our latest Kadwa weaves before public release. Enjoy ?500 privileged savings with code WELCOME500.",
            now.minus(1, ChronoUnit.DAYS)
        );
        c2.setTotalRecipients(38);
        c2.setSentCount(38);
        c2.setDeliveredCount(37);
        c2.setAttributedOrders(7);
        c2.setAttributedSales(new BigDecimal("26950.00"));
        c2.setStartedAt(now.minus(1, ChronoUnit.DAYS));
        save(c2);
    }

    public Campaign save(Campaign campaign) {
        if (campaign.getId() == null || campaign.getId().isBlank()) {
            campaign.setId("camp_" + System.currentTimeMillis() + "_" + (int) (Math.random() * 10000));
        }
        storage.put(campaign.getId(), campaign);
        return campaign;
    }

    public Optional<Campaign> findById(String id) {
        return Optional.ofNullable(storage.get(id));
    }

    public List<Campaign> findByStoreId(String storeId) {
        return storage.values().stream()
            .filter(c -> storeId == null || storeId.equals(c.getStoreId()))
            .toList();
    }

    public List<Campaign> findAll() {
        return new ArrayList<>(storage.values());
    }
}
