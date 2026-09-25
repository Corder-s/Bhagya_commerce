"use client";

import {
  ArrowRight,
  CheckCircle2,
  Copy,
  ExternalLink,
  LayoutDashboard,
  ShoppingBag,
  Sparkles,
  Store as StoreIcon,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Store } from "@/features/merchant/merchant-types";
import { toast } from "@/lib/toast";

export function CompleteStep({ store }: { store: Store }) {
  const [copied, setCopied] = React.useState(false);
  const storeUrl = `https://bhagya.in/store/${store.slug}`;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(storeUrl);
      setCopied(true);
      toast.success("Link Copied", "Store link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6 text-center py-4">
      {/* Celebration Icon */}
      <div className="mx-auto size-20 rounded-full bg-[#C49A45]/20 border-2 border-[#C49A45] flex items-center justify-center text-[#9A6A20] dark:text-[#C49A45] shadow-md animate-in fade-in zoom-in duration-300">
        <Sparkles className="size-10" />
      </div>

      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2F5E3D]/15 text-[#2F5E3D] text-xs font-semibold border border-[#2F5E3D]/30">
          <CheckCircle2 className="size-3.5" />
          Store Successfully Launched
        </div>

        <h1 className="font-display text-display-md font-bold text-ink">
          Welcome to Bhagya Commerce, {store.name}!
        </h1>

        <p className="text-body-md text-ink-soft max-w-lg mx-auto">
          Your merchant workspace is ready. You can now list handcrafted products, manage orders, and connect with conscious customers across India.
        </p>
      </div>

      {/* Store URL Card */}
      <Card variant="surface" padding="md" radius="xl" className="max-w-xl mx-auto border-line shadow-card text-left">
        <CardContent className="space-y-3 p-1">
          <div className="flex items-center justify-between">
            <span className="text-caption font-semibold text-ink-soft uppercase tracking-wider">
              Your Public Store Link
            </span>
            <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#C49A45]/20 text-[#9A6A20] dark:text-[#C49A45]">
              {store.categoryName || "Artisan Store"}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-surface-subtle border border-line gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <StoreIcon className="size-4 text-[#C49A45] shrink-0" />
              <span className="font-mono text-body-sm font-semibold text-ink truncate">
                {storeUrl}
              </span>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="shrink-0 text-xs"
            >
              <Copy className="size-3.5" />
              {copied ? "Copied!" : "Copy Link"}
            </Button>
          </div>

          <p className="text-caption text-ink-faint">
            Share this link on your social channels, customer WhatsApp groups, and packaging inserts.
          </p>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        <Button asChild variant="primary" size="lg" className="w-full sm:w-auto">
          <Link href={"/merchant/dashboard" as any}>
            <LayoutDashboard className="size-4" />
            Open Merchant Workspace
            <ArrowRight className="size-4" />
          </Link>
        </Button>

        <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
          <Link href={"/shop" as any}>
            <ShoppingBag className="size-4" />
            Continue Shopping
          </Link>
        </Button>
      </div>
    </div>
  );
}
