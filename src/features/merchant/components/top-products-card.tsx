"use client";

import { ArrowRight, Package, TrendingUp } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { TopProduct } from "@/features/merchant/dashboard-types";
import { formatPrice } from "@/lib/format";

export function TopProductsCard({ products }: { products: TopProduct[] }) {
  return (
    <Card variant="surface" padding="none" radius="xl" className="border-line shadow-card overflow-hidden">
      <div className="flex items-center justify-between p-4 sm:p-5 border-b border-line bg-surface">
        <div className="flex items-center gap-2">
          <TrendingUp className="size-4 text-[#C49A45]" />
          <h3 className="text-body-sm font-bold uppercase tracking-wider text-ink">
            Top Performing Products
          </h3>
        </div>

        <Button asChild variant="ghost" size="sm" className="text-xs text-[#9A6A20] dark:text-[#C49A45] hover:underline">
          <Link href={"/merchant/products" as any}>
            Catalogue
            <ArrowRight className="size-3" />
          </Link>
        </Button>
      </div>

      <div className="divide-y divide-line bg-surface">
        {products.map((product, index) => (
          <div key={product.id} className="p-4 flex items-center justify-between gap-3 hover:bg-surface-subtle/40 transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <span className="size-6 rounded-full bg-surface-subtle border border-line text-caption font-bold text-ink-soft flex items-center justify-center shrink-0">
                {index + 1}
              </span>

              <div className="min-w-0">
                <h4 className="text-body-sm font-semibold text-ink truncate">
                  {product.name}
                </h4>
                <div className="flex items-center gap-2 text-caption text-ink-soft mt-0.5">
                  <span>{product.category}</span>
                  <span>·</span>
                  <span className="font-semibold text-ink">{product.unitsSold} units sold</span>
                </div>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="font-display font-bold text-body-sm text-ink tabular-nums block">
                {formatPrice(product.revenue)}
              </span>
              <span className="text-[11px] text-ink-soft">
                {formatPrice(product.price)} / unit
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
