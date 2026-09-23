"use client";

import * as React from "react";

import { products as allProducts } from "@/data/products";
import { wishlistStorage } from "@/lib/storage/wishlist-storage";
import { toast } from "@/lib/toast";
import type { ProductDetail, ProductSummary } from "@/types/catalogue";

export interface WishlistContextValue {
  wishlistIds: string[];
  wishlistCount: number;
  wishlistProducts: ProductDetail[];
  isWishlisted: (productId: string) => boolean;
  addToWishlist: (product: ProductSummary) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (product: ProductSummary) => void;
  clearWishlist: () => void;
}

const WishlistContext = React.createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistIds, setWishlistIds] = React.useState<string[]>([]);
  const [initialized, setInitialized] = React.useState(false);

  // Hydrate from storage on mount
  React.useEffect(() => {
    const stored = wishlistStorage.getWishlist();
    if (stored.length > 0) {
      setWishlistIds(stored);
    }
    setInitialized(true);
  }, []);

  // Save on changes
  React.useEffect(() => {
    if (!initialized) return;
    wishlistStorage.saveWishlist(wishlistIds);
  }, [wishlistIds, initialized]);

  const isWishlisted = React.useCallback(
    (productId: string) => wishlistIds.includes(productId),
    [wishlistIds],
  );

  const addToWishlist = React.useCallback(
    (product: ProductSummary) => {
      setWishlistIds((prev) => {
        if (prev.includes(product.id)) return prev;
        toast.success("Saved to Wishlist", `${product.name} saved for later.`);
        return [...prev, product.id];
      });
    },
    [],
  );

  const removeFromWishlist = React.useCallback(
    (productId: string) => {
      setWishlistIds((prev) => {
        const product = allProducts.find((p) => p.id === productId);
        const title = product ? product.name : "Product";
        toast.info("Removed from Wishlist", `${title} removed from saved items.`);
        return prev.filter((id) => id !== productId);
      });
    },
    [],
  );

  const toggleWishlist = React.useCallback(
    (product: ProductSummary) => {
      setWishlistIds((prev) => {
        const exists = prev.includes(product.id);
        if (exists) {
          toast.info("Removed from Wishlist", `${product.name} removed from saved items.`);
          return prev.filter((id) => id !== product.id);
        } else {
          toast.success("Saved to Wishlist", `${product.name} saved for later.`);
          return [...prev, product.id];
        }
      });
    },
    [],
  );

  const clearWishlist = React.useCallback(() => {
    setWishlistIds([]);
    toast.info("Wishlist Cleared", "All saved items removed.");
  }, []);

  const wishlistProducts = React.useMemo(() => {
    const idSet = new Set(wishlistIds);
    return allProducts.filter((p) => idSet.has(p.id));
  }, [wishlistIds]);

  const value = React.useMemo<WishlistContextValue>(
    () => ({
      wishlistIds,
      wishlistCount: wishlistIds.length,
      wishlistProducts,
      isWishlisted,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      clearWishlist,
    }),
    [
      wishlistIds,
      wishlistProducts,
      isWishlisted,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      clearWishlist,
    ],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = React.useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
