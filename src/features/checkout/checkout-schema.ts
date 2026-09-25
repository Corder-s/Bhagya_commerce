import type { Address, CheckoutContact } from "./checkout-types";

export interface ValidationResult<T> {
  isValid: boolean;
  errors: Partial<Record<keyof T, string>>;
}

/**
 * Contact Validation:
 * - Email format check
 * - Indian phone format check (10 digits starting with 6-9, optional +91 prefix)
 */
export function validateContact(contact: CheckoutContact): ValidationResult<CheckoutContact> {
  const errors: Partial<Record<keyof CheckoutContact, string>> = {};

  const cleanEmail = contact.email.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!cleanEmail) {
    errors.email = "Email address is required for order updates.";
  } else if (!emailRegex.test(cleanEmail)) {
    errors.email = "Please enter a valid email address (e.g. name@example.com).";
  }

  const cleanPhone = contact.phone.replace(/[\s\-\+]/g, "").replace(/^91/, "");
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!cleanPhone) {
    errors.phone = "Phone number is required for delivery notifications.";
  } else if (!phoneRegex.test(cleanPhone)) {
    errors.phone = "Enter a valid 10-digit Indian mobile number.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Address Validation:
 * - Full Name required (min 2 characters)
 * - Phone required (10 digits)
 * - Address line 1 required (min 5 characters)
 * - City required (min 2 characters)
 * - State required
 * - PIN code: exact 6 numeric digits
 */
export function validateAddress(address: Address): ValidationResult<Address> {
  const errors: Partial<Record<keyof Address, string>> = {};

  if (!address.fullName || address.fullName.trim().length < 2) {
    errors.fullName = "Please enter the recipient's full name.";
  }

  const cleanPhone = address.phone.replace(/[\s\-\+]/g, "").replace(/^91/, "");
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!cleanPhone) {
    errors.phone = "Recipient contact phone number is required.";
  } else if (!phoneRegex.test(cleanPhone)) {
    errors.phone = "Enter a valid 10-digit Indian phone number.";
  }

  if (!address.addressLine1 || address.addressLine1.trim().length < 5) {
    errors.addressLine1 = "Please enter a street address or house/flat number.";
  }

  if (!address.city || address.city.trim().length < 2) {
    errors.city = "City / District is required.";
  }

  if (!address.state || address.state.trim().length === 0) {
    errors.state = "Please select your state.";
  }

  const pinRegex = /^\d{6}$/;
  const cleanPin = address.postalCode?.trim() ?? "";
  if (!cleanPin) {
    errors.postalCode = "6-digit postal PIN code is required.";
  } else if (!pinRegex.test(cleanPin)) {
    errors.postalCode = "Enter a valid 6-digit PIN code (e.g. 110001, 560001).";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
