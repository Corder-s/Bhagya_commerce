"use client";

import * as React from "react";

import { toast } from "@/lib/toast";
import type { ProductSummary } from "@/types/catalogue";

interface WishlistContextType {
  wishlistIds: string[];
  wishlistCount: number;
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (product: ProductSummary) => void;
}

const WishlistContext = React.createContext<WishlistContextType | null>(null);

const STORAGE_KEY = "bhagya_wishlist_v1";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistIds, setWishlistIds] = React.useState<string[]>([]);
  const [initialized, setInitialized] = React.useState(false);

  // Load from localStorage on mount
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setWishlistIds(JSON.parse(stored));
      }
    } catch {
      // Ignore storage errors
    } finally {
      setInitialized(true);
    }
  }, []);

  // Save to localStorage on changes
  React.useEffect(() => {
    if (!initialized) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlistIds));
    } catch {
      // Ignore storage errors
    }
  }, [wishlistIds, initialized]);

  const isWishlisted = React.useCallback(
    (productId: string) => wishlistIds.includes(productId),
    [wishlistIds],
  );

  const toggleWishlist = React.useCallback((product: ProductSummary) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(product.id);
      if (exists) {
        toast.info("Removed from wishlist", `${product.name} removed from saved items.`);
        return prev.filter((id) => id !== product.id);
      } else {
        toast.success("Saved to wishlist", `${product.name} saved for later.`);
        return [...prev, product.id];
      }
    });
  }, []);

  const value = React.useMemo(
    () => ({
      wishlistIds,
      wishlistCount: wishlistIds.length,
      isWishlisted,
      toggleWishlist,
    }),
    [wishlistIds, isWishlisted, toggleWishlist],
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
