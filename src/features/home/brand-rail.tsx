import { ArrowRight } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { RevealGroup, RevealItem } from "@/components/common/reveal";
import { SectionHeading } from "@/components/layout/section-heading";
import { BrandCard } from "@/features/brands/brand-card";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/ui/section";
import { marketingRoutes } from "@/config/routes";
import { brands } from "@/data/brands";

/**
 * BrandRail — "Brands worth discovering".
 *
 * A horizontal discovery rail: the makers are the reason this marketplace
 * exists, and a rail presents them as a set to move through rather than a grid
 * to exhaust. Phones scroll it with snap; from `sm` up it becomes a scrollable
 * three-up, and on wide screens four.
 *
 * The demo-data notice is part of the UI on purpose: these are placeholder
 * makers, and saying so is cheaper than being mistaken for a claim.
 */
export function BrandRail() {
  return (
    <Section id="brands" surface="ivory" label="Featured brands" className="scroll-mt-24">
      <SectionHeading
        eyebrow="Independent makers"
        title="Brands worth discovering"
        description="Small studios, family workshops and farmer collectives — the people behind the products."
        action={{ label: "All brands", href: marketingRoutes.brands }}
      />

      <RevealGroup
        as="ul"
        className={[
          "mt-9 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3",
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          "sm:grid sm:grid-cols-2 lg:grid-cols-4",
          "sm:overflow-x-auto lg:overflow-x-auto",
        ].join(" ")}
      >
        {brands.map((brand) => (
          <RevealItem
            key={brand.slug}
            as="li"
            className="w-[80%] shrink-0 snap-start sm:w-[22rem] lg:w-[20rem]"
          >
            <BrandCard brand={brand} className="h-full" />
          </RevealItem>
        ))}
      </RevealGroup>

      <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
        <Badge tone="outline" size="md" className="border-line-strong bg-surface">
          Demo makers
        </Badge>
        <span className="text-caption text-ink-soft">
          Placeholder names shown while the brand directory is connected — no
          certifications are claimed for them.
        </span>
        <Link
          href={marketingRoutes.brands}
          className="inline-flex items-center gap-1.5 text-caption font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 sm:ml-auto"
        >
          Browse the directory
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </p>
    </Section>
  );
}
