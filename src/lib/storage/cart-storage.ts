import type { CartItem } from "@/features/cart/cart-types";

const CART_STORAGE_KEY = "bhagya_commerce_cart_v2";

export const cartStorage = {
  getCart(): CartItem[] {
    if (typeof window === "undefined") return [];
    try {
      const stored = window.localStorage.getItem(CART_STORAGE_KEY);
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(
        (item): item is CartItem =>
          typeof item === "object" &&
          item !== null &&
          typeof item.id === "string" &&
          typeof item.productId === "string" &&
          typeof item.quantity === "number" &&
          item.quantity > 0,
      );
    } catch {
      return [];
    }
  },

  saveCart(items: CartItem[]): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage quota exceeded or disabled in private browsing
    }
  },

  clearCart(): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(CART_STORAGE_KEY);
    } catch {
      // Storage errors ignored
    }
  },
};
