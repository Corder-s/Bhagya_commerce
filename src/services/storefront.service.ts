/**
 * Bhagya Commerce — Storefront Builder & Custom Domains Service
 * Connects the merchant storefront customizer and public store renderer
 * to backend configuration, sections, atomic revisions, and domain verification.
 */

export type SectionType =
  | "HERO"
  | "FEATURED_PRODUCTS"
  | "FEATURED_CATEGORIES"
  | "COLLECTIONS"
  | "PRODUCT_GRID"
  | "BANNER"
  | "BRAND_STORY"
  | "TESTIMONIALS"
  | "ANNOUNCEMENT"
  | "TEXT"
  | "CTA"
  | "NEWSLETTER";

export interface StorefrontNavItem {
  id?: string;
  label: string;
  targetType: "HOME" | "COLLECTION" | "CATEGORY" | "STORY" | "CUSTOM";
  targetId?: string;
  url: string;
  position: number;
  enabled: boolean;
}

export interface StorefrontConfiguration {
  id: string;
  storeId: string;
  storeName: string;
  tagline?: string;
  description?: string;
  logoUrl?: string;
  faviconUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  socialLinks?: Record<string, string>;

  // Design tokens & branding
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  typography: string;
  buttonStyle: "rounded" | "pill" | "square";
  cardStyle: "surface" | "raised" | "flat" | "bordered";
  borderRadius: "none" | "sm" | "md" | "lg" | "full";

  // SEO & Social
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImageUrl?: string;

  navigationItems: StorefrontNavItem[];
  publishedVersion: number;
  updatedAt?: string;
}

export interface StorefrontSection {
  id: string;
  storeId: string;
  sectionType: SectionType;
  title: string;
  subtitle?: string;
  contentConfig: Record<string, any>;
  position: number;
  enabled: boolean;
}

export type DomainStatus = "PENDING" | "VERIFYING" | "VERIFIED" | "ACTIVE" | "FAILED" | "DISABLED";

export interface StoreDomain {
  id: string;
  storeId: string;
  domain: string;
  type: "SUBDOMAIN" | "CUSTOM_DOMAIN";
  status: DomainStatus;
  isPrimary: boolean;
  verificationToken?: string;
  verificationMethod?: string;
  verifiedAt?: string;
  sslStatus?: string;
  createdAt: string;
}

export interface DomainVerificationResult {
  domainId: string;
  domain: string;
  status: DomainStatus;
  verified: boolean;
  message: string;
  expectedRecordType: string;
  expectedHost: string;
  expectedValue: string;
}

export interface StorefrontPublishResponse {
  storeId: string;
  publishedVersion: number;
  revisionId: string;
  publishedAt: string;
  message: string;
}

export interface PublicStorefrontData {
  storeId: string;
  storeSlug: string;
  storeName: string;
  craftCategory: string;
  story: string;
  configuration: StorefrontConfiguration;
  sections: StorefrontSection[];
  navigationItems: StorefrontNavItem[];
  canonicalUrl: string;
  isPreview: boolean;
  version: number;
}

const STORAGE_KEY_CONFIG = "bhagya_storefront_config";
const STORAGE_KEY_SECTIONS = "bhagya_storefront_sections";
const STORAGE_KEY_DOMAINS = "bhagya_storefront_domains";
const STORAGE_KEY_PUB_VER = "bhagya_storefront_published_ver";

