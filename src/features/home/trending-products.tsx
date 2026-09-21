"use client";

import { m } from "framer-motion";
import * as React from "react";

import { SectionHeading } from "@/components/layout/section-heading";
import { ProductGrid } from "@/features/products/product-grid";
import { Section } from "@/components/ui/section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { marketingRoutes } from "@/config/routes";
import { duration, EASE_BRAND } from "@/lib/motion";
import { getProductsByBucket, productBuckets } from "@/data/products";
import { cn } from "@/lib/utils";

/**
 * TrendingProducts — "Discover what people are loving".
 *
 * Tabbed because the four buckets are the same shelf seen four ways, and a
 * tab list is the shortest honest way to say "here is the same grid, reordered".
 * All four panels render their own grid: on phones the grid is two columns, so
 * every panel stays scannable, and switching tabs never reflows the page.
 *
 * Phase 2: replace `getProductsByBucket` with `GET /api/v1/products?bucket=…`,
 * ideally streaming each panel behind Suspense.
 */
export function TrendingProducts() {
  const [bucket, setBucket] = React.useState<string>(productBuckets[0]?.id ?? "for-you");

  return (
    <Section id="trending" surface="ivory" label="Trending products" className="scroll-mt-24">
      <SectionHeading
        eyebrow="Handpicked"
        title="Discover what people are loving"
        description="Small-batch, independent and restocked often — a few things we would keep for ourselves."
        action={{ label: "Shop all", href: marketingRoutes.shop }}
      />

      <Tabs value={bucket} onValueChange={setBucket} className="mt-8">
        <TabsList aria-label="Product collections" className="w-full sm:w-auto">
          {productBuckets.map((item) => (
            <TabsTrigger key={item.id} value={item.id}>
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {productBuckets.map((item) => (
          <TabsContent
            key={item.id}
            value={item.id}
            className={cn("mt-8 focus-visible:outline-offset-8")}
          >
            {/* Keyed by bucket so switching tabs re-mounts the panel and fades
                the new shelf in — the grid changing under the pointer reads as
                a reorder rather than a glitch. */}
            <m.div
              key={item.id}
              initial={{ opacity: 0.35 }}
              animate={{ opacity: 1 }}
              transition={{ duration: duration.fast, ease: EASE_BRAND }}
            >
              <ProductGrid products={getProductsByBucket(item.id)} />
            </m.div>
          </TabsContent>
        ))}
      </Tabs>
    </Section>
  );
}
