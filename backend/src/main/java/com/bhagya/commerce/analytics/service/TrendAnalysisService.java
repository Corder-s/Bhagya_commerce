package com.bhagya.commerce.analytics.service;

import com.bhagya.commerce.analytics.domain.ComparisonPeriod;
import com.bhagya.commerce.order.domain.Order;
import com.bhagya.commerce.order.domain.OrderStatus;
import com.bhagya.commerce.order.repository.OrderRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.DayOfWeek;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class TrendAnalysisService {

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private final OrderRepository orderRepository;

    public TrendAnalysisService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public record DailyTrendPoint(
        String date,
        BigDecimal grossSales,
        BigDecimal netSales,
        long orderCount,
        BigDecimal averageOrderValue
    ) {}

    public record SeasonalityPattern(
        String dayOfWeek,
        long orderCount,
        BigDecimal totalRevenueInr,
        double sharePercentage
    ) {}

    public record TrendAnalysisReport(
        String storeId,
        String period,
        List<DailyTrendPoint> trendSeries,
        String trendDirection, // "EXPANDING", "STABLE", "CONTRACTING", "INSUFFICIENT_DATA"
        String trendExplanation,
        List<SeasonalityPattern> dayOfWeekDistribution,
        String peakShoppingDay,
        boolean hasSufficientData,
        String adequacyNotice
    ) {}

    public TrendAnalysisReport analyzeTrends(String storeId, ComparisonPeriod period, Instant customStart, Instant customEnd) {
        ComparisonPeriod.PeriodRange range = ComparisonPeriod.resolveRange(period, customStart, customEnd);
        List<Order> orders = (storeId != null ? orderRepository.findByStoreId(storeId) : orderRepository.findAll())
            .stream()
            .filter(o -> !o.getCreatedAt().isBefore(range.currentStart()) && !o.getCreatedAt().isAfter(range.currentEnd()))
            .toList();

        Map<String, List<Order>> ordersByDate = orders.stream()
            .collect(Collectors.groupingBy(o -> o.getCreatedAt().atZone(ZoneOffset.UTC).format(DATE_FMT)));

        LocalDate startDate = range.currentStart().atZone(ZoneOffset.UTC).toLocalDate();
        LocalDate endDate = range.currentEnd().atZone(ZoneOffset.UTC).toLocalDate();
        int totalDays = (int) ChronoUnit.DAYS.between(startDate, endDate) + 1;

        List<DailyTrendPoint> series = new ArrayList<>();
        BigDecimal totalNet = BigDecimal.ZERO;
        long totalOrders = 0;

        for (int i = 0; i < totalDays; i++) {
            LocalDate d = startDate.plusDays(i);
            String dStr = d.format(DATE_FMT);
            List<Order> dayOrders = ordersByDate.getOrDefault(dStr, Collections.emptyList());

            BigDecimal gross = BigDecimal.ZERO;
            BigDecimal refunds = BigDecimal.ZERO;
            long count = 0;

            for (Order o : dayOrders) {
                if (o.getStatus() != OrderStatus.CANCELLED) {
                    gross = gross.add(o.getSubtotalInr() != null ? o.getSubtotalInr() : BigDecimal.ZERO);
                    count++;
                }
                if ("REFUNDED".equalsIgnoreCase(o.getPaymentStatus())) {
                    refunds = refunds.add(o.getTotalInr() != null ? o.getTotalInr() : BigDecimal.ZERO);
                }
            }

            BigDecimal net = gross.subtract(refunds);
            if (net.compareTo(BigDecimal.ZERO) < 0) net = BigDecimal.ZERO;

            BigDecimal aov = count > 0 ? net.divide(BigDecimal.valueOf(count), 2, RoundingMode.HALF_UP) : BigDecimal.ZERO;
            totalNet = totalNet.add(net);
            totalOrders += count;

            series.add(new DailyTrendPoint(
                dStr,
                gross.setScale(2, RoundingMode.HALF_UP),
                net.setScale(2, RoundingMode.HALF_UP),
                count,
                aov
            ));
        }

        // Seasonality: Group by DayOfWeek
        Map<DayOfWeek, Long> dowCount = new EnumMap<>(DayOfWeek.class);
        Map<DayOfWeek, BigDecimal> dowRevenue = new EnumMap<>(DayOfWeek.class);
        for (DayOfWeek dow : DayOfWeek.values()) {
            dowCount.put(dow, 0L);
            dowRevenue.put(dow, BigDecimal.ZERO);
        }

        for (Order o : orders) {
            if (o.getStatus() != OrderStatus.CANCELLED) {
                DayOfWeek dow = o.getCreatedAt().atZone(ZoneOffset.UTC).getDayOfWeek();
                dowCount.put(dow, dowCount.get(dow) + 1);
                BigDecimal amt = o.getTotalInr() != null ? o.getTotalInr() : BigDecimal.ZERO;
                dowRevenue.put(dow, dowRevenue.get(dow).add(amt));
            }
        }

        List<SeasonalityPattern> seasonality = new ArrayList<>();
        DayOfWeek peakDay = DayOfWeek.SATURDAY;
        BigDecimal maxDayRev = BigDecimal.ZERO;

        for (DayOfWeek dow : DayOfWeek.values()) {
            long c = dowCount.get(dow);
            BigDecimal r = dowRevenue.get(dow);
            double share = totalNet.compareTo(BigDecimal.ZERO) > 0
                ? Math.round(r.divide(totalNet, 4, RoundingMode.HALF_UP).doubleValue() * 1000.0) / 10.0
                : 0.0;

            if (r.compareTo(maxDayRev) > 0) {
                maxDayRev = r;
                peakDay = dow;
            }

            seasonality.add(new SeasonalityPattern(
                dow.name(),
                c,
                r.setScale(2, RoundingMode.HALF_UP),
                share
            ));
        }

        boolean sufficient = totalOrders >= 3 || totalDays >= 7;
        String direction;
        String explanation;
        String notice;

        if (!sufficient) {
            direction = "INSUFFICIENT_DATA";
            explanation = "Sample size within this period is insufficient to establish a statistically meaningful sales trend.";
            notice = "Requires at least 3 orders or 7 active transactional days.";
        } else {
            // Compare first half vs second half
            int mid = series.size() / 2;
            BigDecimal firstHalf = series.subList(0, mid).stream().map(DailyTrendPoint::netSales).reduce(BigDecimal.ZERO, BigDecimal::add);
            BigDecimal secondHalf = series.subList(mid, series.size()).stream().map(DailyTrendPoint::netSales).reduce(BigDecimal.ZERO, BigDecimal::add);

            if (secondHalf.compareTo(firstHalf.multiply(new BigDecimal("1.10"))) > 0) {
                direction = "EXPANDING";
                explanation = "Order run-rate and net sales accelerated in the latter half of the selected period.";
            } else if (secondHalf.compareTo(firstHalf.multiply(new BigDecimal("0.90"))) < 0) {
                direction = "CONTRACTING";
                explanation = "Daily sales velocity moderated compared with earlier observations in this period.";
            } else {
                direction = "STABLE";
                explanation = "Daily transactions demonstrate steady revenue velocity consistent with baseline averages.";
            }
            notice = "Based on " + totalOrders + " verified historical orders across " + totalDays + " days.";
        }

        return new TrendAnalysisReport(
            storeId,
            period.name(),
            series,
            direction,
            explanation,
            seasonality,
            peakDay.name(),
            sufficient,
            notice
        );
    }
}
