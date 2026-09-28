package com.bhagya.commerce.analytics.service;

import com.bhagya.commerce.analytics.domain.ComparisonPeriod;
import com.bhagya.commerce.analytics.domain.ComparisonResult;
import com.bhagya.commerce.analytics.domain.MetricDefinition;
import com.bhagya.commerce.analytics.dto.CanonicalMetricResult;
import com.bhagya.commerce.catalog.product.domain.Product;
import com.bhagya.commerce.catalog.product.repository.ProductRepository;
import com.bhagya.commerce.order.domain.Order;
import com.bhagya.commerce.order.domain.OrderItem;
import com.bhagya.commerce.order.domain.OrderStatus;
import com.bhagya.commerce.order.repository.OrderRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.*;
import org.springframework.stereotype.Service;

@Service
public class CommerceMetricService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public CommerceMetricService(
        OrderRepository orderRepository,
        ProductRepository productRepository
    ) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    public record PeriodFinancialBreakdown(
        BigDecimal grossSales,
        BigDecimal discounts,
        BigDecimal tax,
        BigDecimal shippingFees,
        BigDecimal refunds,
        BigDecimal netSales,
        long totalOrders,
        long paidOrders,
        long unitsSold,
        BigDecimal averageOrderValue,
        double refundRate,
        double cancellationRate
    ) {}

    public PeriodFinancialBreakdown computeBreakdown(String storeId, Instant start, Instant end) {
        List<Order> orders = getFilteredOrders(storeId, start, end);

        BigDecimal gross = BigDecimal.ZERO;
        BigDecimal disc = BigDecimal.ZERO;
        BigDecimal taxes = BigDecimal.ZERO;
        BigDecimal ship = BigDecimal.ZERO;
        BigDecimal ref = BigDecimal.ZERO;

        long paidCount = 0;
        long totalCount = orders.size();
        long units = 0;
        long cancelledCount = 0;
        long refundedCount = 0;

        for (Order o : orders) {
            if (o.getStatus() != OrderStatus.CANCELLED) {
                gross = gross.add(o.getSubtotalInr() != null ? o.getSubtotalInr() : BigDecimal.ZERO);
                disc = disc.add(o.getDiscountInr() != null ? o.getDiscountInr() : BigDecimal.ZERO);
                taxes = taxes.add(o.getTaxInr() != null ? o.getTaxInr() : BigDecimal.ZERO);
                ship = ship.add(o.getDeliveryFeeInr() != null ? o.getDeliveryFeeInr() : BigDecimal.ZERO);

                for (OrderItem item : o.getItems()) {
                    units += item.getQuantity();
                }

                if ("PAID".equalsIgnoreCase(o.getPaymentStatus()) || o.getStatus() == OrderStatus.DELIVERED) {
                    paidCount++;
                }
            } else {
                cancelledCount++;
            }

            if ("REFUNDED".equalsIgnoreCase(o.getPaymentStatus())) {
                ref = ref.add(o.getTotalInr() != null ? o.getTotalInr() : BigDecimal.ZERO);
                refundedCount++;
            }
        }

        BigDecimal net = gross.subtract(disc).subtract(ref);
        if (net.compareTo(BigDecimal.ZERO) < 0) {
            net = BigDecimal.ZERO;
        }

        BigDecimal aov = paidCount > 0
            ? net.divide(BigDecimal.valueOf(paidCount), 2, RoundingMode.HALF_UP)
            : BigDecimal.ZERO;

        double refundRate = totalCount > 0
            ? Math.round(((double) refundedCount / totalCount) * 1000.0) / 10.0
            : 0.0;

        double cancellationRate = totalCount > 0
            ? Math.round(((double) cancelledCount / totalCount) * 1000.0) / 10.0
            : 0.0;

        return new PeriodFinancialBreakdown(
            gross.setScale(2, RoundingMode.HALF_UP),
            disc.setScale(2, RoundingMode.HALF_UP),
            taxes.setScale(2, RoundingMode.HALF_UP),
            ship.setScale(2, RoundingMode.HALF_UP),
            ref.setScale(2, RoundingMode.HALF_UP),
            net.setScale(2, RoundingMode.HALF_UP),
            totalCount,
            paidCount,
            units,
            aov,
            refundRate,
            cancellationRate
        );
    }

    public List<CanonicalMetricResult> calculateCanonicalMetrics(String storeId, ComparisonPeriod period, Instant customStart, Instant customEnd) {
        return getCanonicalKpiMetrics(storeId, period, customStart, customEnd);
    }

    public List<CanonicalMetricResult> getCanonicalKpiMetrics(String storeId, ComparisonPeriod period, Instant customStart, Instant customEnd) {
        ComparisonPeriod.PeriodRange range = ComparisonPeriod.resolveRange(period, customStart, customEnd);

        PeriodFinancialBreakdown current = computeBreakdown(storeId, range.currentStart(), range.currentEnd());
        PeriodFinancialBreakdown baseline = computeBreakdown(storeId, range.previousStart(), range.previousEnd());

        List<CanonicalMetricResult> results = new ArrayList<>();

        // 1. Net Revenue
        results.add(CanonicalMetricResult.of(
            MetricDefinition.NET_REVENUE,
            current.netSales(),
            period.name(),
            ComparisonResult.calculate(current.netSales(), baseline.netSales(), "₹"),
            storeId,
            "Net Sales = Gross Sales - Discounts - Refunds"
        ));

        // 2. Gross Revenue
        results.add(CanonicalMetricResult.of(
            MetricDefinition.GROSS_REVENUE,
            current.grossSales(),
            period.name(),
            ComparisonResult.calculate(current.grossSales(), baseline.grossSales(), "₹"),
            storeId,
            "Gross Sales = Sum of subtotal of non-cancelled orders"
        ));

        // 3. Orders
        results.add(CanonicalMetricResult.of(
            MetricDefinition.ORDER_COUNT,
            BigDecimal.valueOf(current.totalOrders()),
            period.name(),
            ComparisonResult.calculate(BigDecimal.valueOf(current.totalOrders()), BigDecimal.valueOf(baseline.totalOrders()), ""),
            storeId,
            "Order Count = Count of all order records created in period"
        ));

        // 4. Units Sold
        results.add(CanonicalMetricResult.of(
            MetricDefinition.UNITS_SOLD,
            BigDecimal.valueOf(current.unitsSold()),
            period.name(),
            ComparisonResult.calculate(BigDecimal.valueOf(current.unitsSold()), BigDecimal.valueOf(baseline.unitsSold()), ""),
            storeId,
            "Units Sold = Sum of quantities of line items across confirmed orders"
        ));

        // 5. Average Order Value
        results.add(CanonicalMetricResult.of(
            MetricDefinition.AVERAGE_ORDER_VALUE,
            current.averageOrderValue(),
            period.name(),
            ComparisonResult.calculate(current.averageOrderValue(), baseline.averageOrderValue(), "₹"),
            storeId,
            "AOV = Net Sales / Paid Orders Count"
        ));

        // 6. Refund Amount
        results.add(CanonicalMetricResult.of(
            MetricDefinition.REFUND_AMOUNT,
            current.refunds(),
            period.name(),
            ComparisonResult.calculate(current.refunds(), baseline.refunds(), "₹"),
            storeId,
            "Refunds = Sum of totalInr for orders marked REFUNDED"
        ));

        // 7. Cancellation Rate
        results.add(CanonicalMetricResult.of(
            MetricDefinition.CANCELLATION_RATE,
            BigDecimal.valueOf(current.cancellationRate()),
            period.name(),
            ComparisonResult.calculate(BigDecimal.valueOf(current.cancellationRate()), BigDecimal.valueOf(baseline.cancellationRate()), "%"),
            storeId,
            "Cancellation Rate = Cancelled Orders / Total Orders * 100"
        ));

        // 8. Stockout Rate
        List<Product> products = storeId != null ? productRepository.findByStoreId(storeId) : productRepository.findAll();
        long outOfStock = products.stream().filter(p -> p.getStockQuantity() <= 0).count();
        double stockoutRate = products.isEmpty() ? 0.0 : Math.round(((double) outOfStock / products.size()) * 1000.0) / 10.0;

        results.add(CanonicalMetricResult.of(
            MetricDefinition.STOCKOUT_RATE,
            BigDecimal.valueOf(stockoutRate),
            period.name(),
            ComparisonResult.calculate(BigDecimal.valueOf(stockoutRate), BigDecimal.valueOf(stockoutRate), "%"),
            storeId,
            "Stockout Rate = Products with stock <= 0 / Total Active Catalog Products * 100"
        ));

        return results;
    }

    private List<Order> getFilteredOrders(String storeId, Instant start, Instant end) {
        List<Order> base = storeId != null
            ? orderRepository.findByStoreId(storeId)
            : orderRepository.findAll();

        return base.stream()
            .filter(o -> (start == null || !o.getCreatedAt().isBefore(start)) && (end == null || !o.getCreatedAt().isAfter(end)))
            .toList();
    }
}
