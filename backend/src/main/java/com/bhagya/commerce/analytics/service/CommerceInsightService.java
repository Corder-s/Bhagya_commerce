package com.bhagya.commerce.analytics.service;

import com.bhagya.commerce.analytics.domain.IntelligenceInsight;
import com.bhagya.commerce.analytics.dto.OpportunitySignalResponse;
import com.bhagya.commerce.analytics.repository.IntelligenceInsightRepository;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class CommerceInsightService {

    private static final Logger log = LoggerFactory.getLogger(CommerceInsightService.class);

    private final IntelligenceInsightRepository insightRepository;
    private final CommerceMetricService metricService;
    private final CommerceOpportunityService opportunityService;
    private final InventoryIntelligenceService inventoryIntelligenceService;
    private final CustomerIntelligenceService customerIntelligenceService;

    public CommerceInsightService(
        IntelligenceInsightRepository insightRepository,
        CommerceMetricService metricService,
        CommerceOpportunityService opportunityService,
        InventoryIntelligenceService inventoryIntelligenceService,
        CustomerIntelligenceService customerIntelligenceService
    ) {
        this.insightRepository = insightRepository;
        this.metricService = metricService;
        this.opportunityService = opportunityService;
        this.inventoryIntelligenceService = inventoryIntelligenceService;
        this.customerIntelligenceService = customerIntelligenceService;
    }

    public List<IntelligenceInsight> getTopInsights(String storeId) {
        syncDynamicInsights(storeId);
        return insightRepository.findByStoreId(storeId);
    }

    /**
     * Synthesizes live decision-support insights strictly answering:
     * WHAT HAPPENED? WHY DID IT HAPPEN? WHAT REQUIRES ATTENTION? WHAT COULD BE CONSIDERED?
     */
    public synchronized void syncDynamicInsights(String storeId) {
        try {
            // 1. Evaluate top revenue opportunities
            List<OpportunitySignalResponse> opportunities = opportunityService.detectOpportunities(storeId);
            for (OpportunitySignalResponse opp : opportunities) {
                String insightKey = "ins_opp_" + (opp.entityId() != null ? opp.entityId() : opp.type());
                boolean exists = insightRepository.findByStoreId(storeId).stream()
                    .anyMatch(i -> i.getId().equals(insightKey));

                if (!exists) {
                    IntelligenceInsight insight = new IntelligenceInsight(
                        insightKey,
                        storeId,
                        "OPPORTUNITY",
                        opp.severity(),
                        opp.title(),
                        opp.signalDescription(),
                        opp.evidence(),
                        opp.type(),
                        opp.suggestedAction()
                    );
                    insightRepository.save(insight);
                }
            }

            // 2. Evaluate Repeat Purchase & Loyalty
            Map<String, Object> segs = customerIntelligenceService.getCustomerSegmentation(storeId);
            Number returningCount = (Number) segs.get("returningCustomers");
            Number totalCustomers = (Number) segs.get("totalCustomers");
            if (totalCustomers != null && totalCustomers.intValue() > 0 && returningCount != null) {
                String repKey = "ins_rep_rate_" + storeId;
                boolean exists = insightRepository.findByStoreId(storeId).stream().anyMatch(i -> i.getId().equals(repKey));
                if (!exists) {
                    double rate = (returningCount.doubleValue() / totalCustomers.doubleValue()) * 100.0;
                    IntelligenceInsight repInsight = new IntelligenceInsight(
                        repKey,
                        storeId,
                        "CUSTOMER",
                        rate >= 25.0 ? "INFO" : "WARNING",
                        String.format("Store Repeat Purchase Rate at %.1f%%", rate),
                        String.format("%d of %d unique patrons made more than one purchase across active history.", returningCount.intValue(), totalCustomers.intValue()),
                        "Customer loyalty and repeat order frequency calculated directly from verified customer orders.",
                        "REPEAT_PURCHASE_RATE",
                        rate >= 25.0
                            ? "High repeat engagement. Consider introducing targeted VIP loyalty tier benefits for top buyers."
                            : "Consider automated post-purchase care communications and targeted GI craft bundle offers to stimulate second purchases."
                    );
                    insightRepository.save(repInsight);
                }
            }

            // 3. Evaluate Inventory Depletion
            Map<String, Object> invSignals = inventoryIntelligenceService.getInventorySignals(storeId);
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> stockoutRisks = (List<Map<String, Object>>) invSignals.get("stockoutRiskProducts");
            if (stockoutRisks != null && !stockoutRisks.isEmpty()) {
                Map<String, Object> highestRisk = stockoutRisks.get(0);
                String prodName = (String) highestRisk.get("productName");
                Number stock = (Number) highestRisk.get("currentStock");
                String invKey = "ins_inv_risk_" + highestRisk.get("productId");
                boolean exists = insightRepository.findByStoreId(storeId).stream().anyMatch(i -> i.getId().equals(invKey));
                if (!exists) {
                    IntelligenceInsight invInsight = new IntelligenceInsight(
                        invKey,
                        storeId,
                        "INVENTORY",
                        "WARNING",
                        "Stock depletion alert for " + prodName,
                        String.format("Current inventory level is %d units with recent daily checkout activity.", stock.intValue()),
                        "Consistent customer order demand over the last 7-day trailing window.",
                        "STOCKOUT_RISK",
                        "Review current inventory runout velocity and initiate artisan re-stocking or reorder batch to prevent catalog stockout."
                    );
                    insightRepository.save(invInsight);
                }
            }
        } catch (Exception e) {
            log.warn("Failed syncing dynamic insights for store {}: {}", storeId, e.getMessage());
        }
    }
}
