import type { ProductSummary } from "@/types/catalogue";

export interface CartItemVariant {
  id: string;
  name: string;
  options?: Record<string, string>;
}

export interface CartItem {
  id: string; // Unique key: `${productId}-${variantId || 'default'}`
  productId: string;
  variantId?: string;
  variantName?: string;
  slug: string;
  name: string;
  brandName: string;
  unitPrice: number;
  mrpInr?: number | null;
  imageSrc: string;
  imageAlt: string;
  quantity: number;
  maxQuantity?: number;
}

export interface CartState {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  freeShippingThreshold: number;
  amountNeededForFreeShipping: number;
  isFreeShippingEligible: boolean;
  estimatedTax: number;
  estimatedDeliveryFee: number;
  total: number;
  isDrawerOpen: boolean;
}

export type CartAction =
  | { type: "INITIALIZE"; payload: CartItem[] }
  | {
      type: "ADD_ITEM";
      payload: {
        product: ProductSummary;
        variant?: { id: string; name: string; priceInr?: number; mrpInr?: number | null };
        quantity?: number;
      };
    }
  | { type: "REMOVE_ITEM"; payload: { id: string } }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "OPEN_DRAWER" }
  | { type: "CLOSE_DRAWER" }
  | { type: "TOGGLE_DRAWER" };
