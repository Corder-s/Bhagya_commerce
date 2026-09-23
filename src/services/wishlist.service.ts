import { wishlistStorage } from "@/lib/storage/wishlist-storage";

/**
 * Wishlist Service — client abstraction layer for wishlist synchronization.
 * Future REST endpoint target: GET/POST /api/v1/wishlist
 */
export const wishlistService = {
  async getWishlist(): Promise<string[]> {
    return Promise.resolve(wishlistStorage.getWishlist());
  },

  async syncWishlist(ids: string[]): Promise<string[]> {
    wishlistStorage.saveWishlist(ids);
    return Promise.resolve(ids);
  },

  async clearWishlist(): Promise<void> {
    wishlistStorage.clearWishlist();
    return Promise.resolve();
  },
};
