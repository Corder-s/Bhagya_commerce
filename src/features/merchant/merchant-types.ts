/**
 * Bhagya Commerce — Merchant & Organization Domain Types (Step 8)
 *
 * Core Identity Principle:
 * User
 *  ├── Customer (orders, wishlist, cart, addresses)
 *  └── Organization Membership
 *          ↓
 *      Organization
 *          ↓
 *        Store
 *          ↓
 *       Merchant
 *
 * The same authenticated user can shop and sell without creating a separate login.
 */

export type StoreStatus = "draft" | "active" | "suspended";

export type BusinessType =
  | "individual"
  | "partnership"
  | "pvt_ltd"
  | "llp"
  | "trust_shg"
  | "other";

export interface Organization {
  id: string;
  name: string;
  type: "business";
  createdAt: string;
  updatedAt?: string;
}

export type OrganizationRole = "owner" | "admin" | "staff";

export interface OrganizationMember {
  id: string;
  organizationId: string;
  userId: string;
  role: OrganizationRole;
  createdAt: string;
}

export interface Store {
  id: string;
  organizationId: string;
  name: string;
  slug: string;
  description?: string;
  tagline?: string;
  logoUrl?: string;
  bannerUrl?: string;
  brandAccent?: string;
  categoryId?: string;
  categoryName?: string;
  businessType?: BusinessType;
  ownerName?: string;
  contactEmail?: string;
  contactPhone?: string;
  specialtyTags?: string[];
  status: StoreStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface CategoryOption {
  id: string;
  name: string;
  description: string;
  iconName: string;
  suggestedTags: string[];
}

export type OnboardingStepId =
  | "business"
  | "store"
  | "category"
  | "branding"
  | "review"
  | "complete";

export interface MerchantOnboardingData {
  // Step 1 - Business Details
  businessName: string;
  ownerName: string;
  contactEmail: string;
  contactPhone: string;
  businessType: BusinessType;

  // Step 2 - Store Details
  storeName: string;
  storeSlug: string;
  storeDescription: string;
  storeTagline?: string;

  // Step 3 - Business Category
  primaryCategoryId: string;
  specialtyTags: string[];

  // Step 4 - Store Branding
  logoUrl?: string;
  bannerUrl?: string;
  brandAccent?: string;

  // Step 5 - Review & Terms
  agreedToCharter: boolean;

  // Wizard state metadata
  currentStep: OnboardingStepId;
  completedSteps: OnboardingStepId[];
  lastSavedAt?: string;
}

export interface CreateStoreResult {
  success: boolean;
  organization: Organization;
  membership: OrganizationMember;
  store: Store;
  message?: string;
}
