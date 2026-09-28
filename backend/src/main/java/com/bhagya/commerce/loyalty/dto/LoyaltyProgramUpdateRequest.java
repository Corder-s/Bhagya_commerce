package com.bhagya.commerce.loyalty.dto;

import java.math.BigDecimal;

public record LoyaltyProgramUpdateRequest(
    Boolean enabled,
    String programName,
    BigDecimal pointsPerSpent,
    BigDecimal currencyRatio,
    Integer signupBonusPoints,
    Integer firstOrderBonusPoints,
    Integer reviewBonusPoints,
    Integer referralSenderPoints,
    Integer referralReceiverPoints,
    BigDecimal minOrderForPoints,
    BigDecimal minOrderForReferral,
    Integer pointsExpiryDays,
    Integer expiryNotificationDays
) {}
