/**
 * Catalogue types.
 *
 * These describe the *shape the API will return*, not the shape of any one
 * screen. `src/data/*` holds demo records that already conform to them, so
 * swapping demo data for Spring Boot endpoints is a fetch at the edge of the
 * data layer — no component or prop changes.
 *
 * Money: amounts are integer rupees. Razorpay/Spring Boot will return minor
 * units (paise) as `BigDecimal`; the mapper in the service layer divides by 100
 * before it reaches these types, so the UI never formats fractions it did not
 * ask for.
 */

/** Image reference — mirrors a media-library record. */
export interface MediaRef {
  /** Public path today; an absolute CDN URL once storage moves to R2. */
  src: string;
  /** Always authored, never derived from the product name. */
  alt: string;
  /** Intrinsic size — lets `next/image` reserve space and avoid layout shift. */
  width: number;
  height: number;
}

/** Tile treatment used when a record has no photograph yet. */
export type TileTone = "soft-green" | "sand" | "deep" | "canvas";

export interface Category {
  slug: string;
  name: string;
  /** One line, shop-floor voice. Shown under the name on the card. */
  descriptor: string;
  /** `null` until the media library is wired; the card falls back to a tile. */
  image: MediaRef | null;
  tone: TileTone;
}

export interface BrandSummary {
  slug: string;
  name: string;
  /** Two letters for the monogram tile — never a stand-in for a real logo. */
  monogram: string;
  /** What they make. */
  craft: string;
  /** Where they make it. */
  region: string;
  blurb: string;
}

/**
 * Merchandising buckets a product can belong to.
 *
 * Mirrors the storefront's merchandising API (`?bucket=trending`), so the home
 * tabs and the shop's default sort resolve against the same vocabulary.
 */
export type ProductBucket =
  | "for-you"
  | "trending"
  | "new-arrivals"
  | "best-sellers"
  | "conscious-picks";

export type Availability = "in-stock" | "low-stock" | "made-to-order";

export interface ProductSummary {
  id: string;
  slug: string;
  name: string;
  /** Short editorial line — used on cards and in the AI preview. */
  blurb: string;
  brand: { slug: string; name: string };
  categorySlug: string;
  /** Selling price, integer rupees. */
  priceInr: number;
  /** List price; `null` when the product has never been discounted. */
  mrpInr: number | null;
  /** `null` until reviews exist — the card then omits the rating row entirely. */
  rating: { value: number; count: number } | null;
  image: MediaRef | null;
  /** Optional merchandising flag, e.g. "New". Rendered as a badge. */
  badge?: string;
  availability: Availability;
  /** Buckets this product is merchandised into. */
  buckets: readonly ProductBucket[];
  /** Search and discovery tags */
  tags?: readonly string[];
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified?: boolean;
}

export interface ProductDetail extends ProductSummary {
  description: string;
  gallery: readonly MediaRef[];
  specifications: readonly { label: string; value: string }[];
  shippingInfo: string;
  careInstructions?: string;
  reviewsList: readonly ProductReview[];
}

export type SortOption =
  | "recommended"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "top-rated";

export type PriceFilter =
  | "all"
  | "under-500"
  | "500-1000"
  | "1000-2500"
  | "above-2500";

export type RatingFilter = "all" | "4-plus" | "3-plus";

export interface FilterState {
  category: string;
  brand: string;
  price: PriceFilter;
  rating: RatingFilter;
  availability: string;
  discountOnly: boolean;
}

export interface CollectionSummary {
  slug: string;
  name: string;
  /** Editorial standfirst for the collection page and the home feature. */
  description: string;
  image: MediaRef | null;
  tone: TileTone;
}

export type JournalCategory =
  | "Natural Living"
  | "Ayurveda"
  | "Wellness"
  | "Sustainable Living"
  | "Indian Brands";

export interface JournalPost {
  slug: string;
  title: string;
  category: JournalCategory;
  excerpt: string;
  readingTimeMinutes: number;
  publishedAt: string;
  image: MediaRef | null;
  tone: TileTone;
}

/* ----------------------------- Bhagya AI (preview) ----------------------------- */

export type AssistantRole = "customer" | "assistant";

export interface ConversationTurn {
  id: string;
  role: AssistantRole;
  text: string;
}
