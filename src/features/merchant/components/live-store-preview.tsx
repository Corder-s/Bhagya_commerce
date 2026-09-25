"use client";

import { CheckCircle2, Globe, Sparkles, Store as StoreIcon } from "lucide-react";
import Image from "next/image";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { MerchantOnboardingData } from "@/features/merchant/merchant-types";
import { MERCHANT_CATEGORIES } from "@/features/merchant/merchant-utils";

export function LiveStorePreview({
  data,
  className,
}: {
  data: Partial<MerchantOnboardingData>;
  className?: string;
}) {
  const storeName = data.storeName?.trim() || data.businessName?.trim() || "Your Store Name";
  const slug = data.storeSlug?.trim() || "your-store";
  const tagline = data.storeTagline?.trim() || "Handcrafted with traditional Indian mastery";
  const description =
    data.storeDescription?.trim() ||
    "Tell customers your brand story, craft legacy, and sustainable commitments here.";

  const category = MERCHANT_CATEGORIES.find((c) => c.id === data.primaryCategoryId);
  const categoryName = category?.name || "Handmade & Crafts";

  const brandAccent = data.brandAccent || "#C49A45";

  // Initials for avatar
  const initials = storeName
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || "")
    .join("");

  return (
    <div className={className}>
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-ink-soft uppercase tracking-wider">
          <Sparkles className="size-3.5 text-[#C49A45]" />
          <span>Live Storefront Preview</span>
        </div>
        <Badge tone="outline" size="sm" className="text-[10px] text-ink-soft font-mono">
          bhagya.in/store/{slug}
        </Badge>
      </div>

      <Card variant="surface" padding="none" radius="xl" className="overflow-hidden border-line shadow-card">
        {/* Banner Area */}
        <div className="relative h-32 sm:h-40 w-full overflow-hidden bg-[#1E1E1C]">
          {data.bannerUrl ? (
            <Image
              src={data.bannerUrl}
              alt="Store Banner Preview"
              fill
              unoptimized
              className="object-cover"
            />
          ) : (
            <div
              className="h-full w-full flex items-center justify-center relative opacity-90"
              style={{
                background: `linear-gradient(135deg, #1A1A18 0%, #2A261E 50%, #151515 100%)`,
              }}
            >
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C49A45_1px,transparent_1px)] [background-size:16px_16px]" />
              <StoreIcon className="size-10 text-white/20" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Category Tag Top-Right */}
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-black/60 backdrop-blur-md text-white/90 border border-white/10 shadow-xs">
              {categoryName}
            </span>
          </div>
        </div>

        {/* Store Header Info */}
        <CardContent className="p-5 relative pt-0">
          {/* Logo overlapping banner */}
          <div className="-mt-10 mb-4 flex items-end justify-between">
            <div
              className="size-20 rounded-2xl border-4 border-surface bg-surface shadow-md overflow-hidden relative flex items-center justify-center"
              style={{ borderColor: "#FFFFFF" }}
            >
              {data.logoUrl ? (
                <Image
                  src={data.logoUrl}
                  alt="Store Logo"
                  fill
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <div
                  className="size-full flex items-center justify-center font-display text-xl font-bold text-white"
                  style={{ backgroundColor: brandAccent }}
                >
                  {initials || "BG"}
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-xs text-ink-soft bg-surface-subtle px-2.5 py-1 rounded-lg border border-line">
              <CheckCircle2 className="size-3.5 text-[#2F5E3D]" />
              <span className="font-medium text-ink">Verified Maker</span>
            </div>
          </div>

          {/* Brand Details */}
          <div className="space-y-2">
            <div className="flex items-baseline justify-between gap-2">
              <h4 className="font-display text-heading-lg font-bold text-ink leading-tight">
                {storeName}
              </h4>
            </div>

            <p className="text-body-sm font-medium text-[#9A6A20] dark:text-[#C49A45]">
              {tagline}
            </p>

            <p className="text-caption text-ink-soft line-clamp-3 leading-relaxed">
              {description}
            </p>

            {/* Specialty Tags */}
            {data.specialtyTags && data.specialtyTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {data.specialtyTags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-surface-subtle text-ink-soft border border-line font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Footer URL representation */}
            <div className="pt-4 border-t border-line/60 flex items-center justify-between text-caption text-ink-faint">
              <span className="flex items-center gap-1.5">
                <Globe className="size-3.5 text-[#C49A45]" />
                <span className="font-mono text-[11px]">bhagya.in/store/{slug}</span>
              </span>
              <span
                className="text-[11px] font-semibold text-[#9A6A20] dark:text-[#C49A45] hover:underline"
              >
                Store preview →
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
