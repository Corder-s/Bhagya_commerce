"use client";

import * as React from "react";

import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/context/cart-context";
import { defaultDeliveryMethod, deliveryMethods, type DeliveryMethod } from "@/data/delivery-methods";
import { addressService } from "@/services/address.service";
import { couponService } from "@/services/coupon.service";
import { paymentService } from "@/services/payment.service";
import { checkoutStorage } from "@/lib/storage/checkout-storage";
import { toast } from "@/lib/toast";

import { checkoutReducer, initialCheckoutState } from "./checkout-reducer";
import { validateAddress, validateContact } from "./checkout-schema";
import type {
  Address,
  CheckoutContact,
  CheckoutState,
  CheckoutStep,
  Coupon,
  PriceBreakdown,
} from "./checkout-types";
import { calculateOrderTotals } from "./checkout-utils";

export interface CheckoutContextValue extends CheckoutState {
  orderTotals: PriceBreakdown;
  setStep: (step: CheckoutStep) => void;
  goToNextStep: () => boolean;
  goToPreviousStep: () => void;
  updateContact: (contact: Partial<CheckoutContact>) => void;
  selectSavedAddress: (addressId: string) => void;
  setShippingAddress: (address: Address) => void;
  addNewSavedAddress: (address: Address) => Promise<void>;
  setIsAddingNewAddress: (isAdding: boolean) => void;
  selectDeliveryMethod: (method: DeliveryMethod) => void;
  setCouponInput: (code: string) => void;
  applyCoupon: () => Promise<boolean>;
  removeCoupon: () => void;
  submitPayment: () => Promise<{ success: boolean; orderId?: string }>;
}

const CheckoutContext = React.createContext<CheckoutContextValue | null>(null);