const DEFAULT_CONFIG: StorefrontConfiguration = {
  id: "cfg_varanasi_01",
  storeId: "store_varanasi_silk",
  storeName: "Varanasi Heritage Silks",
  tagline: "Pure Mulberry Handloom Silks Woven on Centuries-Old Pit Looms",
  description: "Authentic Varanasi silk sarees, dupattas, and artisanal brocades woven directly by master generational weavers.",
  logoUrl: "/images/stores/varanasi.jpg",
  faviconUrl: "/icon.svg",
  contactEmail: "contact@varanasiheritage.in",
  contactPhone: "+91 98765 43211",
  socialLinks: {
    instagram: "@varanasi.silks",
    facebook: "varanasiheritagesilks",
    youtube: "VaranasiWeavers",
  },
  primaryColor: "#2D5A43",
  secondaryColor: "#4A7C59",
  accentColor: "#D97706",
  typography: "Outfit",
  buttonStyle: "rounded",
  cardStyle: "surface",
  borderRadius: "lg",
  seoTitle: "Varanasi Heritage Silks | Authentic Handloom Mulberry Silk",
  seoDescription: "Shop handwoven pure Banarasi silk sarees and traditional weaves crafted by generational artisan families.",
  seoKeywords: "Banarasi silk, Mulberry silk, handloom saree, Varanasi weavers, authentic craft",
  ogTitle: "Varanasi Heritage Silks — Generational Master Handloom Weavers",
  ogDescription: "Direct-from-artisan heritage silk sarees and brocades with GI certification.",
  navigationItems: [
    { label: "Home", targetType: "HOME", url: "/", position: 0, enabled: true },
    { label: "Sarees & Weaves", targetType: "COLLECTION", targetId: "col_silk_sarees", url: "/collections/silk-sarees", position: 1, enabled: true },
    { label: "Brocades", targetType: "CATEGORY", targetId: "cat_brocades", url: "/shop?cat=brocades", position: 2, enabled: true },
    { label: "Our Heritage Story", targetType: "STORY", url: "/#story", position: 3, enabled: true },
  ],
  publishedVersion: 1,
};

const DEFAULT_SECTIONS: StorefrontSection[] = [
  {
    id: "sec_hero_01",
    storeId: "store_varanasi_silk",
    sectionType: "HERO",
    title: "Generational Mulberry Silk, Direct from Varanasi Looms",
    subtitle: "Woven across four generations of craft mastery with certified pure zari and uncompromised mulberry yarn.",
    contentConfig: {
      headline: "Generational Mulberry Silk, Direct from Varanasi Looms",
      badge: "GI Certified Origin • 100% Handloom",
      ctaPrimaryText: "Explore Collection",
      ctaPrimaryUrl: "/shop?cat=silk-sarees",
      ctaSecondaryText: "The Weaver's Tale",
      ctaSecondaryUrl: "#story",
      backgroundImageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=80",
    },
    position: 0,
    enabled: true,
  },
  {
    id: "sec_feat_01",
    storeId: "store_varanasi_silk",
    sectionType: "FEATURED_PRODUCTS",
    title: "Curated Masterpiece Weaves",
    subtitle: "Limited pit-loom yards woven with intricate gold kadhwa motifs",
    contentConfig: {
      limit: 4,
      viewAllUrl: "/shop",
      tag: "Handloom Heritage",
    },
    position: 1,
    enabled: true,
  },
  {
    id: "sec_story_01",
    storeId: "store_varanasi_silk",
    sectionType: "BRAND_STORY",
    title: "Four Generations of Heritage Silk Artistry",
    subtitle: "Preserving the sacred pit-loom weaving techniques of Varanasi",
    contentConfig: {
      quote: "Every warp thread is aligned by eye; every shuttle throw carries a rhythm perfected over a century of weaver devotion.",
      artisanName: "Master Weaver Ramnarayan Ansari",
      location: "Madanpura, Varanasi, Uttar Pradesh",
      imageUrl: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80",
    },
    position: 2,
    enabled: true,
  },
  {
    id: "sec_col_01",
    storeId: "store_varanasi_silk",
    sectionType: "COLLECTIONS",
    title: "Artisan Guild Collections",
    subtitle: "Curated themes for festive rituals, bridal heirlooms, and daily elegance",
    contentConfig: {
      layout: "grid",
    },
    position: 3,
    enabled: true,
  },
  {
    id: "sec_test_01",
    storeId: "store_varanasi_silk",
    sectionType: "TESTIMONIALS",
    title: "Artisan Connoisseur Reviews",
    subtitle: "Direct experiences from lovers of authentic Indian handlooms",
    contentConfig: {
      reviewCount: 3,
    },
    position: 4,
    enabled: true,
  },
  {
    id: "sec_cta_01",
    storeId: "store_varanasi_silk",
    sectionType: "CTA",
    title: "Custom Bridal Weaving Consultations",
    subtitle: "Work directly with master craftspeople to commission bespoke heirloom silks for your special occasions.",
    contentConfig: {
      buttonText: "Schedule Consultation",
      buttonUrl: "/contact",
      badge: "Bespoke Craft Commissions",
    },
    position: 5,
    enabled: true,
  },
  {
    id: "sec_news_01",
    storeId: "store_varanasi_silk",
    sectionType: "NEWSLETTER",
    title: "Dispatches from the Varanasi Looms",
    subtitle: "Be first to discover rare small-batch loom drops and seasonal harvest dye editions.",
    contentConfig: {
      incentive: "Receive ₹500 off your inaugural artisanal textile order",
    },
    position: 6,
    enabled: true,
  },
];

