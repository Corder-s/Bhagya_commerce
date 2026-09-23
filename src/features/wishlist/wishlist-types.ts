import type { ProductSummary } from "@/types/catalogue";

export interface WishlistState {
  wishlistIds: string[];
  wishlistCount: number;
}

export type WishlistAction =
  | { type: "INITIALIZE"; payload: string[] }
  | { type: "ADD"; payload: string }
  | { type: "REMOVE"; payload: string }
  | { type: "TOGGLE"; payload: string }
  | { type: "CLEAR" };
