import * as React from "react";

import { ProductCard, ProductCardSkeleton } from "@/features/products/product-card";
import { marketingRoutes } from "@/config/routes";
import { cn } from "@/lib/utils";
import type { ProductSummary } from "@/types/catalogue";

/**
 * ProductGrid — the responsive product layout.
 *
 * Two columns on phones (the smallest comfortable comparison unit), three on
 * tablets, four on desktop. Cards are equal-height through the grid row, so a
 * long product name never breaks the rhythm of the row.
 */
export function ProductGrid({
  products,
  className,
  columns = 4,
}: {
  products: readonly ProductSummary[];
  className?: string;
  /** Desktop column count; mobile stays at two. */
  columns?: 3 | 4;
}) {
  return (
    <ul
      className={cn(
        "grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-5 lg:gap-x-6",
        columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3",
        className,
      )}
    >
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} href={marketingRoutes.shop} />
        </li>
      ))}
    </ul>
  );
}

/** Loading shape for the same grid. */
export function ProductGridSkeleton({
  count = 4,
  className,
  columns = 4,
}: {
  count?: number;
  className?: string;
  columns?: 3 | 4;
}) {
  return (
    <ul
      aria-hidden="true"
      className={cn(
        "grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-5 lg:gap-x-6",
        columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3",
        className,
      )}
    >
      {Array.from({ length: count }, (_, index) => (
        <li key={index}>
          <ProductCardSkeleton />
        </li>
      ))}
    </ul>
  );
}
