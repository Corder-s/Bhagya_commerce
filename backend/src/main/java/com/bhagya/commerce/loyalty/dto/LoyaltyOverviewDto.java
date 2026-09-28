package com.bhagya.commerce.loyalty.dto;

import java.math.BigDecimal;

public record LoyaltyOverviewDto(
    String storeId,
    boolean programEnabled,
    String programName,
    int totalMembers,
    int activeMembers,
    long totalPointsIssued,
    long totalPointsRedeemed,
    long outstandingPointsLiability,
    BigDecimal outstandingValueInr,
    int activeRewardsCount,
    int totalRedemptionsCount,
    int totalReferralsCreated,
    int totalReferralsQualified,
    BigDecimal referralSalesInr
) {}
