package com.bhagya.commerce.analytics.domain;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;

public enum ComparisonPeriod {
    TODAY,
    YESTERDAY,
    DAYS_7,
    DAYS_30,
    DAYS_90,
    THIS_MONTH,
    PREVIOUS_MONTH,
    THIS_QUARTER,
    PREVIOUS_QUARTER,
    THIS_YEAR,
    CUSTOM;

    public String getLabel() {
        return switch (this) {
            case TODAY -> "Today vs Yesterday";
            case YESTERDAY -> "Yesterday vs Day Before";
            case DAYS_7 -> "Last 7 Days vs Prior 7 Days";
            case DAYS_30 -> "Last 30 Days vs Prior 30 Days";
            case DAYS_90 -> "Last 90 Days vs Prior 90 Days";
            case THIS_MONTH -> "This Month vs Prior Month";
            case PREVIOUS_MONTH -> "Previous Month vs Prior Month";
            case THIS_QUARTER -> "This Quarter vs Prior Quarter";
            case PREVIOUS_QUARTER -> "Previous Quarter vs Prior Quarter";
            case THIS_YEAR -> "This Year vs Prior Year";
            case CUSTOM -> "Custom Period vs Prior Period";
        };
    }

    public static ComparisonPeriod fromString(String val) {
        if (val == null || val.isBlank()) return DAYS_30;
        String s = val.trim().toLowerCase();
        return switch (s) {
            case "today" -> TODAY;
            case "yesterday" -> YESTERDAY;
            case "7d", "days_7", "week" -> DAYS_7;
            case "30d", "days_30", "month" -> DAYS_30;
            case "90d", "days_90", "quarter" -> DAYS_90;
            case "this_month" -> THIS_MONTH;
            case "previous_month", "last_month" -> PREVIOUS_MONTH;
            case "this_quarter" -> THIS_QUARTER;
            case "previous_quarter", "last_quarter" -> PREVIOUS_QUARTER;
            case "this_year", "ytd" -> THIS_YEAR;
            case "custom" -> CUSTOM;
            default -> DAYS_30;
        };
    }

    public record PeriodRange(Instant currentStart, Instant currentEnd, Instant previousStart, Instant previousEnd) {}

