package com.bhagya.commerce.loyalty.dto;

import com.bhagya.commerce.loyalty.domain.LoyaltyProgram;
import java.math.BigDecimal;
import java.time.Instant;

public record LoyaltyProgramDto(
    String id,
    String storeId,
    boolean enabled,
    String programName,
    BigDecimal pointsPerSpent,
    BigDecimal currencyRatio,
    int signupBonusPoints,
    int firstOrderBonusPoints,
    int reviewBonusPoints,
    int referralSenderPoints,
    int referralReceiverPoints,
    BigDecimal minOrderForPoints,
    BigDecimal minOrderForReferral,
    int pointsExpiryDays,
    int expiryNotificationDays,
    Instant updatedAt
) {
    public static LoyaltyProgramDto fromDomain(LoyaltyProgram p) {
        return new LoyaltyProgramDto(
            p.getId(),
            p.getStoreId(),
            p.isEnabled(),
            p.getProgramName(),
            p.getPointsPerSpent(),
            p.getCurrencyRatio(),
            p.getSignupBonusPoints(),
            p.getFirstOrderBonusPoints(),
            p.getReviewBonusPoints(),
            p.getReferralSenderPoints(),
            p.getReferralReceiverPoints(),
            p.getMinOrderForPoints(),
            p.getMinOrderForReferral(),
            p.getPointsExpiryDays(),
            p.getExpiryNotificationDays(),
            p.getUpdatedAt()
        );
    }
}
