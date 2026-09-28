package com.bhagya.commerce.billing;

import com.bhagya.commerce.invoice.domain.CreditNote;
import com.bhagya.commerce.invoice.domain.Invoice;
import com.bhagya.commerce.invoice.service.InvoiceService;
import com.bhagya.commerce.tax.dto.TaxBreakdown;
import com.bhagya.commerce.tax.service.TaxService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;

import java.math.BigDecimal;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;

class TaxAndInvoiceServiceTest {

    private TaxService taxService;
    private InvoiceService invoiceService;
    private NamedParameterJdbcTemplate jdbcTemplate;

    @BeforeEach
    void setUp() {
        taxService = new TaxService();
        jdbcTemplate = Mockito.mock(NamedParameterJdbcTemplate.class);
        invoiceService = new InvoiceService(jdbcTemplate, taxService);
    }

    @Test
    void testIntraStateTaxCalculation() {
        BigDecimal subtotal = new BigDecimal("1000.00");
        BigDecimal discount = new BigDecimal("100.00");
        boolean isInterState = false;

        TaxBreakdown breakdown = taxService.calculateOrderTax(subtotal, discount, isInterState, "textiles");

        assertNotNull(breakdown);
        assertEquals(new BigDecimal("900.00"), breakdown.getTaxableAmount());
        assertEquals(new BigDecimal("45.00"), breakdown.getTotalTax()); // 5% of 900
        assertEquals(new BigDecimal("22.50"), breakdown.getCgstAmount()); // 2.5%
        assertEquals(new BigDecimal("22.50"), breakdown.getSgstAmount()); // 2.5%
        assertEquals(new BigDecimal("0.00"), breakdown.getIgstAmount());
    }

    @Test
    void testInterStateTaxCalculation() {
        BigDecimal subtotal = new BigDecimal("2000.00");
        BigDecimal discount = BigDecimal.ZERO;
        boolean isInterState = true;

        TaxBreakdown breakdown = taxService.calculateOrderTax(subtotal, discount, isInterState, "pottery-clay");

        assertNotNull(breakdown);
        assertEquals(new BigDecimal("2000.00"), breakdown.getTaxableAmount());
        assertEquals(new BigDecimal("100.00"), breakdown.getTotalTax()); // 5% of 2000
        assertEquals(new BigDecimal("100.00"), breakdown.getIgstAmount());
        assertEquals(new BigDecimal("0.00"), breakdown.getCgstAmount());
        assertEquals(new BigDecimal("0.00"), breakdown.getSgstAmount());
    }

    @Test
    void testGenerateInvoiceAndCreditNote() {
        Invoice invoice = invoiceService.generateOrderInvoice(
                "ord_test_01",
                "usr_cust_01",
                "store_01",
                new BigDecimal("1500.00"),
                BigDecimal.ZERO,
                new BigDecimal("50.00"),
                false,
                Collections.emptyList(),
                null,
                null
        );

        assertNotNull(invoice);
        assertTrue(invoice.getInvoiceNumber().startsWith("INV-"));
        assertEquals(new BigDecimal("1500.00"), invoice.getSubtotal());
        assertEquals(new BigDecimal("75.00"), invoice.getTax());
        assertEquals(new BigDecimal("1625.00"), invoice.getTotal());

        CreditNote cn = invoiceService.issueCreditNote(invoice.getId(), invoice.getOrderId(), "Damaged piece", new BigDecimal("500.00"));
        assertNotNull(cn);
        assertTrue(cn.getCreditNoteNumber().startsWith("CN-"));
        assertEquals(new BigDecimal("500.00"), cn.getAmount());
    }
}
