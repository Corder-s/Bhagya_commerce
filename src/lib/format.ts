/**
 * Formatting helpers. All money formatting is INR-first because Bhagya is an
 * India-first marketplace; `en-IN` grouping (₹1,23,456) is intentional.
 */

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const inrFormatterPrecise = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** ₹1,23,456 — for prices, totals and dashboard figures. */
export function formatPrice(
  value: number | null | undefined,
  { precise = false }: { precise?: boolean } = {},
): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return precise ? inrFormatterPrecise.format(value) : inrFormatter.format(value);
}

/** Standard currency formatter with fallback currency code */
export function formatCurrency(
  value: number | null | undefined,
  currency = "INR",
  { precise = false }: { precise?: boolean } = {},
): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: precise ? 2 : 0,
      minimumFractionDigits: precise ? 2 : 0,
    }).format(value);
  } catch {
    return formatPrice(value, { precise });
  }
}

/** Calculate percentage savings: (mrp - price) / mrp * 100 */
export function calculateDiscountPercentage(
  price: number | null | undefined,
  mrp: number | null | undefined,
): number | null {
  if (!price || !mrp || mrp <= price) return null;
  return Math.round(((mrp - price) / mrp) * 100);
}


/** 1,23,456 — plain Indian-grouped number. */
export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("en-IN").format(value);
}

/** 41.3K / 1.2L style compaction for dashboards. */
export function formatCompact(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("en-IN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatDate(
  input: Date | string | number,
  options: Intl.DateTimeFormatOptions = { dateStyle: "medium" },
): string {
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-IN", options).format(date);
}

/** "3 min read" — journal and editorial surfaces. */
export function formatReadingTime(minutes: number): string {
  return `${Math.max(1, Math.round(minutes))} min read`;
}

/** Turn "Handloom Cottons" into "handloom-cottons". */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(value: string, max = 120): string {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1).trimEnd()}…`;
}

/** Deterministic initials for avatars: "Ananya Rao" → "AR". */
export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/** Percentage change with an explicit sign — never colour-only. */
export function formatDelta(value: number): string {
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";
  return `${sign}${Math.abs(value).toFixed(1)}%`;
}
