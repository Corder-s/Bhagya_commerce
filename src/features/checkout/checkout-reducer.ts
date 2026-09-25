import { defaultDeliveryMethod } from "@/data/delivery-methods";
import { DEFAULT_MOCK_ADDRESSES } from "@/lib/storage/checkout-storage";
import type { CheckoutAction, CheckoutState } from "./checkout-types";

export const initialCheckoutState: CheckoutState = {
  currentStep: "contact",
  contact: {
    email: "aarav.sharma@example.com",
    phone: "9876543210",
  },
  savedAddresses: DEFAULT_MOCK_ADDRESSES,
  selectedAddressId: DEFAULT_MOCK_ADDRESSES[0]?.id,
  shippingAddress: DEFAULT_MOCK_ADDRESSES[0],
  isAddingNewAddress: false,
  deliveryMethod: defaultDeliveryMethod,
  appliedCoupon: null,
  couponCodeInput: "",
  couponError: null,
  isSubmitting: false,
  error: null,
  completedSteps: [],
};

export function checkoutReducer(state: CheckoutState, action: CheckoutAction): CheckoutState {
  switch (action.type) {
    case "INITIALIZE":
      return {
        ...state,
        ...action.payload,
      };

    case "SET_STEP":
      return {
        ...state,
        currentStep: action.payload,
        error: null,
      };

    case "COMPLETE_STEP": {
      const completed = Array.from(new Set([...state.completedSteps, action.payload]));
      return {
        ...state,
        completedSteps: completed,
      };
    }

    case "UPDATE_CONTACT":
      return {
        ...state,
        contact: {
          ...state.contact,
          ...action.payload,
        },
      };

    case "SELECT_ADDRESS": {
      const found = state.savedAddresses.find((a) => a.id === action.payload);
      return {
        ...state,
        selectedAddressId: action.payload,
        shippingAddress: found || state.shippingAddress,
        isAddingNewAddress: false,
      };
    }

    case "SET_SHIPPING_ADDRESS":
      return {
        ...state,
        shippingAddress: action.payload,
      };

    case "SET_ADDING_NEW_ADDRESS":
      return {
        ...state,
        isAddingNewAddress: action.payload,
      };

    case "ADD_SAVED_ADDRESS": {
      const updated = [action.payload, ...state.savedAddresses];
      return {
        ...state,
        savedAddresses: updated,
        selectedAddressId: action.payload.id,
        shippingAddress: action.payload,
        isAddingNewAddress: false,
      };
    }

    case "SET_SAVED_ADDRESSES":
      return {
        ...state,
        savedAddresses: action.payload,
      };

    case "SELECT_DELIVERY_METHOD":
      return {
        ...state,
        deliveryMethod: action.payload,
      };

    case "SET_COUPON_INPUT":
      return {
        ...state,
        couponCodeInput: action.payload,
        couponError: null,
      };

    case "APPLY_COUPON_SUCCESS":
      return {
        ...state,
        appliedCoupon: action.payload,
        couponError: null,
        couponCodeInput: "",
      };

    case "APPLY_COUPON_ERROR":
      return {
        ...state,
        couponError: action.payload,
      };

    case "REMOVE_COUPON":
      return {
        ...state,
        appliedCoupon: null,
        couponError: null,
      };

    case "SET_SUBMITTING":
      return {
        ...state,
        isSubmitting: action.payload,
      };

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
}
