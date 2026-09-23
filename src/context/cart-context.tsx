"use client";

import * as React from "react";

import {
  cartReducer,
  initialCartState,
} from "@/features/cart/cart-reducer";
import type { CartItem, CartState } from "@/features/cart/cart-types";
import { cartStorage } from "@/lib/storage/cart-storage";
import { toast } from "@/lib/toast";
import type { ProductSummary } from "@/types/catalogue";

export interface CartContextValue extends CartState {
  addItem: (
    product: ProductSummary,
    variant?: { id: string; name: string; priceInr?: number; mrpInr?: number | null },
    quantity?: number,
  ) => void;
  // Legacy alias for compatibility with existing components
  addToCart: (product: ProductSummary, quantity?: number) => void;
  removeItem: (id: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string, variantId?: string) => number;
  isInCart: (productId: string, variantId?: string) => boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  toggleCartDrawer: () => void;
  cartCount: number;
  cartSubtotal: number;
}

const CartContext = React.createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(cartReducer, initialCartState);
  const [initialized, setInitialized] = React.useState(false);

  // Initialize from storage on mount
  React.useEffect(() => {
    const savedItems = cartStorage.getCart();
    if (savedItems.length > 0) {
      dispatch({ type: "INITIALIZE", payload: savedItems });
    }
    setInitialized(true);
  }, []);

  // Save to storage on updates
  React.useEffect(() => {
    if (!initialized) return;
    cartStorage.saveCart(state.items);
  }, [state.items, initialized]);

  const addItem = React.useCallback(
    (
      product: ProductSummary,
      variant?: { id: string; name: string; priceInr?: number; mrpInr?: number | null },
      quantity = 1,
    ) => {
      dispatch({
        type: "ADD_ITEM",
        payload: { product, variant, quantity },
      });

      const variantLabel = variant ? ` (${variant.name})` : "";
      toast.success(
        "Added to Bag",
        `${product.name}${variantLabel} added to your shopping bag.`,
      );
    },
    [],
  );

  const addToCart = React.useCallback(
    (product: ProductSummary, quantity = 1) => {
      addItem(product, undefined, quantity);
    },
    [addItem],
  );

  const removeItem = React.useCallback((id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { id } });
    toast.info("Item Removed", "Product removed from your shopping bag.");
  }, []);

  const removeFromCart = React.useCallback(
    (productId: string) => {
      const match = state.items.find(
        (item) => item.productId === productId || item.id === productId,
      );
      if (match) {
        removeItem(match.id);
      }
    },
    [state.items, removeItem],
  );

  const updateQuantity = React.useCallback((id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  }, []);

  const clearCart = React.useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
    toast.info("Bag Cleared", "All items have been removed.");
  }, []);

  const getItemQuantity = React.useCallback(
    (productId: string, variantId?: string) => {
      const targetId = `${productId}-${variantId || "default"}`;
      const found = state.items.find(
        (item) => item.id === targetId || (item.productId === productId && !variantId),
      );
      return found?.quantity ?? 0;
    },
    [state.items],
  );

  const isInCart = React.useCallback(
    (productId: string, variantId?: string) => {
      return getItemQuantity(productId, variantId) > 0;
    },
    [getItemQuantity],
  );

  const openCartDrawer = React.useCallback(() => {
    dispatch({ type: "OPEN_DRAWER" });
  }, []);

  const closeCartDrawer = React.useCallback(() => {
    dispatch({ type: "CLOSE_DRAWER" });
  }, []);

  const toggleCartDrawer = React.useCallback(() => {
    dispatch({ type: "TOGGLE_DRAWER" });
  }, []);

  const value = React.useMemo<CartContextValue>(
    () => ({
      ...state,
      cartCount: state.itemCount,
      cartSubtotal: state.subtotal,
      addItem,
      addToCart,
      removeItem,
      removeFromCart,
      updateQuantity,
      clearCart,
      getItemQuantity,
      isInCart,
      openCartDrawer,
      closeCartDrawer,
      toggleCartDrawer,
    }),
    [
      state,
      addItem,
      addToCart,
      removeItem,
      removeFromCart,
      updateQuantity,
      clearCart,
      getItemQuantity,
      isInCart,
      openCartDrawer,
      closeCartDrawer,
      toggleCartDrawer,
    ],
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
