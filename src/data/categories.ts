import type { Category } from "@/types/catalogue";

/**
 * Demo category taxonomy.
 *
 * Replace with `GET /api/v1/categories` — the records already carry the fields
 * the endpoint will return. Images are local demo media: drop in CDN URLs from
 * the media library and nothing else changes.
 */
export const categories: readonly Category[] = [
  {
    slug: "organic-food",
    name: "Organic Food",
    descriptor: "Millets, cold-pressed oils and pantry staples",
    tone: "soft-green",
    image: {
      src: "/images/categories/organic-food.jpg",
      alt: "Unpolished millet grain in a small brass bowl beside a folded cotton pouch",
      width: 880,
      height: 660,
    },
  },
  {
    slug: "ayurveda",
    name: "Ayurveda",
    descriptor: "Classical formulations, small-batch prepared",
    tone: "sand",
    image: {
      src: "/images/categories/ayurveda.jpg",
      alt: "Brass mortar and pestle with dried ashwagandha root and a jar of herbal churna",
      width: 880,
      height: 660,
    },
  },
  {
    slug: "personal-care",
    name: "Personal Care",
    descriptor: "Skin, hair and body, made without shortcuts",
    tone: "canvas",
    image: {
      src: "/images/categories/personal-care.jpg",
      alt: "Amber glass bottle of herbal face oil with a cotton pad and dried rose petal",
      width: 880,
      height: 660,
    },
  },
  {
    slug: "home-living",
    name: "Home & Living",
    descriptor: "Handloom, stoneware and honest materials",
    tone: "soft-green",
    image: {
      src: "/images/categories/home-living.jpg",
      alt: "Handwoven cotton throw folded over a stoneware vase holding dried grasses",
      width: 880,
      height: 660,
    },
  },
  {
    slug: "wellness",
    name: "Wellness",
    descriptor: "Everyday rituals for body and breath",
    tone: "sand",
    image: {
      src: "/images/categories/wellness.jpg",
      alt: "Rolled cork and cotton yoga mat with a copper bottle and a small brass singing bowl",
      width: 880,
      height: 660,
    },
  },
  {
    slug: "eco-friendly",
    name: "Eco-Friendly",
    descriptor: "Low-waste swaps for daily routines",
    tone: "soft-green",
    image: {
      src: "/images/categories/eco-friendly.jpg",
      alt: "Bamboo toothbrush, wooden comb and a small jute tote bag on ivory linen",
      width: 880,
      height: 660,
    },
  },
  {
    slug: "spiritual",
    name: "Spiritual",
    descriptor: "Ritual objects for a home mandir",
    tone: "sand",
    // Photography pending — the card renders its botanical tile instead.
    image: null,
  },
  {
    slug: "handmade",
    name: "Handmade",
    descriptor: "Thrown, woven, carved and block-printed",
    tone: "deep",
    image: null,
  },
] as const;

/** Category lookup for cards, breadcrumbs and (later) shop facets. */
export function getCategory(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}
