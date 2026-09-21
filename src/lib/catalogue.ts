import type { Availability, ProductSummary } from "@/types/catalogue";

/**
 * Catalogue helpers.
 *
 * Presentation maths that the API should never have to ship: percentages and
 * labels derived from fields it already returns.
 */

/**
 * Discount as a whole percentage, or `null` when there is no real reduction.
 *
 * Guards the two ways a discount can be fiction: an MRP at or below the selling
 * price, and a rounding artefact (a 2% saving is not worth a badge).
 */
export function discountPercent(product: Pick<ProductSummary, "priceInr" | "mrpInr">): number | null {
  const { priceInr, mrpInr } = product;
  if (mrpInr == null || mrpInr <= priceInr) return null;
  const percent = Math.round(((mrpInr - priceInr) / mrpInr) * 100);
  return percent >= 5 ? percent : null;
}

/**
 * Availability as words. Stock state is also read by screen readers, so it is
 * never conveyed by colour or a dot alone.
 */
export const availabilityLabel: Record<Availability, string> = {
  "in-stock": "In stock",
  "low-stock": "Low stock",
  "made-to-order": "Made to order",
};

/** Only the two states worth surfacing on a card; "in stock" is the default. */
export function availabilityNote(availability: Availability): string | null {
  return availability === "in-stock" ? null : availabilityLabel[availability];
}

/** `4.6` — one decimal, the way rating is quoted in India. */
export function formatRating(value: number): string {
  return value.toFixed(1);
}

/** Indian-market copy: "1.2k reviews" reads better than "1200" on a card. */
export function formatReviewCount(count: number): string {
  if (count < 1000) return `${count}`;
  return `${(count / 1000).toFixed(count % 1000 === 0 ? 0 : 1)}k`;
}
