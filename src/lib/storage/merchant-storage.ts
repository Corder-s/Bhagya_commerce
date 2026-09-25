/**
 * Bhagya Commerce — Merchant & Store Storage Abstraction (Step 8)
 *
 * Provides safe client-side persistence for:
 *   - Onboarding wizard drafts (resuming across refreshes)
 *   - Registered organizations and stores
 *   - Organization memberships
 */

import type {
  MerchantOnboardingData,
  Organization,
  OrganizationMember,
  Store,
} from "@/features/merchant/merchant-types";

const DRAFT_KEY = "bhagya_merchant_onboarding_draft";
const STORES_KEY = "bhagya_merchant_stores";
const ORGS_KEY = "bhagya_merchant_organizations";
const MEMBERSHIPS_KEY = "bhagya_merchant_memberships";

// Seed initial artisan stores
const SEED_STORES: Store[] = [
  {
    id: "store_varanasi_silk",
    organizationId: "org_artisan_01",
    name: "Varanasi Heritage Silks",
    slug: "varanasi-heritage-silks",
    tagline: "4th generation master handloom weavers of pure Banarasi brocade",
    description: "Authentic hand-woven Banarasi silk sarees, dupattas and bespoke brocades directly from master weavers in Varanasi.",
    categoryId: "heritage-fashion",
    categoryName: "Heritage Fashion",
    businessType: "trust_shg",
    ownerName: "Aarav Sharma",
    contactEmail: "aarav.sharma@example.com",
    contactPhone: "+91 98765 43210",
    brandAccent: "#C49A45",
    specialtyTags: ["Banarasi Silk", "Handloom", "Pure Zari", "GI Tagged"],
    status: "active",
    createdAt: "2026-01-15T08:30:00.000Z",
  },
  {
    id: "store_kashmir_wood",
    organizationId: "org_artisan_02",
    name: "Srinagar Woodcraft Co.",
    slug: "srinagar-woodcraft",
    tagline: "Carved from sustainably seasoned single-block walnut wood",
    description: "Hand-carved walnut wood bowls, trays, and sacred furniture preserving 600-year-old Kashmiri Khatamband and Naqashi traditions.",
    categoryId: "handmade-crafts",
    categoryName: "Handmade & Crafts",
    businessType: "individual",
    ownerName: "Ghulam Nabi",
    contactEmail: "contact@srinagarwoodcraft.com",
    contactPhone: "+91 98111 22334",
    brandAccent: "#9A6A20",
    specialtyTags: ["Walnut Wood", "Single Block", "Hand Carved"],
    status: "active",
    createdAt: "2026-02-01T10:00:00.000Z",
  },
];

const SEED_ORGS: Organization[] = [
  {
    id: "org_artisan_01",
    name: "Varanasi Silk Guild",
    type: "business",
    createdAt: "2026-01-15T08:30:00.000Z",
  },
  {
    id: "org_artisan_02",
    name: "Srinagar Woodcraft Guild",
    type: "business",
    createdAt: "2026-02-01T10:00:00.000Z",
  },
];

const SEED_MEMBERSHIPS: OrganizationMember[] = [
  {
    id: "mem_01",
    organizationId: "org_artisan_01",
    userId: "usr_aarav_01",
    role: "owner",
    createdAt: "2026-01-15T08:30:00.000Z",
  },
];

