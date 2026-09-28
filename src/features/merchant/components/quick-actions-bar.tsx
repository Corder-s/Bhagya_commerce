"use client";

import { Boxes, ExternalLink, PackagePlus, Palette, ReceiptIndianRupee, Sparkles, Store } from "lucide-react";
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
    <div className="rounded-2xl border border-[#DDD4C4] dark:border-[#47362E] bg-[#FFFCF6] dark:bg-[#261B15] p-4 sm:p-5 shadow-[0_2px_10px_rgba(50,40,25,0.05)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-caption font-bold uppercase tracking-wider text-[#68736B] dark:text-[#A69E92]">
            Quick Actions
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {onAddProduct ? (
            <Button
              type="button"
              size="md"
              onClick={onAddProduct}
              className="gap-1.5 bg-[#E0A046] hover:bg-[#CC8930] text-[#241F19] font-bold border-0 shadow-xs transition-all"
            >
              <PackagePlus className="size-4" />
              <span>Add Product</span>
            </Button>
          ) : (
            <Button asChild size="md" className="gap-1.5 bg-[#E0A046] hover:bg-[#CC8930] text-[#241F19] font-bold border-0 shadow-xs transition-all">
              <Link href={"/merchant/products" as any}>
                <PackagePlus className="size-4" />
                <span>Add Product</span>
              </Link>
            </Button>
          )}

          <Button asChild size="md" className="gap-1.5 font-semibold text-[#4F5952] dark:text-[#CFC7BA] border border-[#DDD4C4] dark:border-[#47362E] bg-[#FFFCF6] dark:bg-[#261B15] hover:bg-[#F0ECE3] dark:hover:bg-[#30231C] hover:text-[#252923] dark:hover:text-[#FFFFFF] transition-all">
            <Link href={"/merchant/orders" as any}>
              <ReceiptIndianRupee className="size-4 text-[#708477] dark:text-[#A8B9AF]" />
              <span>Orders</span>
            </Link>
          </Button>

          <Button asChild size="md" className="gap-1.5 font-semibold text-[#4F5952] dark:text-[#CFC7BA] border border-[#DDD4C4] dark:border-[#47362E] bg-[#FFFCF6] dark:bg-[#261B15] hover:bg-[#F0ECE3] dark:hover:bg-[#30231C] hover:text-[#252923] dark:hover:text-[#FFFFFF] transition-all">
            <Link href={"/merchant/inventory" as any}>
              <Boxes className="size-4 text-[#708477] dark:text-[#A8B9AF]" />
              <span>Inventory</span>
            </Link>
          </Button>

          <Button asChild size="md" className="gap-1.5 font-semibold text-[#4F5952] dark:text-[#CFC7BA] border border-[#DDD4C4] dark:border-[#47362E] bg-[#FFFCF6] dark:bg-[#261B15] hover:bg-[#F0ECE3] dark:hover:bg-[#30231C] hover:text-[#252923] dark:hover:text-[#FFFFFF] transition-all">
            <Link href={"/merchant/storefront" as any}>
              <Palette className="size-4 text-[#D6A23A]" />
              <span>Storefront</span>
            </Link>
          </Button>

          <Button asChild size="md" className="gap-1.5 font-semibold text-[#4F5952] dark:text-[#CFC7BA] border border-[#DDD4C4] dark:border-[#47362E] bg-[#FFFCF6] dark:bg-[#261B15] hover:bg-[#F0ECE3] dark:hover:bg-[#30231C] hover:text-[#252923] dark:hover:text-[#FFFFFF] transition-all">
            <Link href={"/merchant/store" as any}>
              <Store className="size-4 text-[#708477] dark:text-[#A8B9AF]" />
              <span>Settings</span>
            </Link>
          </Button>

          <Button asChild size="md" className="gap-1.5 font-semibold text-[#4F5952] dark:text-[#CFC7BA] border border-[#DDD4C4] dark:border-[#47362E] bg-[#FFFCF6] dark:bg-[#261B15] hover:bg-[#F0ECE3] dark:hover:bg-[#30231C] hover:text-[#252923] dark:hover:text-[#FFFFFF] transition-all">
            <Link href={"/merchant/ai" as any}>
              <Sparkles className="size-4 text-[#D6A23A]" />
              <span>Ask AI Copilot</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
