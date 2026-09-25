package com.bhagya.commerce.cart.service;

import com.bhagya.commerce.cart.dto.CartItemRequest;
import com.bhagya.commerce.cart.dto.CartItemResponse;
import com.bhagya.commerce.cart.dto.CartResponse;
import com.bhagya.commerce.catalog.product.domain.Product;
import com.bhagya.commerce.catalog.product.repository.ProductRepository;
import com.bhagya.commerce.common.error.ResourceNotFoundException;
import com.bhagya.commerce.common.error.ValidationException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Service;

@Service
public class CartService {

    private final ProductRepository productRepository;
    private final Map<String, List<CartItemResponse>> cartStorage = new ConcurrentHashMap<>();

    public CartService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public CartResponse getCart(String userId) {
        List<CartItemResponse> items = cartStorage.computeIfAbsent(userId, k -> new ArrayList<>());
        return calculateCart(userId, items);
    }

    public CartResponse addItem(String userId, CartItemRequest request) {
        Product product = productRepository.findById(request.productId())
            .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + request.productId()));

        if (product.getStockQuantity() < request.quantity()) {
            throw new ValidationException("Only " + product.getStockQuantity() + " units available in stock.");
        }

        List<CartItemResponse> items = cartStorage.computeIfAbsent(userId, k -> new ArrayList<>());

        // Check if item already in cart
        int existingIndex = -1;
        for (int i = 0; i < items.size(); i++) {
            if (items.get(i).productId().equals(request.productId())) {
                existingIndex = i;
                break;
            }
        }

        if (existingIndex >= 0) {
            CartItemResponse existing = items.get(existingIndex);
            int newQty = existing.quantity() + request.quantity();
            BigDecimal newTotal = product.getPriceInr().multiply(BigDecimal.valueOf(newQty));
            items.set(existingIndex, new CartItemResponse(
                existing.itemId(), product.getId(), product.getSlug(), product.getName(),
                product.getImageUrl(), product.getPriceInr(), newQty, newTotal
            ));
        } else {
            String itemId = "item_" + System.currentTimeMillis();
            BigDecimal total = product.getPriceInr().multiply(BigDecimal.valueOf(request.quantity()));
            items.add(new CartItemResponse(
                itemId, product.getId(), product.getSlug(), product.getName(),
                product.getImageUrl(), product.getPriceInr(), request.quantity(), total
            ));
        }

        return calculateCart(userId, items);
    }

    public CartResponse updateItemQuantity(String userId, String itemId, int quantity) {
        List<CartItemResponse> items = cartStorage.computeIfAbsent(userId, k -> new ArrayList<>());

        if (quantity <= 0) {
            items.removeIf(i -> i.itemId().equals(itemId));
        } else {
            for (int i = 0; i < items.size(); i++) {
                CartItemResponse current = items.get(i);
                if (current.itemId().equals(itemId)) {
                    BigDecimal total = current.unitPriceInr().multiply(BigDecimal.valueOf(quantity));
                    items.set(i, new CartItemResponse(
                        current.itemId(), current.productId(), current.slug(), current.name(),
                        current.imageUrl(), current.unitPriceInr(), quantity, total
                    ));
                    break;
                }
            }
        }

        return calculateCart(userId, items);
    }

    public CartResponse removeItem(String userId, String itemId) {
        List<CartItemResponse> items = cartStorage.computeIfAbsent(userId, k -> new ArrayList<>());
        items.removeIf(i -> i.itemId().equals(itemId));
        return calculateCart(userId, items);
    }

    public void clearCart(String userId) {
        cartStorage.remove(userId);
    }

    private CartResponse calculateCart(String userId, List<CartItemResponse> items) {
        BigDecimal subtotal = BigDecimal.ZERO;
        int totalQty = 0;

        for (CartItemResponse item : items) {
            subtotal = subtotal.add(item.totalInr());
            totalQty += item.quantity();
        }

        // Free delivery on orders over ₹1,499
        BigDecimal delivery = subtotal.compareTo(new BigDecimal("1499")) >= 0 || subtotal.compareTo(BigDecimal.ZERO) == 0
            ? BigDecimal.ZERO
            : new BigDecimal("99.00");

        BigDecimal total = subtotal.add(delivery);
        return new CartResponse("cart_" + userId, items, totalQty, subtotal, delivery, total);
    }
}
