import type { DeliveryMethod } from "@/data/delivery-methods";
import type { CartItem } from "@/features/cart/cart-types";
import type { Coupon, PriceBreakdown } from "./checkout-types";

/**
 * Single source of truth for calculating order totals.
 * Used identically across Cart, Checkout, and Order Review.
 */
export function calculateOrderTotals(
  items: CartItem[],
  deliveryMethod?: DeliveryMethod | null,
  coupon?: Coupon | null,
): PriceBreakdown {
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const mrpTotal = items.reduce(
    (sum, item) => sum + (item.mrpInr ?? item.unitPrice) * item.quantity,
    0,
  );
  const productSavings = Math.max(0, mrpTotal - subtotal);

  // Delivery calculation
  let deliveryFee = 0;
  if (items.length > 0 && deliveryMethod) {
    if (deliveryMethod.freeAbove && subtotal >= deliveryMethod.freeAbove) {
      deliveryFee = 0;
    } else {
      deliveryFee = deliveryMethod.price;
    }
  }

  // Coupon discount calculation
  let couponDiscount = 0;
  if (coupon && subtotal > 0) {
    if (!coupon.minOrderAmount || subtotal >= coupon.minOrderAmount) {
      if (coupon.discountPercent) {
        couponDiscount = Math.round((subtotal * coupon.discountPercent) / 100);
      } else if (coupon.discountAmount) {
        couponDiscount = Math.min(subtotal, coupon.discountAmount);
      }
    }
  }

  // Taxes are inclusive in retail pricing
  const tax = 0;

  const total = Math.max(0, subtotal - couponDiscount + deliveryFee + tax);

  return {
    subtotal,
    mrpTotal,
    productSavings,
    deliveryFee,
    couponDiscount,
    tax,
    total,
  };
}

export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi NCR",
  "Jammu and Kashmir",
  "Ladakh",
  "Puducherry",
  "Chandigarh",
] as const;
