package com.bhagya.commerce.invoice.controller;

import com.bhagya.commerce.invoice.domain.CreditNote;
import com.bhagya.commerce.invoice.domain.Invoice;
import com.bhagya.commerce.invoice.service.InvoiceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class InvoiceController {

    private final InvoiceService invoiceService;

    public InvoiceController(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }

    @GetMapping("/orders/{orderId}/invoice")
    public ResponseEntity<Invoice> getOrderInvoice(
            @PathVariable("orderId") String orderId,
            @RequestHeader(value = "X-User-Id", required = false) String userId
    ) {
        Invoice invoice = invoiceService.getInvoiceByOrderId(orderId, userId);
        return ResponseEntity.ok(invoice);
    }

    @GetMapping("/invoices/{invoiceId}/download")
    public ResponseEntity<Map<String, Object>> getInvoiceDownloadUrl(
            @PathVariable("invoiceId") String invoiceId,
            @RequestHeader(value = "X-User-Id", required = false) String userId
    ) {
        Map<String, Object> resp = new HashMap<>();
        resp.put("invoiceId", invoiceId);
        resp.put("mimeType", "application/pdf");
        resp.put("storageProvider", "R2");
        resp.put("downloadUrl", "https://cdn.bhagyacommerce.com/invoices/" + invoiceId + ".pdf?token=sec_valid_3600");
        resp.put("expiresInSeconds", 3600);
        return ResponseEntity.ok(resp);
    }
}
