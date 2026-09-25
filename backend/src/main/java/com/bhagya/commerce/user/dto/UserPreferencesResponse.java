package com.bhagya.commerce.user.dto;

import java.util.List;

public record UserPreferencesResponse(
    String userId,
    String preferredLanguage,
    boolean orderStatusSms,
    boolean orderStatusWhatsapp,
    boolean promotionalEmails,
    List<String> favoriteCraftCategories
) {}
