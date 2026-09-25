package com.bhagya.commerce.marketing.repository;

import com.bhagya.commerce.marketing.domain.CampaignRecipient;
import com.bhagya.commerce.marketing.domain.RecipientDeliveryStatus;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Repository;

@Repository
public class CampaignRecipientRepository {

    private final Map<String, CampaignRecipient> storage = new ConcurrentHashMap<>();

    public CampaignRecipient save(CampaignRecipient recipient) {
        if (recipient.getId() == null || recipient.getId().isBlank()) {
            recipient.setId("rcpt_" + System.currentTimeMillis() + "_" + (int) (Math.random() * 100000));
        }
        storage.put(recipient.getId(), recipient);
        return recipient;
    }

    public Optional<CampaignRecipient> findById(String id) {
        return Optional.ofNullable(storage.get(id));
    }

    public List<CampaignRecipient> findByCampaignId(String campaignId) {
        return storage.values().stream()
            .filter(r -> r.getCampaignId().equals(campaignId))
            .toList();
    }

    public List<CampaignRecipient> findByCampaignIdAndStatus(String campaignId, RecipientDeliveryStatus status) {
        return storage.values().stream()
            .filter(r -> r.getCampaignId().equals(campaignId) && r.getStatus() == status)
            .toList();
    }
}
