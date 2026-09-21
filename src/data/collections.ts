import type { CollectionSummary } from "@/types/catalogue";

/**
 * Demo collections.
 *
 * Replace with `GET /api/v1/collections`. `conscious-living` is the one the home
 * page features; the others exist so the collections route has something real to
 * build against in Phase 2.
 */
export const collections: readonly CollectionSummary[] = [
  {
    slug: "conscious-living",
    name: "Conscious Living",
    description:
      "Discover products created with thoughtful ingredients, traditional knowledge and a lighter footprint.",
    image: {
      src: "/images/collections/conscious-living.jpg",
      alt: "Sunlit corner of a home with a handwoven throw, terracotta pots and dried grasses",
      width: 1100,
      height: 1375,
    },
    tone: "soft-green",
  },
  {
    slug: "handloom-at-home",
    name: "Handloom at Home",
    description: "Throws, runners and textiles woven on handlooms, bought directly from the loom.",
    image: null,
    tone: "deep",
  },
  {
    slug: "millets-and-morning",
    name: "Millets & Morning",
    description: "Breakfast staples built on millets, stone-ground flours and cold-pressed oils.",
    image: null,
    tone: "sand",
  },
] as const;

/** The collection featured on the home page. */
export const featuredCollection: CollectionSummary =
  collections.find((collection) => collection.slug === "conscious-living") ?? collections[0];

export function getCollection(slug: string): CollectionSummary | undefined {
  return collections.find((collection) => collection.slug === slug);
}
