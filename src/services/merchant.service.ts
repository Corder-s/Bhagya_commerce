/**
 * Bhagya Commerce — Merchant Domain Service (Step 8)
 *
 * Provides service operations for:
 *   - Onboarding wizard draft persistence (resuming across refreshes)
 *   - Store slug availability verification
 *   - Atomic creation of Organization + OrganizationMember + Store
 *   - Retrieving merchant store profile and categories
 *
 * Future Spring Boot REST Endpoints:
 *   - GET   /api/v1/merchant/onboarding
 *   - POST  /api/v1/merchant/onboarding
 *   - POST  /api/v1/merchant/store
 *   - GET   /api/v1/merchant/store
 *   - PATCH /api/v1/merchant/store
 *   - GET   /api/v1/merchant/categories
 *   - GET   /api/v1/merchant/check-slug?slug={slug}
 */

import type {
  CategoryOption,
  CreateStoreResult,
  MerchantOnboardingData,
  Organization,
  OrganizationMember,
  Store,
} from "@/features/merchant/merchant-types";
import {
  MERCHANT_CATEGORIES,
  validateStoreSlug,
} from "@/features/merchant/merchant-utils";
import { authStorage } from "@/lib/storage/auth-storage";
import { merchantStorage } from "@/lib/storage/merchant-storage";
import { notificationService } from "@/services/notification.service";

class MerchantService {
  /**
   * Fetch active onboarding draft for the user
   */
  async getOnboardingDraft(): Promise<MerchantOnboardingData | null> {
    await new Promise((resolve) => setTimeout(resolve, 80));
    return merchantStorage.getOnboardingDraft();
  }

  /**
   * Save / sync onboarding progress
   */
  async saveOnboardingDraft(data: Partial<MerchantOnboardingData>): Promise<void> {
    merchantStorage.saveOnboardingDraft(data);
  }

  /**
   * Clear onboarding draft upon completion or reset
   */
  async clearOnboardingDraft(): Promise<void> {
    merchantStorage.clearOnboardingDraft();
  }

  /**
   * Verify whether a store slug is available
   */
  async checkSlugAvailability(slug: string): Promise<{ available: boolean; message?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 150));

    const validation = validateStoreSlug(slug);
    if (!validation.valid) {
      return { available: false, message: validation.message };
    }

    const existing = merchantStorage.getStoreBySlug(slug);
    if (existing) {
      return {
        available: false,
        message: `The URL "bhagya.in/store/${slug}" is already registered. Please choose another slug.`,
      };
    }

    return { available: true };
  }

  /**
   * Create Store + Organization + Membership atomically
   */
  async createStore(
    data: MerchantOnboardingData,
    userId: string,
  ): Promise<CreateStoreResult> {
    await new Promise((resolve) => setTimeout(resolve, 650));

    // Validate slug uniqueness
    const existing = merchantStorage.getStoreBySlug(data.storeSlug);
    if (existing) {
      throw new Error(`The store URL "${data.storeSlug}" is already taken.`);
    }

    const now = new Date().toISOString();
    const orgId = `org_${Date.now()}`;
    const storeId = `store_${Date.now()}`;
    const memberId = `mem_${Date.now()}`;

    // 1. Create Organization
    const organization: Organization = {
      id: orgId,
      name: data.businessName.trim(),
      type: "business",
      createdAt: now,
    };
    merchantStorage.saveOrganization(organization);

    // 2. Create Organization Membership (Owner)
    const membership: OrganizationMember = {
      id: memberId,
      organizationId: orgId,
      userId,
      role: "owner",
      createdAt: now,
    };
    merchantStorage.saveMembership(membership);

    // 3. Resolve Category Name
    const category = MERCHANT_CATEGORIES.find((c) => c.id === data.primaryCategoryId);

    // 4. Create Store
    const store: Store = {
      id: storeId,
      organizationId: orgId,
      name: data.storeName.trim(),
      slug: data.storeSlug.trim().toLowerCase(),
      description: data.storeDescription.trim(),
      tagline: data.storeTagline?.trim() || undefined,
      logoUrl: data.logoUrl,
      bannerUrl: data.bannerUrl,
      brandAccent: data.brandAccent || "#C49A45",
      categoryId: data.primaryCategoryId,
      categoryName: category?.name || "Handmade & Crafts",
      businessType: data.businessType,
      ownerName: data.ownerName.trim(),
      contactEmail: data.contactEmail.trim(),
      contactPhone: data.contactPhone.trim(),
      specialtyTags: data.specialtyTags,
      status: "active",
      createdAt: now,
    };
    merchantStorage.saveStore(store);

    // 5. Update authenticated user's organization membership in session
    const currentUser = authStorage.getUser();
    if (currentUser && currentUser.id === userId) {
      const updatedUser = {
        ...currentUser,
        role: "merchant" as const,
        organizationMembership: {
          organizationId: orgId,
          organizationName: organization.name,
          role: "owner" as const,
          storeId: store.id,
          storeName: store.name,
        },
      };
      authStorage.setUser(updatedUser);
    }

    // 6. Push Welcome Notification to Notification Center
    try {
      await notificationService.pushNotification({
        type: "account",
        title: "Store Created Successfully!",
        message: `Welcome to the Bhagya merchant community. Your store "${store.name}" is now live at bhagya.in/store/${store.slug}.`,
        actionUrl: "/merchant/dashboard",
        metadata: { storeId: store.id, storeSlug: store.slug },
      });
    } catch {
      // Safe fallback
    }

    // 7. Clear onboarding draft
    merchantStorage.clearOnboardingDraft();

    return {
      success: true,
      organization,
      membership,
      store,
      message: "Your store has been created successfully.",
    };
  }

  /**
   * Get store belonging to a user (via membership)
   */
  async getUserStore(userId: string): Promise<Store | null> {
    await new Promise((resolve) => setTimeout(resolve, 80));
    const memberships = merchantStorage.getMemberships();
    const userMembership = memberships.find((m) => m.userId === userId);

    if (!userMembership) {
      // Check demo user fallback
      const user = authStorage.getUser();
      if (user?.organizationMembership?.storeId) {
        return merchantStorage.getStoreById(user.organizationMembership.storeId);
      }
      return null;
    }

    const stores = merchantStorage.getStores();
    return stores.find((s) => s.organizationId === userMembership.organizationId) || null;
  }

  /**
   * Get store by URL slug
   */
  async getStoreBySlug(slug: string): Promise<Store | null> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return merchantStorage.getStoreBySlug(slug);
  }

  /**
   * Get available category options
   */
  async getCategories(): Promise<CategoryOption[]> {
    return [...MERCHANT_CATEGORIES];
  }
}

export const merchantService = new MerchantService();