    public static PeriodRange resolveRange(ComparisonPeriod period, Instant customStart, Instant customEnd) {
        Instant now = Instant.now();
        LocalDate today = now.atZone(ZoneOffset.UTC).toLocalDate();

        if (period == CUSTOM && customStart != null && customEnd != null) {
            long days = Math.max(1, ChronoUnit.DAYS.between(customStart.atZone(ZoneOffset.UTC).toLocalDate(), customEnd.atZone(ZoneOffset.UTC).toLocalDate()) + 1);
            Instant prevStart = customStart.minus(days, ChronoUnit.DAYS);
            Instant prevEnd = customStart;
            return new PeriodRange(customStart, customEnd, prevStart, prevEnd);
        }

        return switch (period) {
            case TODAY -> {
                Instant cStart = today.atStartOfDay().toInstant(ZoneOffset.UTC);
                Instant pStart = today.minusDays(1).atStartOfDay().toInstant(ZoneOffset.UTC);
                yield new PeriodRange(cStart, now, pStart, cStart);
            }
            case YESTERDAY -> {
                Instant cStart = today.minusDays(1).atStartOfDay().toInstant(ZoneOffset.UTC);
                Instant cEnd = today.atStartOfDay().toInstant(ZoneOffset.UTC);
                Instant pStart = today.minusDays(2).atStartOfDay().toInstant(ZoneOffset.UTC);
                yield new PeriodRange(cStart, cEnd, pStart, cStart);
            }
            case DAYS_7 -> {
                Instant cStart = now.minus(7, ChronoUnit.DAYS);
                Instant pStart = now.minus(14, ChronoUnit.DAYS);
                yield new PeriodRange(cStart, now, pStart, cStart);
            }
            case DAYS_30 -> {
                Instant cStart = now.minus(30, ChronoUnit.DAYS);
                Instant pStart = now.minus(60, ChronoUnit.DAYS);
                yield new PeriodRange(cStart, now, pStart, cStart);
            }
            case DAYS_90 -> {
                Instant cStart = now.minus(90, ChronoUnit.DAYS);
                Instant pStart = now.minus(180, ChronoUnit.DAYS);
                yield new PeriodRange(cStart, now, pStart, cStart);
            }
            case THIS_MONTH -> {
                LocalDate firstDayThisMonth = today.withDayOfMonth(1);
                Instant cStart = firstDayThisMonth.atStartOfDay().toInstant(ZoneOffset.UTC);
                LocalDate firstDayPrevMonth = firstDayThisMonth.minusMonths(1);
                Instant pStart = firstDayPrevMonth.atStartOfDay().toInstant(ZoneOffset.UTC);
                yield new PeriodRange(cStart, now, pStart, cStart);
            }
            case PREVIOUS_MONTH -> {
                LocalDate firstDayThisMonth = today.withDayOfMonth(1);
                LocalDate firstDayPrevMonth = firstDayThisMonth.minusMonths(1);
                LocalDate firstDayTwoMonthsAgo = firstDayThisMonth.minusMonths(2);
                Instant cStart = firstDayPrevMonth.atStartOfDay().toInstant(ZoneOffset.UTC);
                Instant cEnd = firstDayThisMonth.atStartOfDay().toInstant(ZoneOffset.UTC);
                Instant pStart = firstDayTwoMonthsAgo.atStartOfDay().toInstant(ZoneOffset.UTC);
                yield new PeriodRange(cStart, cEnd, pStart, cStart);
            }
            case THIS_QUARTER -> {
                int firstMonthOfQuarter = ((today.getMonthValue() - 1) / 3) * 3 + 1;
                LocalDate firstDayQuarter = LocalDate.of(today.getYear(), firstMonthOfQuarter, 1);
                Instant cStart = firstDayQuarter.atStartOfDay().toInstant(ZoneOffset.UTC);
                Instant pStart = firstDayQuarter.minusMonths(3).atStartOfDay().toInstant(ZoneOffset.UTC);
                yield new PeriodRange(cStart, now, pStart, cStart);
            }
            case PREVIOUS_QUARTER -> {
                int firstMonthOfQuarter = ((today.getMonthValue() - 1) / 3) * 3 + 1;
                LocalDate firstDayCurrentQuarter = LocalDate.of(today.getYear(), firstMonthOfQuarter, 1);
                LocalDate firstDayPrevQuarter = firstDayCurrentQuarter.minusMonths(3);
                LocalDate firstDayTwoQuartersAgo = firstDayCurrentQuarter.minusMonths(6);
                Instant cStart = firstDayPrevQuarter.atStartOfDay().toInstant(ZoneOffset.UTC);
                Instant cEnd = firstDayCurrentQuarter.atStartOfDay().toInstant(ZoneOffset.UTC);
                Instant pStart = firstDayTwoQuartersAgo.atStartOfDay().toInstant(ZoneOffset.UTC);
                yield new PeriodRange(cStart, cEnd, pStart, cStart);
            }
            case THIS_YEAR -> {
                LocalDate firstDayYear = LocalDate.of(today.getYear(), 1, 1);
                Instant cStart = firstDayYear.atStartOfDay().toInstant(ZoneOffset.UTC);
                LocalDate firstDayPrevYear = LocalDate.of(today.getYear() - 1, 1, 1);
                Instant pStart = firstDayPrevYear.atStartOfDay().toInstant(ZoneOffset.UTC);
                yield new PeriodRange(cStart, now, pStart, cStart);
            }
            case CUSTOM -> {
                Instant cStart = now.minus(30, ChronoUnit.DAYS);
                Instant pStart = now.minus(60, ChronoUnit.DAYS);
                yield new PeriodRange(cStart, now, pStart, cStart);
            }
        };
    }
}
