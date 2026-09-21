import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { MediaTile } from "@/components/common/media-tile";
import { RevealGroup, RevealItem } from "@/components/common/reveal";
import { SectionHeading } from "@/components/layout/section-heading";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/ui/section";
import { marketingRoutes } from "@/config/routes";
import { collections } from "@/data/collections";
import { cn } from "@/lib/utils";
import type { CollectionSummary } from "@/types/catalogue";

/**
 * TodaysEdit — "Today's edit", a second, lighter editorial moment.
 *
 * Placed between the two product-heavy sections so the page breathes: one tall
 * lead panel with two stacked panels beside it, each a *collection* rather than
 * a product. The asymmetry is deliberate — an equal three-up here would read as
 * a second product grid.
 *
 * Layout note: the two stacked panels are flex children of a column that matches
 * the lead's height, so their heights divide whatever the lead occupies instead
 * of each holding a fixed ratio and leaving slack underneath.
 */
export function TodaysEdit() {
  const [lead, ...rest] = collections;

  if (!lead) return null;

  return (
    <Section id="todays-edit" surface="sand" label="Today's edit" className="scroll-mt-24">
      <SectionHeading
        eyebrow="Today's edit"
        title="Three collections, one idea each"
        description="Edits our curators put together this week — a material, a season, a way of eating."
        variant="heading"
        action={{ label: "All collections", href: marketingRoutes.collections }}
      />

      <RevealGroup className="mt-9 grid gap-5 lg:grid-cols-2">
        <RevealItem className="lg:min-h-0">
          <CollectionPanel collection={lead} size="lead" />
        </RevealItem>

        {/* Two equal rows that stretch to the lead's height: at lg the panels
            have no aspect ratio of their own, so the row height is decided by
            the lead and the supporting panels divide it evenly. */}
        <div className="grid gap-5 lg:h-full lg:min-h-0 lg:grid-rows-2">
          {rest.map((collection) => (
            <RevealItem key={collection.slug} className="lg:min-h-0">
              <CollectionPanel collection={collection} size="compact" />
            </RevealItem>
          ))}
        </div>
      </RevealGroup>
    </Section>
  );
}

function CollectionPanel({
  collection,
  size,
}: {
  collection: CollectionSummary;
  size: "lead" | "compact";
}) {
  const lead = size === "lead";

  return (
    <article className="group h-full">
      <Link
        href={marketingRoutes.collections}
        className={cn(
          "relative flex flex-col justify-end overflow-hidden rounded-lg",
          "focus-visible:outline-2 focus-visible:outline-offset-2",
          // `max-lg:` rather than overriding `aspect-*` at lg: both classes set
          // aspect-ratio, and which wins would depend on Tailwind's property
          // order rather than on intent.
          lead
            ? "aspect-4/5 sm:max-lg:aspect-16/12 lg:aspect-4/5"
            : "max-lg:aspect-16/9 lg:h-full",
          collection.image ? "bg-canvas-deep" : undefined,
        )}
      >
        <span className="absolute inset-0">
          {collection.image ? (
            <Image
              src={collection.image.src}
              alt={collection.image.alt}
              fill
              sizes="(min-width: 1024px) 48vw, 100vw"
              className="object-cover transition-transform duration-slow ease-brand group-hover:scale-[1.03]"
            />
          ) : (
            /* No label: the overlay below already names the collection. */
            <MediaTile tone={collection.tone} />
          )}
        </span>

        {/* Copy over a scrim, so it stays legible on any photograph or tone. */}
        <span className="relative flex flex-col gap-1.5 bg-gradient-to-t from-deep/90 via-deep/55 to-transparent p-5 text-ink-inverse">
          <span className="flex items-center gap-2">
            <Badge tone="outline" size="sm" className="border-line-inverse text-ink-inverse">
              {lead ? "Featured" : "Collection"}
            </Badge>
          </span>
          <span
            className={cn(
              "font-display font-medium",
              lead ? "text-display-md" : "text-heading-xl",
            )}
          >
            {collection.name}
          </span>
          <span className="flex items-end justify-between gap-4">
            <span className="max-w-md text-body-sm text-ink-inverse-soft">
              {collection.description}
            </span>
            <ArrowUpRight
              className="mb-1 size-4 shrink-0 transition-transform duration-fast group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </span>
        </span>
      </Link>
    </article>
  );
}
