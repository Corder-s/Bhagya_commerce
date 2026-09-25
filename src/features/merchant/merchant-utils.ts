import type { BusinessType, CategoryOption } from "./merchant-types";

/**
 * Generate an SEO & URL-friendly slug from store name
 * Rules:
 *  - lowercase
 *  - replace whitespace & special chars with hyphen
 *  - collapse consecutive hyphens
 *  - trim leading/trailing hyphens
 *  - max 48 characters
 */
export function slugifyStoreName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove non-word characters except hyphens and spaces
    .replace(/[\s_-]+/g, "-") // Collapse whitespace and underscore to hyphen
    .replace(/^-+|-+$/g, "") // Trim leading and trailing hyphens
    .slice(0, 48);
}

/**
 * Validate store slug format
 */
export function validateStoreSlug(slug: string): { valid: boolean; message?: string } {
  const trimmed = slug.trim();
  if (!trimmed) {
    return { valid: false, message: "Store URL slug is required" };
  }
  if (trimmed.length < 3) {
    return { valid: false, message: "Store URL must be at least 3 characters long" };
  }
  if (trimmed.length > 48) {
    return { valid: false, message: "Store URL cannot exceed 48 characters" };
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(trimmed)) {
    return {
      valid: false,
      message: "Store URL can only contain lowercase letters, numbers, and single hyphens between words",
    };
  }

  // Reserved slugs that cannot be claimed by stores
  const reserved = [
    "admin",
    "account",
    "auth",
    "cart",
    "checkout",
    "dashboard",
    "help",
    "login",
    "merchant",
    "notifications",
    "orders",
    "register",
    "search",
    "shop",
    "store",
    "terms",
    "privacy",
    "api",
  ];

  if (reserved.includes(trimmed)) {
    return { valid: false, message: `"${trimmed}" is a reserved URL. Please pick another name.` };
  }

  return { valid: true };
}

/**
 * Curated categories for Indian artisan & conscious brands
 */
export const MERCHANT_CATEGORIES: readonly CategoryOption[] = [
  {
    id: "organic-natural",
    name: "Organic & Natural",
    description: "Certified organic grains, spices, cold-pressed oils, superfoods & farm produce",
    iconName: "Leaf",
    suggestedTags: ["Organic Spices", "Cold-Pressed Oils", "Heritage Rice", "A2 Ghee", "Raw Honey"],
  },
  {
    id: "ayurveda-wellness",
    name: "Ayurveda & Wellness",
    description: "Authentic herbal rasayanas, classical formulations, churnas & wellness teas",
    iconName: "Sparkles",
    suggestedTags: ["Classical Churna", "Herbal Infusions", "Ayurvedic Oils", "Immunity Boosters"],
  },
  {
    id: "beauty-personal-care",
    name: "Beauty & Personal Care",
    description: "Toxin-free plant skincare, kumkumadi serums, herbal ubtans & handmade soaps",
    iconName: "Heart",
    suggestedTags: ["Kumkumadi", "Artisan Soaps", "Hair Oils", "Herbal Ubtan", "Rose Water"],
  },
  {
    id: "handmade-crafts",
    name: "Handmade & Crafts",
    description: "Master woodcraft, brass metalwork, terracotta artifacts, blue pottery & stone carving",
    iconName: "Palette",
    suggestedTags: ["Walnut Woodcraft", "Brass Masters", "Blue Pottery", "Terracotta Art"],
  },
  {
    id: "heritage-fashion",
    name: "Heritage Fashion",
    description: "Handloom textiles, Khadi apparel, Banarasi silks, block prints & natural dyed wear",
    iconName: "Shirt",
    suggestedTags: ["Banarasi Silk", "Chanderi", "Ajrakh Prints", "Handloom Cotton", "Khadi"],
  },
  {
    id: "home-living",
    name: "Home & Living",
    description: "Hand-printed table linens, copperware, handcrafted brass lamps & natural rugs",
    iconName: "Home",
    suggestedTags: ["Copperware", "Brass Diyas", "Blockprint Linen", "Jute Carpets", "Clay Cookware"],
  },
  {
    id: "spiritual-puja",
    name: "Spiritual & Sacred",
    description: "Handcrafted puja thalis, pure cow dung dhoop, temple incense & brass bells",
    iconName: "Sun",
    suggestedTags: ["Pure Cow Ghee Diya", "Organic Dhoop", "Brass Puja Sets", "Chandan Paste"],
  },
  {
    id: "sustainable-living",
    name: "Sustainable Living",
    description: "Zero-waste everyday essentials, banana fibre crafts, bamboo products & terracotta bottles",
    iconName: "Recycle",
    suggestedTags: ["Banana Fibre", "Bamboo Utensils", "Clay Water Pots", "Plastic-Free Living"],
  },
  {
    id: "food-beverages",
    name: "Food & Artisanal Treats",
    description: "Forest honey, artisan filter coffee, hand-rolled snacks, organic jaggery & preserves",
    iconName: "Utensils",
    suggestedTags: ["Filter Coffee", "Forest Honey", "Millet Snacks", "Organic Jaggery"],
  },
  {
    id: "other-specialty",
    name: "Other Artisan Specialty",
    description: "Unique traditional regional crafts, innovative conscious designs and custom works",
    iconName: "Compass",
    suggestedTags: ["Custom Crafts", "Regional Heritage", "Artisan Collectibles"],
  },
] as const;

/**
 * Business type options
 */
export const BUSINESS_TYPES: readonly { value: BusinessType; label: string; description: string }[] = [
  {
    value: "individual",
    label: "Individual / Sole Proprietor",
    description: "Ideal for independent artisans, master weavers, home makers & solo creators.",
  },
  {
    value: "partnership",
    label: "Partnership Firm",
    description: "Registered partnership between two or more artisan partners or founders.",
  },
  {
    value: "pvt_ltd",
    label: "Private Limited Company (Pvt Ltd)",
    description: "Incorporated private entity with dedicated corporate governance.",
  },
  {
    value: "llp",
    label: "Limited Liability Partnership (LLP)",
    description: "Registered LLP offering limited liability protection for brand owners.",
  },
  {
    value: "trust_shg",
    label: "Artisan Cooperative / SHG / Trust",
    description: "Self-Help Groups, Weaver Guilds, Artisan Societies & Non-profit Craft Trusts.",
  },
  {
    value: "other",
    label: "Other Legal Structure",
    description: "Other registered entities or international craft collectives.",
  },
] as const;

/**
 * Curated brand accent presets harmonious with Bhagya's Warm Ivory design system
 */
export const BRAND_ACCENTS: readonly { id: string; name: string; hex: string; bgClass: string }[] = [
  { id: "gold", name: "Bhagya Gold", hex: "#C49A45", bgClass: "bg-[#C49A45]" },
  { id: "ochre", name: "Deep Ochre", hex: "#9A6A20", bgClass: "bg-[#9A6A20]" },
  { id: "forest", name: "Forest Moss", hex: "#2F5E3D", bgClass: "bg-[#2F5E3D]" },
  { id: "terracotta", name: "Terracotta Rust", hex: "#A04B32", bgClass: "bg-[#A04B32]" },
  { id: "indigo", name: "Indigo Clay", hex: "#2C3E50", bgClass: "bg-[#2C3E50]" },
  { id: "charcoal", name: "Noble Charcoal", hex: "#2A2A2A", bgClass: "bg-[#2A2A2A]" },
] as const;
