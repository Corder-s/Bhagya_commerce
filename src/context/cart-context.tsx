"use client";

import * as React from "react";

import { toast } from "@/lib/toast";
import type { ProductSummary } from "@/types/catalogue";

export interface CartItem {
  id: string;
  slug: string;
  name: string;
  brandName: string;
  priceInr: number;
  mrpInr: number | null;
  imageSrc: string;
  imageAlt: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  addToCart: (product: ProductSummary, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = React.createContext<CartContextType | null>(null);

const STORAGE_KEY = "bhagya_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([]);
  const [initialized, setInitialized] = React.useState(false);

  // Load cart from localStorage on mount
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch {
      // Ignore storage errors
    } finally {
      setInitialized(true);
    }
  }, []);

  // Save cart to localStorage on changes
  React.useEffect(() => {
    if (!initialized) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore storage errors
    }
  }, [items, initialized]);

  const addToCart = React.useCallback((product: ProductSummary, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      const newItem: CartItem = {
        id: product.id,
        slug: product.slug,
        name: product.name,
        brandName: product.brand.name,
        priceInr: product.priceInr,
        mrpInr: product.mrpInr,
        imageSrc: product.image?.src || "/images/categories/organic-food.jpg",
        imageAlt: product.image?.alt || product.name,
        quantity,
      };
      return [...prev, newItem];
    });

    toast.success("Added to cart", `${product.name} has been added to your shopping bag.`);
  }, []);

  const removeFromCart = React.useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const updateQuantity = React.useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.id !== productId));
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity } : item)),
    );
  }, []);

  const clearCart = React.useCallback(() => {
    setItems([]);
  }, []);

  const cartCount = React.useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );

  const cartSubtotal = React.useMemo(
    () => items.reduce((total, item) => total + item.priceInr * item.quantity, 0),
    [items],
  );

  const value = React.useMemo(
    () => ({
      items,
      cartCount,
      cartSubtotal,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    }),
    [items, cartCount, cartSubtotal, addToCart, removeFromCart, updateQuantity, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = React.useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