export const merchantStorage = {
  /**
   * Retrieve active onboarding draft
   */
  getOnboardingDraft(): MerchantOnboardingData | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  /**
   * Save or update onboarding draft
   */
  saveOnboardingDraft(data: Partial<MerchantOnboardingData>): void {
    if (typeof window === "undefined") return;
    try {
      const existing = this.getOnboardingDraft() || {
        businessName: "",
        ownerName: "",
        contactEmail: "",
        contactPhone: "",
        businessType: "individual" as const,
        storeName: "",
        storeSlug: "",
        storeDescription: "",
        storeTagline: "",
        primaryCategoryId: "organic-natural",
        specialtyTags: [],
        agreedToCharter: false,
        currentStep: "business" as const,
        completedSteps: [],
      };

      const merged: MerchantOnboardingData = {
        ...existing,
        ...data,
        lastSavedAt: new Date().toISOString(),
      };

      localStorage.setItem(DRAFT_KEY, JSON.stringify(merged));
    } catch {
      // Safe fallback
    }
  },

  /**
   * Clear onboarding draft
   */
  clearOnboardingDraft(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      // Safe fallback
    }
  },

  /**
   * Get all stores
   */
  getStores(): Store[] {
    if (typeof window === "undefined") return SEED_STORES;
    try {
      const raw = localStorage.getItem(STORES_KEY);
      if (!raw) {
        localStorage.setItem(STORES_KEY, JSON.stringify(SEED_STORES));
        return SEED_STORES;
      }
      return JSON.parse(raw);
    } catch {
      return SEED_STORES;
    }
  },

  /**
   * Get store by ID
   */
  getStoreById(id: string): Store | null {
    const stores = this.getStores();
    return stores.find((s) => s.id === id) || null;
  },

  /**
   * Get store by slug
   */
  getStoreBySlug(slug: string): Store | null {
    const stores = this.getStores();
    return stores.find((s) => s.slug.toLowerCase() === slug.toLowerCase()) || null;
  },

  /**
   * Save a store
   */
  saveStore(store: Store): void {
    if (typeof window === "undefined") return;
    try {
      const stores = this.getStores();
      const idx = stores.findIndex((s) => s.id === store.id);
      if (idx >= 0) {
        stores[idx] = { ...store, updatedAt: new Date().toISOString() };
      } else {
        stores.unshift(store);
      }
      localStorage.setItem(STORES_KEY, JSON.stringify(stores));
    } catch {
      // Safe fallback
    }
  },

  /**
   * Get all organizations
   */
  getOrganizations(): Organization[] {
    if (typeof window === "undefined") return SEED_ORGS;
    try {
      const raw = localStorage.getItem(ORGS_KEY);
      if (!raw) {
        localStorage.setItem(ORGS_KEY, JSON.stringify(SEED_ORGS));
        return SEED_ORGS;
      }
      return JSON.parse(raw);
    } catch {
      return SEED_ORGS;
    }
  },

  /**
   * Save organization
   */
  saveOrganization(org: Organization): void {
    if (typeof window === "undefined") return;
    try {
      const orgs = this.getOrganizations();
      const idx = orgs.findIndex((o) => o.id === org.id);
      if (idx >= 0) {
        orgs[idx] = org;
      } else {
        orgs.unshift(org);
      }
      localStorage.setItem(ORGS_KEY, JSON.stringify(orgs));
    } catch {
      // Safe fallback
    }
  },

  /**
   * Get all memberships
   */
  getMemberships(): OrganizationMember[] {
    if (typeof window === "undefined") return SEED_MEMBERSHIPS;
    try {
      const raw = localStorage.getItem(MEMBERSHIPS_KEY);
      if (!raw) {
        localStorage.setItem(MEMBERSHIPS_KEY, JSON.stringify(SEED_MEMBERSHIPS));
        return SEED_MEMBERSHIPS;
      }
      return JSON.parse(raw);
    } catch {
      return SEED_MEMBERSHIPS;
    }
  },

  /**
   * Save membership
   */
  saveMembership(member: OrganizationMember): void {
    if (typeof window === "undefined") return;
    try {
      const list = this.getMemberships();
      const idx = list.findIndex((m) => m.id === member.id);
      if (idx >= 0) {
        list[idx] = member;
      } else {
        list.unshift(member);
      }
      localStorage.setItem(MEMBERSHIPS_KEY, JSON.stringify(list));
    } catch {
      // Safe fallback
    }
  },
};
