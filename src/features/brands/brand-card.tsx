import { MapPin } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { marketingRoutes } from "@/config/routes";
import { cn } from "@/lib/utils";
import type { BrandSummary } from "@/types/catalogue";

/**
 * BrandCard — one maker in the discovery rail.
 *
 * The monogram is set in type rather than a logo image: these are demo records,
 * and inventing a wordmark would misrepresent a maker we have not met yet. The
 * card is not itself a link — the single "Explore" action keeps the tab order
 * short inside a horizontally scrolling rail.
 */
export function BrandCard({
  brand,
  className,
}: {
  brand: BrandSummary;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "flex h-full flex-col gap-4 rounded-lg border border-line bg-surface p-5 sm:p-6",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="grid size-14 shrink-0 place-items-center rounded-md bg-soft-green font-display text-heading-xl text-primary"
      >
        {brand.monogram}
      </span>

      <div className="flex flex-1 flex-col gap-2">
        <h3 className="font-display text-heading-xl text-ink">{brand.name}</h3>

        <p className="text-caption font-medium uppercase tracking-[0.08em] text-ink-faint">
          {brand.craft}
        </p>

        <p className="flex items-center gap-1.5 text-caption text-ink-soft">
          <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
          {brand.region}
        </p>

        <p className="mt-1 text-body-sm text-ink-soft">{brand.blurb}</p>
      </div>

      <Button asChild variant="outline" size="sm" className="mt-1 w-fit">
        <Link href={marketingRoutes.brands}>
          Explore
          <span className="sr-only"> {brand.name}</span>
        </Link>
      </Button>
    </article>
  );
}
