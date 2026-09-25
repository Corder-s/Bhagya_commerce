import type { Coupon } from "@/features/checkout/checkout-types";

export const DEMO_COUPONS: Coupon[] = [
  {
    code: "WELCOME10",
    discountPercent: 10,
    description: "10% off on your first handcrafted order",
  },
  {
    code: "BHAGYA50",
    discountAmount: 50,
    minOrderAmount: 499,
    description: "₹50 flat discount on orders above ₹499",
  },
  {
    code: "ARTISAN20",
    discountPercent: 20,
    minOrderAmount: 2499,
    description: "20% off on premium craft orders above ₹2,499",
  },
];

/**
 * Coupon Service — client abstraction layer for promo code validation.
 * Future Spring Boot target: POST /api/v1/coupons/validate
 */
export const couponService = {
  async validateCoupon(code: string, orderSubtotal: number): Promise<{ valid: boolean; coupon?: Coupon; message: string }> {
    const clean = code.trim().toUpperCase();
    const found = DEMO_COUPONS.find((c) => c.code === clean);

    if (!found) {
      return Promise.resolve({
        valid: false,
        message: `Coupon code "${code}" is invalid or expired. Try WELCOME10 or BHAGYA50.`,
      });
    }

    if (found.minOrderAmount && orderSubtotal < found.minOrderAmount) {
      return Promise.resolve({
        valid: false,
        message: `Coupon "${clean}" requires a minimum order value of ₹${found.minOrderAmount}.`,
      });
    }

    return Promise.resolve({
      valid: true,
      coupon: found,
      message: `Coupon "${clean}" applied successfully! ${found.description}`,
    });
  },
};
