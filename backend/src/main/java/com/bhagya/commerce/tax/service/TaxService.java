package com.bhagya.commerce.tax.service;

import com.bhagya.commerce.tax.domain.TaxRule;
import com.bhagya.commerce.tax.domain.TaxType;
import com.bhagya.commerce.tax.dto.TaxBreakdown;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
public class TaxService {

    private static final BigDecimal DEFAULT_GST_RATE = new BigDecimal("0.05"); // 5% standard handicraft/artisanal GST
    private static final BigDecimal TWO = new BigDecimal("2");

    public TaxBreakdown calculateOrderTax(BigDecimal subtotal, BigDecimal discount, boolean isInterState, String productCategory) {
        BigDecimal safeSubtotal = subtotal != null ? subtotal : BigDecimal.ZERO;
        BigDecimal safeDiscount = discount != null ? discount : BigDecimal.ZERO;
        BigDecimal taxable = safeSubtotal.subtract(safeDiscount).max(BigDecimal.ZERO);

        BigDecimal rate = resolveCategoryRate(productCategory);

        BigDecimal totalTax = taxable.multiply(rate).setScale(2, RoundingMode.HALF_UP);

        TaxBreakdown breakdown = new TaxBreakdown();
        breakdown.setTaxableAmount(taxable);
        breakdown.setTotalTax(totalTax);
        breakdown.setEffectiveRate(rate);
        breakdown.setInterState(isInterState);
        breakdown.setJurisdiction("IN");

        if (isInterState) {
            breakdown.setIgstAmount(totalTax);
            breakdown.setCgstAmount(BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP));
            breakdown.setSgstAmount(BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP));
        } else {
            BigDecimal halfTax = totalTax.divide(TWO, 2, RoundingMode.HALF_UP);
            BigDecimal otherHalf = totalTax.subtract(halfTax); // avoid penny drop
            breakdown.setCgstAmount(halfTax);
            breakdown.setSgstAmount(otherHalf);
            breakdown.setIgstAmount(BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP));
        }

        breakdown.setLineBreakdowns(new ArrayList<>());
        return breakdown;
    }

    public BigDecimal calculateLineItemTax(BigDecimal unitPrice, int quantity, BigDecimal discount, String productCategory) {
        BigDecimal lineSubtotal = unitPrice.multiply(BigDecimal.valueOf(quantity));
        BigDecimal taxable = lineSubtotal.subtract(discount != null ? discount : BigDecimal.ZERO).max(BigDecimal.ZERO);
        BigDecimal rate = resolveCategoryRate(productCategory);
        return taxable.multiply(rate).setScale(2, RoundingMode.HALF_UP);
    }

    private BigDecimal resolveCategoryRate(String category) {
        if (category == null) return DEFAULT_GST_RATE;
        switch (category.toLowerCase()) {
            case "textiles":
            case "handloom":
            case "pottery-clay":
                return new BigDecimal("0.05"); // 5%
            case "ayurvedic-wellness":
            case "natural-foods":
                return new BigDecimal("0.05"); // 5%
            case "home-decor":
            case "brass":
                return new BigDecimal("0.12"); // 12%
            default:
                return DEFAULT_GST_RATE;
        }
    }
}
