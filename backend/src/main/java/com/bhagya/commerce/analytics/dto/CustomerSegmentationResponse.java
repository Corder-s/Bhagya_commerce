package com.bhagya.commerce.analytics.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public record CustomerSegmentationResponse(
    String storeId,
    long totalPatrons,
    long newPatrons,
    long returningPatrons,
    double repeatRate,
    BigDecimal averageLifetimeValueInr,
    List<SegmentDistributionItem> segments,
    List<RfmCustomerProfile> rfmProfiles,
    List<Map<String, Object>> cohorts,
    String privacyNote
) {
    public record SegmentDistributionItem(
        String segmentKey,
        String displayName,
        long patronCount,
        double percentageOfBase,
        BigDecimal totalSpendInr,
        String description,
        String actionRecommendation
    ) {}

    public record RfmCustomerProfile(
        String customerId,
        String customerNameMasked,
        int recencyDays,
        int frequencyOrders,
        BigDecimal monetaryTotalInr,
        String rfmScore, // e.g. "5-4-5"
        String assignedSegment
    ) {}
}
