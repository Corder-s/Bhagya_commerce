package com.bhagya.commerce.checkout.service;

import com.bhagya.commerce.cart.dto.CartResponse;
import com.bhagya.commerce.cart.service.CartService;
import com.bhagya.commerce.checkout.dto.CheckoutSessionRequest;
import com.bhagya.commerce.checkout.dto.CheckoutSessionResponse;
import com.bhagya.commerce.checkout.dto.CheckoutValidationRequest;
import com.bhagya.commerce.checkout.dto.CheckoutValidationResponse;
import com.bhagya.commerce.common.error.ValidationException;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class CheckoutService {

    private final CartService cartService;

    public CheckoutService(CartService cartService) {
        this.cartService = cartService;
    }

    public CheckoutValidationResponse validateCheckout(String userId, CheckoutValidationRequest request) {
        CartResponse cart = cartService.getCart(userId);
        if (cart.items().isEmpty()) {
            throw new ValidationException("Your cart is empty. Please add items before checking out.");
        }

        List<String> warnings = new ArrayList<>();
        BigDecimal discount = BigDecimal.ZERO;

        if (request.couponCode() != null && !request.couponCode().isBlank()) {
            if (request.couponCode().equalsIgnoreCase("HERITAGE15")) {
                discount = cart.subtotalInr().multiply(new BigDecimal("0.15"));
            } else {
                warnings.add("Invalid coupon code entered.");
            }
        }

        BigDecimal taxable = cart.subtotalInr().subtract(discount);
        BigDecimal tax = taxable.multiply(new BigDecimal("0.05")); // 5% GST on handlooms
        BigDecimal total = taxable.add(cart.deliveryFeeInr()).add(tax);

        String eta = LocalDate.now().plusDays(4).format(DateTimeFormatter.ofPattern("d MMM yyyy"));

        return new CheckoutValidationResponse(
            true,
            cart.subtotalInr(),
            cart.deliveryFeeInr(),
            discount,
            tax,
            total,
            eta,
            warnings
        );
    }

    public CheckoutSessionResponse createCheckoutSession(String userId, CheckoutSessionRequest request) {
        CartResponse cart = cartService.getCart(userId);
        if (cart.items().isEmpty()) {
            throw new ValidationException("Cart is empty.");
        }

        String sessionId = "chk_sess_" + System.currentTimeMillis();
        String orderId = "ord_" + System.currentTimeMillis();
        String orderNumber = "BG-" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")) + "-" + (int) (100000 + Math.random() * 900000);

        return new CheckoutSessionResponse(
            sessionId,
            orderId,
            orderNumber,
            cart.estimatedTotalInr(),
            "INR",
            Instant.now().plusSeconds(1800) // 30-minute checkout session TTL
        );
    }
}
