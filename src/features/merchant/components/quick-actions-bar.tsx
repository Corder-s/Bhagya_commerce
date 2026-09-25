"use client";

import { Boxes, ExternalLink, PackagePlus, ReceiptIndianRupee, Sparkles, Store } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function QuickActionsBar({
  onAddProduct,
  storeSlug,
}: {
  onAddProduct?: () => void;
  storeSlug?: string;
}) {
  return (
    <Card variant="surface" padding="md" radius="xl" className="border-line shadow-card bg-surface">
      <CardContent className="flex flex-wrap items-center justify-between gap-3 p-1">
        <div className="flex items-center gap-2">
          <span className="text-caption font-bold uppercase tracking-wider text-ink-soft">
            Quick Actions
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {onAddProduct ? (
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={onAddProduct}
              className="gap-1.5"
            >
              <PackagePlus className="size-4" />
              <span>Add Product</span>
            </Button>
          ) : (
            <Button asChild variant="primary" size="md" className="gap-1.5">
              <Link href={"/merchant/products" as any}>
                <PackagePlus className="size-4" />
                <span>Add Product</span>
              </Link>
            </Button>
          )}

          <Button asChild variant="outline" size="md" className="gap-1.5">
            <Link href={"/merchant/orders" as any}>
              <ReceiptIndianRupee className="size-4" />
              <span>Orders</span>
            </Link>
          </Button>

          <Button asChild variant="outline" size="md" className="gap-1.5">
            <Link href={"/merchant/inventory" as any}>
              <Boxes className="size-4" />
              <span>Inventory</span>
            </Link>
          </Button>

          <Button asChild variant="outline" size="md" className="gap-1.5">
            <Link href={"/merchant/store" as any}>
              <Store className="size-4 text-[#C49A45]" />
              <span>View Store</span>
            </Link>
          </Button>

          <Button asChild variant="outline" size="md" className="gap-1.5 border-[#C49A45]/40 text-[#9A6A20] dark:text-[#C49A45] hover:border-[#C49A45]">
            <Link href={"/merchant/ai" as any}>
              <Sparkles className="size-4 text-[#C49A45]" />
              <span>Ask AI Copilot</span>
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
