import type { CheckoutState } from "@/features/checkout/checkout-types";

export interface CheckoutValidationResponse {
  valid: boolean;
  errors: string[];
}

/**
 * Checkout Service — abstraction layer for checkout validation and order draft creation.
 * Future Spring Boot target: POST /api/v1/checkout/session
 */
export const checkoutService = {
  async validateCheckout(state: CheckoutState): Promise<CheckoutValidationResponse> {
    const errors: string[] = [];

    if (!state.contact.email || !state.contact.phone) {
      errors.push("Contact email and phone number are required.");
    }

    if (!state.shippingAddress) {
      errors.push("A delivery address must be provided.");
    }

    if (!state.deliveryMethod) {
      errors.push("Please select a delivery method.");
    }

    return Promise.resolve({
      valid: errors.length === 0,
      errors,
    });
  },
};
