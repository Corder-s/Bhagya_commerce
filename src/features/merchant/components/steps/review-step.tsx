"use client";

import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Edit2,
  ExternalLink,
  Globe,
  Loader2,
  Palette,
  ShieldCheck,
  Sparkles,
  Store as StoreIcon,
  Tag,
} from "lucide-react";
import Image from "next/image";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import type { MerchantOnboardingData, OnboardingStepId } from "@/features/merchant/merchant-types";
import { BUSINESS_TYPES, MERCHANT_CATEGORIES } from "@/features/merchant/merchant-utils";

export function ReviewStep({
  data,
  onEditStep,
  onSubmit,
  isSubmitting,
  onBack,
  error,
}: {
  data: MerchantOnboardingData;
  onEditStep: (stepId: OnboardingStepId) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  onBack: () => void;
  error?: string | null;
}) {
  const [agreed, setAgreed] = React.useState(data.agreedToCharter ?? true);
  const [termsError, setTermsError] = React.useState("");

  const businessTypeObj = BUSINESS_TYPES.find((b) => b.value === data.businessType);
  const categoryObj = MERCHANT_CATEGORIES.find((c) => c.id === data.primaryCategoryId);

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      setTermsError("Please agree to the Bhagya Commerce Merchant Charter to continue");
      return;
    }
    onSubmit();
  };

  return (
    <form onSubmit={handleFinalSubmit} className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#C49A45]/20 text-[#9A6A20] dark:text-[#C49A45]">
            Step 5 of 5
          </span>
          <span className="text-caption text-ink-soft">Review & Confirmation</span>
        </div>
        <h2 className="font-display text-heading-xl font-semibold text-ink">
          Review your store before launch
        </h2>
        <p className="text-body-sm text-ink-soft mt-1">
          Verify your business and storefront settings. You can edit any section before launching.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-danger/10 border border-danger/20 text-body-sm text-danger flex items-center gap-2">
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-4">
        {/* 1. Business Summary Card */}
        <Card variant="surface" padding="md" radius="xl" className="border-line shadow-xs">
          <CardContent className="space-y-3 p-1">
            <div className="flex items-center justify-between border-b border-line pb-2.5">
              <div className="flex items-center gap-2">
                <Building2 className="size-4 text-[#C49A45]" />
                <h3 className="text-body-sm font-semibold text-ink">Business Entity</h3>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onEditStep("business")}
                className="text-xs text-[#9A6A20] dark:text-[#C49A45] hover:underline flex items-center gap-1"
              >
                <Edit2 className="size-3" />
                Edit
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-caption">
              <div>
                <span className="text-ink-soft block">Brand / Enterprise Name:</span>
                <span className="text-ink font-semibold">{data.businessName}</span>
              </div>
              <div>
                <span className="text-ink-soft block">Founder / Owner:</span>
                <span className="text-ink font-semibold">{data.ownerName}</span>
              </div>
              <div>
                <span className="text-ink-soft block">Official Email:</span>
                <span className="text-ink font-mono">{data.contactEmail}</span>
              </div>
              <div>
                <span className="text-ink-soft block">Mobile Number:</span>
                <span className="text-ink font-mono">{data.contactPhone}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-ink-soft block">Legal Structure:</span>
                <span className="text-ink font-medium">{businessTypeObj?.label || "Individual"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2. Store Details Summary Card */}
        <Card variant="surface" padding="md" radius="xl" className="border-line shadow-xs">
          <CardContent className="space-y-3 p-1">
            <div className="flex items-center justify-between border-b border-line pb-2.5">
              <div className="flex items-center gap-2">
                <StoreIcon className="size-4 text-[#C49A45]" />
                <h3 className="text-body-sm font-semibold text-ink">Storefront & URL</h3>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onEditStep("store")}
                className="text-xs text-[#9A6A20] dark:text-[#C49A45] hover:underline flex items-center gap-1"
              >
                <Edit2 className="size-3" />
                Edit
              </Button>
            </div>

            <div className="space-y-2 text-caption">
              <div>
                <span className="text-ink-soft block">Store Name:</span>
                <span className="text-ink font-display text-heading-md font-bold">{data.storeName}</span>
              </div>

              <div>
                <span className="text-ink-soft block">Public Store URL:</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface-subtle font-mono text-xs text-ink font-semibold border border-line">
                  <Globe className="size-3 text-[#C49A45]" />
                  bhagya.in/store/{data.storeSlug}
                </span>
              </div>

              {data.storeTagline && (
                <div>
                  <span className="text-ink-soft block">Tagline:</span>
                  <span className="text-ink font-medium">{data.storeTagline}</span>
                </div>
              )}

              <div>
                <span className="text-ink-soft block">Story / Description:</span>
                <p className="text-ink-soft text-[12px] leading-relaxed line-clamp-3">
                  {data.storeDescription}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3. Category & Craft Tags */}
        <Card variant="surface" padding="md" radius="xl" className="border-line shadow-xs">
          <CardContent className="space-y-3 p-1">
            <div className="flex items-center justify-between border-b border-line pb-2.5">
              <div className="flex items-center gap-2">
                <Tag className="size-4 text-[#C49A45]" />
                <h3 className="text-body-sm font-semibold text-ink">Category & Craft Specialty</h3>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onEditStep("category")}
                className="text-xs text-[#9A6A20] dark:text-[#C49A45] hover:underline flex items-center gap-1"
              >
                <Edit2 className="size-3" />
                Edit
              </Button>
            </div>

            <div className="space-y-2 text-caption">
              <div>
                <span className="text-ink-soft block mb-1">Primary Category:</span>
                <span className="px-3 py-1 rounded-full bg-[#C49A45]/15 text-[#9A6A20] dark:text-[#C49A45] font-semibold text-xs border border-[#C49A45]/30">
                  {categoryObj?.name || "Handmade & Crafts"}
                </span>
              </div>

              {data.specialtyTags && data.specialtyTags.length > 0 && (
                <div className="pt-1">
                  <span className="text-ink-soft block mb-1">Specialty Tags:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {data.specialtyTags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md bg-surface-subtle text-ink text-[11px] font-medium border border-line"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 4. Branding Assets */}
        <Card variant="surface" padding="md" radius="xl" className="border-line shadow-xs">
          <CardContent className="space-y-3 p-1">
            <div className="flex items-center justify-between border-b border-line pb-2.5">
              <div className="flex items-center gap-2">
                <Palette className="size-4 text-[#C49A45]" />
                <h3 className="text-body-sm font-semibold text-ink">Branding Assets</h3>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onEditStep("branding")}
                className="text-xs text-[#9A6A20] dark:text-[#C49A45] hover:underline flex items-center gap-1"
              >
                <Edit2 className="size-3" />
                Edit
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <div className="size-14 rounded-xl border border-line bg-surface overflow-hidden relative flex items-center justify-center shrink-0">
                {data.logoUrl ? (
                  <Image src={data.logoUrl} alt="Store Logo" fill unoptimized className="object-cover" />
                ) : (
                  <div
                    className="size-full flex items-center justify-center font-display text-lg font-bold text-white"
                    style={{ backgroundColor: data.brandAccent || "#C49A45" }}
                  >
                    {(data.storeName || "B")[0]?.toUpperCase()}
                  </div>
                )}
              </div>

              <div className="text-caption">
                <p className="font-semibold text-ink">
                  {data.logoUrl ? "Custom Logo Uploaded" : "Generated Brand Monogram"}
                </p>
                <p className="text-ink-soft">
                  {data.bannerUrl ? "Custom Store Banner Uploaded" : "Default Charcoal Artisan Banner"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Merchant Charter Agreement */}
      <div className="p-4 rounded-xl bg-surface border border-line space-y-2">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => {
              setAgreed(e.target.checked);
              if (e.target.checked) setTermsError("");
            }}
            className="mt-1 size-4 rounded-sm border-line text-[#C49A45] accent-[#C49A45]"
          />
          <div className="text-caption text-ink-soft leading-snug">
            <span className="font-medium text-ink">
              I agree to the Bhagya Commerce Merchant Charter
            </span>
            <p className="text-[11px] mt-0.5">
              I certify that all products listed comply with Indian authenticity, artisan provenance, and fair trade standards.
            </p>
          </div>
        </label>
        {termsError && <p className="text-caption text-danger">{termsError}</p>}
      </div>

      {/* Navigation and Final Submit */}
      <div className="flex items-center justify-between pt-4 border-t border-line">
        <Button type="button" variant="outline" size="lg" onClick={onBack} disabled={isSubmitting}>
          <ArrowLeft className="size-4" />
          Back
        </Button>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isSubmitting}
          className="min-w-44"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Creating Store...
            </>
          ) : (
            <>
              <Sparkles className="size-4" />
              Create My Store
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
