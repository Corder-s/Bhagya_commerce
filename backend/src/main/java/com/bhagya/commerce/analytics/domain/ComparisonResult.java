package com.bhagya.commerce.analytics.domain;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Robust comparison result between a current period and a baseline comparison period.
 * Explicitly guards against division by zero and misleading infinite percentages.
 */
public record ComparisonResult(
    BigDecimal currentValue,
    BigDecimal baselineValue,
    BigDecimal absoluteChange,
    Double percentageChange,
    String trendDirection, // "UP", "DOWN", "FLAT", "NEW_ACTIVITY"
    boolean isNewActivity,
    String formattedChangeLabel
) {
    public static ComparisonResult calculate(BigDecimal current, BigDecimal baseline, String currencySymbol) {
        BigDecimal c = current != null ? current : BigDecimal.ZERO;
        BigDecimal b = baseline != null ? baseline : BigDecimal.ZERO;

        BigDecimal diff = c.subtract(b);

        if (b.compareTo(BigDecimal.ZERO) == 0) {
            if (c.compareTo(BigDecimal.ZERO) > 0) {
                String prefix = currencySymbol != null && !currencySymbol.isBlank() ? currencySymbol : "";
                return new ComparisonResult(
                    c,
                    b,
                    diff,
                    null,
                    "NEW_ACTIVITY",
                    true,
                    "+" + prefix + c.toPlainString() + " (New activity)"
                );
            } else {
                return new ComparisonResult(
                    c,
                    b,
                    BigDecimal.ZERO,
                    0.0,
                    "FLAT",
                    false,
                    "No change"
                );
            }
        }

        // Baseline > 0: calculate percentage safely
        BigDecimal pct = diff.divide(b, 4, RoundingMode.HALF_UP)
            .multiply(BigDecimal.valueOf(100))
            .setScale(1, RoundingMode.HALF_UP);

        double pctVal = pct.doubleValue();
        String direction = pctVal > 0 ? "UP" : (pctVal < 0 ? "DOWN" : "FLAT");
        String sign = pctVal > 0 ? "+" : "";
        String label = sign + pctVal + "% vs prior period";

        return new ComparisonResult(
            c,
            b,
            diff,
            pctVal,
            direction,
            false,
            label
        );
    }
}
