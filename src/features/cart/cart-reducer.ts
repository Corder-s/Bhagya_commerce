import type { CartAction, CartItem, CartState } from "./cart-types";

export const FREE_SHIPPING_THRESHOLD = 1499;
export const STANDARD_DELIVERY_FEE = 99;

export function computeCartMetrics(items: CartItem[]): {
  itemCount: number;
  subtotal: number;
  freeShippingThreshold: number;
  amountNeededForFreeShipping: number;
  isFreeShippingEligible: boolean;
  estimatedDeliveryFee: number;
  estimatedTax: number;
  total: number;
} {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const isFreeShippingEligible = subtotal >= FREE_SHIPPING_THRESHOLD || items.length === 0;
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const estimatedDeliveryFee = items.length === 0 || isFreeShippingEligible ? 0 : STANDARD_DELIVERY_FEE;
  const estimatedTax = 0; // Inclusive of GST in displayed prices
  const total = subtotal + estimatedDeliveryFee + estimatedTax;

  return {
    itemCount,
    subtotal,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    amountNeededForFreeShipping,
    isFreeShippingEligible,
    estimatedDeliveryFee,
    estimatedTax,
    total,
  };
}

export const initialCartState: CartState = {
  items: [],
  ...computeCartMetrics([]),
  isDrawerOpen: false,
};

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "INITIALIZE": {
      const metrics = computeCartMetrics(action.payload);
      return {
        ...state,
        items: action.payload,
        ...metrics,
      };
    }

    case "ADD_ITEM": {
      const { product, variant, quantity = 1 } = action.payload;
      const variantId = variant?.id;
      const itemId = `${product.id}-${variantId || "default"}`;
      const unitPrice = variant?.priceInr ?? product.priceInr;
      const mrpInr = variant?.mrpInr !== undefined ? variant.mrpInr : product.mrpInr;

      const existingIndex = state.items.findIndex((item) => item.id === itemId);

      let nextItems: CartItem[];
      if (existingIndex > -1) {
        nextItems = state.items.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      } else {
        const newItem: CartItem = {
          id: itemId,
          productId: product.id,
          variantId,
          variantName: variant?.name,
          slug: product.slug,
          name: product.name,
          brandName: product.brand.name,
          unitPrice,
          mrpInr,
          imageSrc: product.image?.src || "/images/categories/organic-food.jpg",
          imageAlt: product.image?.alt || product.name,
          quantity,
        };
        nextItems = [...state.items, newItem];
      }

      const metrics = computeCartMetrics(nextItems);
      return {
        ...state,
        items: nextItems,
        ...metrics,
        isDrawerOpen: true, // Auto-open drawer for instant feedback
      };
    }

    case "REMOVE_ITEM": {
      const nextItems = state.items.filter((item) => item.id !== action.payload.id);
      const metrics = computeCartMetrics(nextItems);
      return {
        ...state,
        items: nextItems,
        ...metrics,
      };
    }

    case "UPDATE_QUANTITY": {
      const { id, quantity } = action.payload;
      let nextItems: CartItem[];
      if (quantity <= 0) {
        nextItems = state.items.filter((item) => item.id !== id);
      } else {
        nextItems = state.items.map((item) =>
          item.id === id ? { ...item, quantity } : item,
        );
      }
      const metrics = computeCartMetrics(nextItems);
      return {
        ...state,
        items: nextItems,
        ...metrics,
      };
    }

    case "CLEAR_CART": {
      const metrics = computeCartMetrics([]);
      return {
        ...state,
        items: [],
        ...metrics,
      };
    }

    case "OPEN_DRAWER":
      return { ...state, isDrawerOpen: true };

    case "CLOSE_DRAWER":
      return { ...state, isDrawerOpen: false };

    case "TOGGLE_DRAWER":
      return { ...state, isDrawerOpen: !state.isDrawerOpen };

    default:
      return state;
  }
}
