package com.bhagya.commerce.loyalty.worker;

import com.bhagya.commerce.loyalty.service.LoyaltyService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class LoyaltyExpirationWorker {

    private static final Logger log = LoggerFactory.getLogger(LoyaltyExpirationWorker.class);

    private final LoyaltyService loyaltyService;

    public LoyaltyExpirationWorker(LoyaltyService loyaltyService) {
        this.loyaltyService = loyaltyService;
    }

    /**
     * Nightly worker job running at 2:00 AM to process point expirations
     * based on each merchant store's expiration policy.
     */
    @Scheduled(cron = "0 0 2 * * *")
    public void runNightlyExpirationJob() {
        log.info("[LOYALTY-WORKER] Starting scheduled nightly points expiration sweep...");
        try {
            loyaltyService.processExpiredPoints("store_main");
            loyaltyService.processExpiredPoints("store_varanasi_silk");
            log.info("[LOYALTY-WORKER] Nightly points expiration sweep completed successfully.");
        } catch (Exception e) {
            log.error("[LOYALTY-WORKER] Error executing nightly expiration sweep: {}", e.getMessage(), e);
        }
    }
}
