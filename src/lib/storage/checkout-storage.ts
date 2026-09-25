import type { Address, CheckoutContact, CheckoutStep } from "@/features/checkout/checkout-types";

const CHECKOUT_DRAFT_KEY = "bhagya_checkout_draft_v1";
const SAVED_ADDRESSES_KEY = "bhagya_saved_addresses_v1";

export const DEFAULT_MOCK_ADDRESSES: Address[] = [
  {
    id: "addr_home",
    fullName: "Aarav Sharma",
    phone: "9876543210",
    addressLine1: "Flat 402, Lotus Greens, Sector 45",
    addressLine2: "Near Golf Course Extension",
    landmark: "Opposite City Park",
    city: "Gurugram",
    state: "Haryana",
    postalCode: "122003",
    country: "India",
    addressType: "home",
    isDefault: true,
  },
  {
    id: "addr_work",
    fullName: "Aarav Sharma",
    phone: "9876543210",
    addressLine1: "WeWork Cyber City, Tower B, 8th Floor",
    addressLine2: "DLF Phase 2",
    city: "Gurugram",
    state: "Haryana",
    postalCode: "122002",
    country: "India",
    addressType: "work",
  },
];

export interface CheckoutDraft {
  contact?: CheckoutContact;
  shippingAddress?: Address;
  selectedAddressId?: string;
  deliveryMethodId?: string;
  currentStep?: CheckoutStep;
}

export const checkoutStorage = {
  getDraft(): CheckoutDraft | null {
    if (typeof window === "undefined") return null;
    try {
      const stored = window.localStorage.getItem(CHECKOUT_DRAFT_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  saveDraft(draft: CheckoutDraft): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(CHECKOUT_DRAFT_KEY, JSON.stringify(draft));
    } catch {
      // Storage quota or privacy mode error ignored
    }
  },

  clearDraft(): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(CHECKOUT_DRAFT_KEY);
    } catch {
      // Storage error ignored
    }
  },

  getSavedAddresses(): Address[] {
    if (typeof window === "undefined") return DEFAULT_MOCK_ADDRESSES;
    try {
      const stored = window.localStorage.getItem(SAVED_ADDRESSES_KEY);
      if (!stored) {
        // Seed default addresses
        this.saveSavedAddresses(DEFAULT_MOCK_ADDRESSES);
        return DEFAULT_MOCK_ADDRESSES;
      }
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_MOCK_ADDRESSES;
    } catch {
      return DEFAULT_MOCK_ADDRESSES;
    }
  },

  saveSavedAddresses(addresses: Address[]): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(SAVED_ADDRESSES_KEY, JSON.stringify(addresses));
    } catch {
      // Storage error ignored
    }
  },
};