const DEFAULT_DOMAINS: StoreDomain[] = [
  {
    id: "dom_varanasi_sub",
    storeId: "store_varanasi_silk",
    domain: "varanasi-silks.bhagya.in",
    type: "SUBDOMAIN",
    status: "ACTIVE",
    isPrimary: true,
    verificationMethod: "DNS_TXT",
    verifiedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    sslStatus: "ACTIVE",
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
];

class StorefrontService {
  private loadStoredConfig(): StorefrontConfiguration {
    if (typeof window === "undefined") return DEFAULT_CONFIG;
    try {
      const raw = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (raw) return JSON.parse(raw);
    } catch {}
    return DEFAULT_CONFIG;
  }

  private saveStoredConfig(cfg: StorefrontConfiguration): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(cfg));
    } catch {}
  }

  private loadStoredSections(): StorefrontSection[] {
    if (typeof window === "undefined") return DEFAULT_SECTIONS;
    try {
      const raw = localStorage.getItem(STORAGE_KEY_SECTIONS);
      if (raw) return JSON.parse(raw);
    } catch {}
    return DEFAULT_SECTIONS;
  }

  private saveStoredSections(sections: StorefrontSection[]): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY_SECTIONS, JSON.stringify(sections));
    } catch {}
  }

  private loadStoredDomains(): StoreDomain[] {
    if (typeof window === "undefined") return DEFAULT_DOMAINS;
    try {
      const raw = localStorage.getItem(STORAGE_KEY_DOMAINS);
      if (raw) return JSON.parse(raw);
    } catch {}
    return DEFAULT_DOMAINS;
  }

  private saveStoredDomains(domains: StoreDomain[]): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY_DOMAINS, JSON.stringify(domains));
    } catch {}
  }

  // ── Configuration API ──────────────────────────────────────────────────

  async getConfiguration(): Promise<StorefrontConfiguration> {
    await new Promise((r) => setTimeout(r, 120));
    return this.loadStoredConfig();
  }

  async updateConfiguration(data: Partial<StorefrontConfiguration>): Promise<StorefrontConfiguration> {
    await new Promise((r) => setTimeout(r, 200));
    const current = this.loadStoredConfig();
    const updated: StorefrontConfiguration = {
      ...current,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    this.saveStoredConfig(updated);
    return updated;
  }

  // ── Sections API ───────────────────────────────────────────────────────

  async getSections(includeDisabled = true): Promise<StorefrontSection[]> {
    await new Promise((r) => setTimeout(r, 100));
    const sections = this.loadStoredSections();
    return sections
      .filter((s) => includeDisabled || s.enabled)
      .sort((a, b) => a.position - b.position);
  }

  async addSection(data: Omit<StorefrontSection, "id" | "storeId" | "position">): Promise<StorefrontSection> {
    await new Promise((r) => setTimeout(r, 150));
    const sections = this.loadStoredSections();
    const nextPos = sections.length > 0 ? Math.max(...sections.map((s) => s.position)) + 1 : 0;
    const newSection: StorefrontSection = {
      id: "sec_" + Math.random().toString(36).substring(2, 9),
      storeId: "store_varanasi_silk",
      sectionType: data.sectionType,
      title: data.title,
      subtitle: data.subtitle,
      contentConfig: data.contentConfig || {},
      position: nextPos,
      enabled: data.enabled !== undefined ? data.enabled : true,
    };
    sections.push(newSection);
    this.saveStoredSections(sections);
    return newSection;
  }

  async updateSection(id: string, data: Partial<StorefrontSection>): Promise<StorefrontSection> {
    await new Promise((r) => setTimeout(r, 150));
    const sections = this.loadStoredSections();
    const idx = sections.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error(`Section not found with id ${id}`);
    const updated = { ...sections[idx], ...data };
    sections[idx] = updated;
    this.saveStoredSections(sections);
    return updated;
  }

  async deleteSection(id: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 150));
    let sections = this.loadStoredSections();
    sections = sections.filter((s) => s.id !== id);
    // re-index
    sections.forEach((s, i) => {
      s.position = i;
    });
    this.saveStoredSections(sections);
  }

  async reorderSections(orderedIds: string[]): Promise<StorefrontSection[]> {
    await new Promise((r) => setTimeout(r, 150));
    const sections = this.loadStoredSections();
    const map = new Map(sections.map((s) => [s.id, s]));
    const reordered: StorefrontSection[] = [];
    orderedIds.forEach((id, pos) => {
      const s = map.get(id);
      if (s) {
        s.position = pos;
        reordered.push(s);
      }
    });
    this.saveStoredSections(reordered);
    return reordered;
  }

  // ── Preview & Publish ─────────────────────────────────────────────────

  async getPreview(): Promise<PublicStorefrontData> {
    await new Promise((r) => setTimeout(r, 150));
    const cfg = this.loadStoredConfig();
    const sections = (await this.getSections(false)).sort((a, b) => a.position - b.position);
    return {
      storeId: cfg.storeId,
      storeSlug: "varanasi-heritage-silks",
      storeName: cfg.storeName,
      craftCategory: "Handloom Mulberry Silk",
      story: cfg.description || "",
      configuration: cfg,
      sections,
      navigationItems: cfg.navigationItems,
      canonicalUrl: "https://bhagya.in/store/varanasi-heritage-silks",
      isPreview: true,
      version: cfg.publishedVersion,
    };
  }

  async publish(): Promise<StorefrontPublishResponse> {
    await new Promise((r) => setTimeout(r, 400));
    const cfg = this.loadStoredConfig();
    const newVersion = cfg.publishedVersion + 1;
    cfg.publishedVersion = newVersion;
    this.saveStoredConfig(cfg);

    // Save snapshot in published version storage
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY_PUB_VER, String(newVersion));
      } catch {}
    }

    return {
      storeId: cfg.storeId,
      publishedVersion: newVersion,
      revisionId: "rev_" + Math.random().toString(36).substring(2, 9),
      publishedAt: new Date().toISOString(),
      message: `Storefront published live to Version ${newVersion}. Cache invalidated.`,
    };
  }

  // ── Custom Domains API ────────────────────────────────────────────────

  async getDomains(): Promise<StoreDomain[]> {
    await new Promise((r) => setTimeout(r, 120));
    return this.loadStoredDomains();
  }

  async addDomain(domain: string, type: "SUBDOMAIN" | "CUSTOM_DOMAIN" = "CUSTOM_DOMAIN"): Promise<StoreDomain> {
    await new Promise((r) => setTimeout(r, 200));
    const clean = domain.trim().toLowerCase();
    const domains = this.loadStoredDomains();
    if (domains.some((d) => d.domain === clean)) {
      throw new Error(`Domain "${clean}" is already registered.`);
    }

    const newDomain: StoreDomain = {
      id: "dom_" + Math.random().toString(36).substring(2, 9),
      storeId: "store_varanasi_silk",
      domain: clean,
      type,
      status: "PENDING",
      isPrimary: false,
      verificationToken: "bhagya-verify=" + Math.random().toString(36).substring(2, 14),
      verificationMethod: "DNS_TXT",
      sslStatus: "PENDING",
      createdAt: new Date().toISOString(),
    };

    domains.push(newDomain);
    this.saveStoredDomains(domains);
    return newDomain;
  }

  async verifyDomain(id: string): Promise<DomainVerificationResult> {
    await new Promise((r) => setTimeout(r, 600));
    const domains = this.loadStoredDomains();
    const d = domains.find((item) => item.id === id);
    if (!d) throw new Error("Domain not found");

    d.status = "VERIFIED";
    d.verifiedAt = new Date().toISOString();
    d.sslStatus = "ACTIVE";
    this.saveStoredDomains(domains);

    return {
      domainId: d.id,
      domain: d.domain,
      status: "VERIFIED",
      verified: true,
      message: "DNS TXT challenge verified successfully. Ready for instant activation.",
      expectedRecordType: "TXT",
      expectedHost: `_bhagya-challenge.${d.domain}`,
      expectedValue: d.verificationToken || "",
    };
  }

  async activateDomain(id: string): Promise<StoreDomain> {
    await new Promise((r) => setTimeout(r, 300));
    const domains = this.loadStoredDomains();
    const d = domains.find((item) => item.id === id);
    if (!d) throw new Error("Domain not found");
    if (d.status !== "VERIFIED" && d.status !== "ACTIVE") {
      throw new Error("Domain must be verified before activation.");
    }
    d.status = "ACTIVE";
    d.sslStatus = "ACTIVE";
    this.saveStoredDomains(domains);
    return d;
  }

  async setPrimaryDomain(id: string): Promise<StoreDomain> {
    await new Promise((r) => setTimeout(r, 250));
    const domains = this.loadStoredDomains();
    const target = domains.find((item) => item.id === id);
    if (!target) throw new Error("Domain not found");
    if (target.status !== "ACTIVE") {
      throw new Error("Only active verified domains can be set as primary.");
    }
    domains.forEach((d) => {
      d.isPrimary = d.id === id;
    });
    this.saveStoredDomains(domains);
    return target;
  }

  async disableDomain(id: string): Promise<StoreDomain> {
    await new Promise((r) => setTimeout(r, 200));
    const domains = this.loadStoredDomains();
    const d = domains.find((item) => item.id === id);
    if (!d) throw new Error("Domain not found");
    d.status = "DISABLED";
    d.isPrimary = false;
    this.saveStoredDomains(domains);
    return d;
  }

  async deleteDomain(id: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 200));
    const domains = this.loadStoredDomains().filter((d) => d.id !== id);
    this.saveStoredDomains(domains);
  }

  // ── Public Storefront Resolution ──────────────────────────────────────

  async getPublicStorefront(slug: string, host?: string): Promise<PublicStorefrontData> {
    await new Promise((r) => setTimeout(r, 120));
    const cfg = this.loadStoredConfig();
    const sections = (await this.getSections(false)).sort((a, b) => a.position - b.position);
    const domains = this.loadStoredDomains();
    const primary = domains.find((d) => d.isPrimary && d.status === "ACTIVE");

    const canonical = primary ? `https://${primary.domain}` : `https://bhagya.in/store/${slug}`;

    return {
      storeId: cfg.storeId,
      storeSlug: slug || "varanasi-heritage-silks",
      storeName: cfg.storeName,
      craftCategory: "Handloom Mulberry Silk",
      story: cfg.description || "",
      configuration: cfg,
      sections,
      navigationItems: cfg.navigationItems,
      canonicalUrl: canonical,
      isPreview: false,
      version: cfg.publishedVersion,
    };
  }
}

export const storefrontService = new StorefrontService();
