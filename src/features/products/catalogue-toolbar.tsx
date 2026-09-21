"use client";

import { SlidersHorizontal } from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const categories = [
  "All",
  "Home & Living",
  "Kitchen",
  "Textiles",
  "Wellness",
  "Food",
  "Stationery",
] as const;

/**
 * CatalogueToolbar — the shop's category segments, result count and filter entry.
 *
 * Phase 1 renders it inert (`disabled`) and says so, rather than letting a user
 * click a filter that silently does nothing. The component owns its own state
 * shape already, so Phase 2 only has to replace the disabled handlers with
 * query-param updates.
 */
export function CatalogueToolbar({
  resultCount,
  className,
}: {
  /** `null` while no catalogue exists — renders "Catalogue pending". */
  resultCount?: number | null;
  className?: string;
}) {
  const [category, setCategory] = React.useState<(typeof categories)[number]>("All");

  return (
    <div
      className={cn(
        "flex flex-col gap-4 border-b border-line pb-5 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
        <Tabs
          value={category}
          onValueChange={(value) => setCategory(value as typeof category)}
        >
          <TabsList aria-label="Product categories">
            {categories.map((item) => (
              <TabsTrigger key={item} value={item} disabled>
                {item}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <Badge tone="neutral" size="md">
          {resultCount == null ? "Catalogue pending" : `${resultCount} products`}
        </Badge>
        <Button variant="outline" size="md" disabled>
          <SlidersHorizontal aria-hidden="true" />
          Filters
        </Button>
      </div>
    </div>
  );
}
