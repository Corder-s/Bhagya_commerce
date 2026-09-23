import type { CartItem } from "@/features/cart/cart-types";
import { cartStorage } from "@/lib/storage/cart-storage";

/**
 * Cart Service — client abstraction layer for cart mutations and retrieval.
 * Future REST endpoint target: POST/GET /api/v1/cart
 */
export const cartService = {
  async getCart(): Promise<CartItem[]> {
    return Promise.resolve(cartStorage.getCart());
  },

  async syncCart(items: CartItem[]): Promise<CartItem[]> {
    cartStorage.saveCart(items);
    return Promise.resolve(items);
  },

  async clearCart(): Promise<void> {
    cartStorage.clearCart();
    return Promise.resolve();
  },
};
