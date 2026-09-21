import { ArrowRight } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { RevealGroup, RevealItem } from "@/components/common/reveal";
import { SectionHeading } from "@/components/layout/section-heading";
import { CategoryCard } from "@/features/categories/category-card";
import { Section } from "@/components/ui/section";
import { marketingRoutes } from "@/config/routes";
import { categories } from "@/data/categories";

/**
 * CategoryRail — "Explore conscious living".
 *
 * Phones get a horizontal scroll rail with snap points rather than a stacked
 * grid: eight categories as full-width rows is a lot of vertical scrolling
 * before any product appears. From `sm` up it becomes a normal grid. The rail
 * is keyboard-scrollable and every card is a link, so it is usable without
 * swiping.
 */
export function CategoryRail() {
  return (
    <Section id="categories" surface="ivory" label="Explore categories" className="scroll-mt-24">
      <SectionHeading
        eyebrow="Browse"
        title="Explore conscious living"
        description="Thoughtfully selected products for everyday life."
        action={{ label: "All products", href: marketingRoutes.shop }}
      />

      <RevealGroup
        as="ul"
        className={[
          "mt-9 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2",
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          "sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:pb-0 lg:grid-cols-4",
        ].join(" ")}
      >
        {categories.map((category) => (
          <RevealItem
            key={category.slug}
            as="li"
            className="w-[74%] shrink-0 snap-start sm:w-auto sm:shrink"
          >
            <CategoryCard category={category} />
          </RevealItem>
        ))}
      </RevealGroup>

      {/* Rail affordance for phones: the grid takes over at sm. */}
      <p className="mt-3 flex items-center gap-1.5 text-caption text-ink-faint sm:hidden">
        Swipe for more categories
        <ArrowRight className="size-3.5" aria-hidden="true" />
      </p>

      <p className="sr-only sm:hidden">
        <Link href={marketingRoutes.shop}>
          See all categories and products
        </Link>
      </p>
    </Section>
  );
}
