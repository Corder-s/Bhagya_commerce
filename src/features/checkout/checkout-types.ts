import type { DeliveryMethod } from "@/data/delivery-methods";
import type { CartItem } from "@/features/cart/cart-types";

export type CheckoutStep = "contact" | "address" | "delivery" | "review" | "payment";

export interface CheckoutContact {
  email: string;
  phone: string;
}

export interface Address {
  id?: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  addressType?: "home" | "work" | "other";
  isDefault?: boolean;
}

export interface Coupon {
  code: string;
  discountPercent?: number;
  discountAmount?: number;
  minOrderAmount?: number;
  description: string;
}

export interface PriceBreakdown {
  subtotal: number;
  mrpTotal: number;
  productSavings: number;
  deliveryFee: number;
  couponDiscount: number;
  tax: number;
  total: number;
}

export interface CheckoutState {
  currentStep: CheckoutStep;
  contact: CheckoutContact;
  shippingAddress?: Address;
  savedAddresses: Address[];
  selectedAddressId?: string;
  isAddingNewAddress: boolean;
  deliveryMethod: DeliveryMethod;
  appliedCoupon: Coupon | null;
  couponCodeInput: string;
  couponError: string | null;
  isSubmitting: boolean;
  error: string | null;
  completedSteps: CheckoutStep[];
}

export type CheckoutAction =
  | { type: "INITIALIZE"; payload: Partial<CheckoutState> }
  | { type: "SET_STEP"; payload: CheckoutStep }
  | { type: "UPDATE_CONTACT"; payload: Partial<CheckoutContact> }
  | { type: "SET_SHIPPING_ADDRESS"; payload: Address }
  | { type: "SELECT_ADDRESS"; payload: string }
  | { type: "SET_ADDING_NEW_ADDRESS"; payload: boolean }
  | { type: "ADD_SAVED_ADDRESS"; payload: Address }
  | { type: "SET_SAVED_ADDRESSES"; payload: Address[] }
  | { type: "SELECT_DELIVERY_METHOD"; payload: DeliveryMethod }
  | { type: "SET_COUPON_INPUT"; payload: string }
  | { type: "APPLY_COUPON_SUCCESS"; payload: Coupon }
  | { type: "APPLY_COUPON_ERROR"; payload: string }
  | { type: "REMOVE_COUPON" }
  | { type: "SET_SUBMITTING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "COMPLETE_STEP"; payload: CheckoutStep };