const STEP_ORDER: CheckoutStep[] = ["contact", "address", "delivery", "review", "payment"];

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const { items, subtotal } = useCart();
  const { user } = useAuth();
  const [state, dispatch] = React.useReducer(checkoutReducer, initialCheckoutState);
  const [initialized, setInitialized] = React.useState(false);

  // Load draft & saved addresses from storage on mount and prefill user details if logged in
  React.useEffect(() => {
    const draft = checkoutStorage.getDraft();
    const saved = checkoutStorage.getSavedAddresses();

    if (saved.length > 0) {
      dispatch({ type: "SET_SAVED_ADDRESSES", payload: saved });
    }

    const initialContact: CheckoutContact = draft?.contact || {
      email: user?.email || "",
      phone: user?.phone || "",
    };

    if (draft) {
      dispatch({
        type: "INITIALIZE",
        payload: {
          contact: initialContact,
          shippingAddress: draft.shippingAddress || (saved[0] ?? initialCheckoutState.shippingAddress),
          selectedAddressId: draft.selectedAddressId || saved[0]?.id,
          deliveryMethod:
            deliveryMethods.find((m) => m.id === draft.deliveryMethodId) ||
            defaultDeliveryMethod,
        },
      });
    } else {
      dispatch({
        type: "INITIALIZE",
        payload: {
          contact: initialContact,
          shippingAddress: saved[0] ?? initialCheckoutState.shippingAddress,
          selectedAddressId: saved[0]?.id,
        },
      });
    }

    setInitialized(true);
  }, [user]);

  // Persist draft on state changes
  React.useEffect(() => {
    if (!initialized) return;
    checkoutStorage.saveDraft({
      contact: state.contact,
      shippingAddress: state.shippingAddress,
      selectedAddressId: state.selectedAddressId,
      deliveryMethodId: state.deliveryMethod.id,
      currentStep: state.currentStep,
    });
  }, [
    state.contact,
    state.shippingAddress,
    state.selectedAddressId,
    state.deliveryMethod,
    state.currentStep,
    initialized,
  ]);

  // Compute live unified price breakdown
  const orderTotals = React.useMemo(() => {
    return calculateOrderTotals(items, state.deliveryMethod, state.appliedCoupon);
  }, [items, state.deliveryMethod, state.appliedCoupon]);

  const updateContact = React.useCallback((contact: Partial<CheckoutContact>) => {
    dispatch({ type: "UPDATE_CONTACT", payload: contact });
  }, []);

  const selectSavedAddress = React.useCallback((addressId: string) => {
    dispatch({ type: "SELECT_ADDRESS", payload: addressId });
  }, []);

  const setShippingAddress = React.useCallback((address: Address) => {
    dispatch({ type: "SET_SHIPPING_ADDRESS", payload: address });
  }, []);

  const setIsAddingNewAddress = React.useCallback((isAdding: boolean) => {
    dispatch({ type: "SET_ADDING_NEW_ADDRESS", payload: isAdding });
  }, []);

  const addNewSavedAddress = React.useCallback(async (address: Address) => {
    dispatch({ type: "SET_SUBMITTING", payload: true });
    try {
      const saved = await addressService.saveAddress(address);
      dispatch({ type: "ADD_SAVED_ADDRESS", payload: saved });
      toast.success("Address Saved", "Delivery address has been saved to your account.");
    } finally {
      dispatch({ type: "SET_SUBMITTING", payload: false });
    }
  }, []);

  const selectDeliveryMethod = React.useCallback((method: DeliveryMethod) => {
    dispatch({ type: "SELECT_DELIVERY_METHOD", payload: method });
  }, []);

  const setCouponInput = React.useCallback((code: string) => {
    dispatch({ type: "SET_COUPON_INPUT", payload: code });
  }, []);

  const applyCoupon = React.useCallback(async () => {
    if (!state.couponCodeInput.trim()) return false;
    dispatch({ type: "SET_SUBMITTING", payload: true });
    try {
      const result = await couponService.validateCoupon(state.couponCodeInput, subtotal);
      if (result.valid && result.coupon) {
        dispatch({ type: "APPLY_COUPON_SUCCESS", payload: result.coupon });
        toast.success("Coupon Applied", result.message);
        return true;
      } else {
        dispatch({ type: "APPLY_COUPON_ERROR", payload: result.message });
        toast.error("Coupon Invalid", result.message);
        return false;
      }
    } finally {
      dispatch({ type: "SET_SUBMITTING", payload: false });
    }
  }, [state.couponCodeInput, subtotal]);

  const removeCoupon = React.useCallback(() => {
    dispatch({ type: "REMOVE_COUPON" });
    toast.info("Coupon Removed", "Discount has been removed from order.");
  }, []);

  const setStep = React.useCallback(
    (targetStep: CheckoutStep) => {
      // Allow jumping to any step that has been completed or is the next immediate step
      const targetIndex = STEP_ORDER.indexOf(targetStep);
      const currentIndex = STEP_ORDER.indexOf(state.currentStep);

      if (targetIndex <= currentIndex || state.completedSteps.includes(targetStep)) {
        dispatch({ type: "SET_STEP", payload: targetStep });
      }
    },
    [state.currentStep, state.completedSteps],
  );

  const goToNextStep = React.useCallback((): boolean => {
    // Validate current step before advancing
    switch (state.currentStep) {
      case "contact": {
        const result = validateContact(state.contact);
        if (!result.isValid) {
          const firstError = Object.values(result.errors)[0];
          dispatch({ type: "SET_ERROR", payload: firstError || "Please check your contact details." });
          toast.error("Incomplete Contact Details", firstError || "Please enter valid email and phone.");
          return false;
        }
        dispatch({ type: "COMPLETE_STEP", payload: "contact" });
        dispatch({ type: "SET_STEP", payload: "address" });
        return true;
      }

      case "address": {
        if (!state.shippingAddress) {
          dispatch({ type: "SET_ERROR", payload: "Please select or add a delivery address." });
          toast.error("Address Required", "Please select or enter a delivery address.");
          return false;
        }
        const result = validateAddress(state.shippingAddress);
        if (!result.isValid) {
          const firstError = Object.values(result.errors)[0];
          dispatch({ type: "SET_ERROR", payload: firstError || "Please check address details." });
          toast.error("Incomplete Address", firstError || "Please check required address fields.");
          return false;
        }
        dispatch({ type: "COMPLETE_STEP", payload: "address" });
        dispatch({ type: "SET_STEP", payload: "delivery" });
        return true;
      }

      case "delivery": {
        if (!state.deliveryMethod) {
          dispatch({ type: "SET_ERROR", payload: "Please select a delivery method." });
          return false;
        }
        dispatch({ type: "COMPLETE_STEP", payload: "delivery" });
        dispatch({ type: "SET_STEP", payload: "review" });
        return true;
      }

      case "review": {
        dispatch({ type: "COMPLETE_STEP", payload: "review" });
        dispatch({ type: "SET_STEP", payload: "payment" });
        return true;
      }

      case "payment": {
        return true;
      }

      default:
        return false;
    }
  }, [state.currentStep, state.contact, state.shippingAddress, state.deliveryMethod]);

  const goToPreviousStep = React.useCallback(() => {
    const currentIndex = STEP_ORDER.indexOf(state.currentStep);
    if (currentIndex > 0) {
      dispatch({ type: "SET_STEP", payload: STEP_ORDER[currentIndex - 1] });
    }
  }, [state.currentStep]);

  const submitPayment = React.useCallback(async (): Promise<{ success: boolean; orderId?: string }> => {
    if (state.isSubmitting) return { success: false };

    dispatch({ type: "SET_SUBMITTING", payload: true });
    try {
      const response = await paymentService.createPaymentSession({
        amount: orderTotals.total,
        currency: "INR",
        method: "upi",
        idempotencyKey: `pay_${Date.now()}`,
        contact: state.contact,
        shippingAddress: state.shippingAddress!,
      });

      return { success: true, orderId: response.sessionId };
    } catch {
      toast.error("Payment Error", "Unable to initialize payment session. Please retry.");
      return { success: false };
    } finally {
      dispatch({ type: "SET_SUBMITTING", payload: false });
    }
  }, [state.isSubmitting, state.contact, state.shippingAddress, orderTotals.total]);

  const value = React.useMemo<CheckoutContextValue>(
    () => ({
      ...state,
      orderTotals,
      setStep,
      goToNextStep,
      goToPreviousStep,
      updateContact,
      selectSavedAddress,
      setShippingAddress,
      addNewSavedAddress,
      setIsAddingNewAddress,
      selectDeliveryMethod,
      setCouponInput,
      applyCoupon,
      removeCoupon,
      submitPayment,
    }),
    [
      state,
      orderTotals,
      setStep,
      goToNextStep,
      goToPreviousStep,
      updateContact,
      selectSavedAddress,
      setShippingAddress,
      addNewSavedAddress,
      setIsAddingNewAddress,
      selectDeliveryMethod,
      setCouponInput,
      applyCoupon,
      removeCoupon,
      submitPayment,
    ],
  );

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>;
}

export function useCheckout() {
  const context = React.useContext(CheckoutContext);
  if (!context) {
    throw new Error("useCheckout must be used within a CheckoutProvider");
  }
  return context;
}
