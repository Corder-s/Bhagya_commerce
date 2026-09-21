/**
 * Demo data barrel.
 *
 * Everything the storefront currently renders comes from this folder, which is
 * deliberately the only place that knows the data is fake. Phase 2 replaces
 * these exports with `src/services/*` fetches; pages and components import the
 * same names, so the switch stays contained.
 *
 * Contract: `@/types/catalogue`.
 */
export { categories, getCategory } from "@/data/categories";
export { brands, getBrand } from "@/data/brands";
export {
  collections,
  featuredCollection,
  getCollection,
} from "@/data/collections";
export {
  journalCategories,
  journalPosts,
  getJournalPost,
} from "@/data/journal";
export {
  products,
  productBuckets,
  getProductBySlug,
  getProductsByBucket,
  getProductsBySlugs,
} from "@/data/products";
export {
  aiCapabilities,
  aiConversation,
  aiRecommendationSlugs,
  aiStarterPrompts,
} from "@/data/ai";
