import type { BrandSummary } from "@/types/catalogue";

/**
 * Demo brand directory.
 *
 * Explicitly demonstration data — the maker names, crafts and regions below are
 * written for layout and copy testing, and are not real companies. No
 * certifications, audits or impact claims are attached to them, and none should
 * be invented when this is replaced by `GET /api/v1/brands`, which returns the
 * same record shape with verification state supplied by the merchant service.
 */
export const brands: readonly BrandSummary[] = [
  {
    slug: "loom-and-land",
    name: "Loom & Land",
    monogram: "LL",
    craft: "Handloom textiles",
    region: "Bhagalpur, Bihar",
    blurb: "Handwoven cotton and silk from weaver families running the same pit looms for three generations.",
  },
  {
    slug: "sattva-farms",
    name: "Sattva Farms",
    monogram: "SF",
    craft: "Organic staples",
    region: "Tiptur, Karnataka",
    blurb: "Millets, pulses and cold-pressed oils from a farmer collective that sells what it grows.",
  },
  {
    slug: "veda-root",
    name: "Veda Root",
    monogram: "VR",
    craft: "Ayurveda",
    region: "Nagpur, Maharashtra",
    blurb: "Small-batch churnas and infused oils, prepared by weight and by season in a family workshop.",
  },
  {
    slug: "neer-herbals",
    name: "Neer Herbals",
    monogram: "NH",
    craft: "Natural skincare",
    region: "Puducherry",
    blurb: "Cold-pressed oils and floral waters, blended in batches small enough to be dated by hand.",
  },
  {
    slug: "mitti-studio",
    name: "Mitti Studio",
    monogram: "MS",
    craft: "Studio pottery",
    region: "Khurja, Uttar Pradesh",
    blurb: "Hand-thrown terracotta and stoneware, glazed with recipes the studio mixes itself.",
  },
  {
    slug: "nira",
    name: "Nira",
    monogram: "NR",
    craft: "Low-waste everyday",
    region: "Kochi, Kerala",
    blurb: "Bamboo, cork and jute goods built to replace the single-use plastic in a daily routine.",
  },
  {
    slug: "bhagya-organics",
    name: "Bhagya Organics",
    monogram: "BO",
    craft: "Pure botanicals & incense",
    region: "Varanasi, Uttar Pradesh",
    blurb: "Charcoal-free temple flower incense, organic camphor, and cold-pressed pure havan samagri.",
  },
  {
    slug: "dhara-craft",
    name: "Dhara Craft",
    monogram: "DC",
    craft: "Handcarved wood & brass",
    region: "Saharanpur, Uttar Pradesh",
    blurb: "Reclaimed seasoned shisham wood and pure bell-metal brassware crafted by heritage artisan guilds.",
  },
  {
    slug: "beej-and-mitti",
    name: "Beej & Mitti",
    monogram: "BM",
    craft: "Heirloom seeds & soil",
    region: "Pune, Maharashtra",
    blurb: "Native open-pollinated seeds and microbial compost mixes formulated for home balcony food forests.",
  },
] as const;

export function getBrand(slug: string): BrandSummary | undefined {
  return brands.find((brand) => brand.slug === slug);
}
