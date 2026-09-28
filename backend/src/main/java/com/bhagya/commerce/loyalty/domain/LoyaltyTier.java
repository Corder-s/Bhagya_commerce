package com.bhagya.commerce.loyalty.domain;

public enum LoyaltyTier {
    BRONZE(0, "Artisan Enthusiast", 1.0),
    SILVER(500, "Guild Apprentice", 1.1),
    GOLD(1500, "Master Patron", 1.25),
    PLATINUM(4000, "Heritage Connoisseur", 1.5);

    private final int minPointsRequired;
    private final String displayName;
    private final double earningMultiplier;

    LoyaltyTier(int minPointsRequired, String displayName, double earningMultiplier) {
        this.minPointsRequired = minPointsRequired;
        this.displayName = displayName;
        this.earningMultiplier = earningMultiplier;
    }

    public int getMinPointsRequired() {
        return minPointsRequired;
    }

    public String getDisplayName() {
        return displayName;
    }

    public double getEarningMultiplier() {
        return earningMultiplier;
    }

    public static LoyaltyTier fromLifetimePoints(int points) {
        if (points >= PLATINUM.minPointsRequired) return PLATINUM;
        if (points >= GOLD.minPointsRequired) return GOLD;
        if (points >= SILVER.minPointsRequired) return SILVER;
        return BRONZE;
    }
}
