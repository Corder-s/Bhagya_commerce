import type { JournalCategory, JournalPost } from "@/types/catalogue";

/**
 * Demo journal content.
 *
 * Sample articles written to exercise the editorial layout. Replace with
 * `GET /api/v1/journal?category=…`; the CMS will supply `image` from the media
 * library, so two records here carry `image: null` and render a botanical tile
 * until that pipeline exists.
 */
export const journalCategories: readonly JournalCategory[] = [
  "Natural Living",
  "Ayurveda",
  "Wellness",
  "Sustainable Living",
  "Indian Brands",
] as const;

export const journalPosts: readonly JournalPost[] = [
  {
    slug: "a-pit-loom-that-outlived-three-supply-chains",
    title: "A pit loom that outlived three supply chains",
    category: "Indian Brands",
    excerpt:
      "Weaver families in Bhagalpur have watched demand move offshore and come back. What they kept, and what the rest of us lost, is a way of counting time.",
    readingTimeMinutes: 6,
    publishedAt: "2026-08-14",
    image: null,
    tone: "deep",
  },
  {
    slug: "reading-an-ayurvedic-label",
    title: "Reading an Ayurvedic label without the marketing",
    category: "Ayurveda",
    excerpt:
      "Classical formulations name every ingredient and its proportion. Most modern packs name neither. Here is what to look for before the price tag.",
    readingTimeMinutes: 5,
    publishedAt: "2026-08-02",
    image: null,
    tone: "sand",
  },
  {
    slug: "the-quiet-arithmetic-of-a-low-waste-kitchen",
    title: "The quiet arithmetic of a low-waste kitchen",
    category: "Sustainable Living",
    excerpt:
      "A kitchen does not become low-waste in one shopping trip. It becomes low-waste when nine habits replace ten products — and when refills beat packaging.",
    readingTimeMinutes: 7,
    publishedAt: "2026-07-21",
    image: null,
    tone: "sand",
  },
] as const;

export function getJournalPost(slug: string): JournalPost | undefined {
  return journalPosts.find((post) => post.slug === slug);
}
