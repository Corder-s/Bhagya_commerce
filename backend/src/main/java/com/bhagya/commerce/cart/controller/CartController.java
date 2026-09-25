package com.bhagya.commerce.cart.controller;

import com.bhagya.commerce.cart.dto.CartItemRequest;
import com.bhagya.commerce.cart.dto.CartResponse;
import com.bhagya.commerce.cart.service.CartService;
import com.bhagya.commerce.common.api.ApiResponse;
import com.bhagya.commerce.common.security.CurrentUser;
import com.bhagya.commerce.common.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/cart")
@Tag(name = "Cart", description = "Customer Cart Management & Authoritative Pricing")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    @Operation(summary = "Get current authenticated customer cart")
    public ResponseEntity<ApiResponse<CartResponse>> getCart(@CurrentUser UserPrincipal principal) {
        CartResponse cart = cartService.getCart(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(cart));
    }

    @PostMapping("/items")
    @Operation(summary = "Add item to cart with authoritative server pricing")
    public ResponseEntity<ApiResponse<CartResponse>> addItem(
        @CurrentUser UserPrincipal principal,
        @Valid @RequestBody CartItemRequest request
    ) {
        CartResponse cart = cartService.addItem(principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok(cart, "Item added to bag"));
    }

    @PatchMapping("/items/{itemId}")
    @Operation(summary = "Update item quantity in cart")
    public ResponseEntity<ApiResponse<CartResponse>> updateQuantity(
        @PathVariable String itemId,
        @RequestParam int quantity,
        @CurrentUser UserPrincipal principal
    ) {
        CartResponse cart = cartService.updateItemQuantity(principal.getId(), itemId, quantity);
        return ResponseEntity.ok(ApiResponse.ok(cart));
    }

    @DeleteMapping("/items/{itemId}")
    @Operation(summary = "Remove item from cart")
    public ResponseEntity<ApiResponse<CartResponse>> removeItem(
        @PathVariable String itemId,
        @CurrentUser UserPrincipal principal
    ) {
        CartResponse cart = cartService.removeItem(principal.getId(), itemId);
        return ResponseEntity.ok(ApiResponse.ok(cart));
    }

    @DeleteMapping
    @Operation(summary = "Clear all items from cart")
    public ResponseEntity<ApiResponse<Void>> clearCart(@CurrentUser UserPrincipal principal) {
        cartService.clearCart(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(null, "Cart cleared"));
    }
}
