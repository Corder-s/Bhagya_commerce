const WISHLIST_STORAGE_KEY = "bhagya_commerce_wishlist_v2";

export const wishlistStorage = {
  getWishlist(): string[] {
    if (typeof window === "undefined") return [];
    try {
      const stored = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter((id): id is string => typeof id === "string" && id.trim().length > 0);
    } catch {
      return [];
    }
  },

  saveWishlist(ids: string[]): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(ids));
    } catch {
      // Storage errors ignored
    }
  },

  clearWishlist(): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(WISHLIST_STORAGE_KEY);
    } catch {
      // Storage errors ignored
    }
  },
};
