"use client";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  Image as ImageIcon,
  Loader2,
  Palette,
  Sparkles,
  Trash2,
  UploadCloud,
} from "lucide-react";
import Image from "next/image";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { MerchantOnboardingData } from "@/features/merchant/merchant-types";
import { BRAND_ACCENTS } from "@/features/merchant/merchant-utils";
import { objectStorageService } from "@/services/object-storage.service";

export function BrandingStep({
  data,
  onUpdate,
  onNext,
  onBack,
}: {
  data: MerchantOnboardingData;
  onUpdate: (fields: Partial<MerchantOnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [isUploadingLogo, setIsUploadingLogo] = React.useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);

  const logoInputRef = React.useRef<HTMLInputElement>(null);
  const bannerInputRef = React.useRef<HTMLInputElement>(null);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setIsUploadingLogo(true);
    try {
      const res = await objectStorageService.uploadAsset(file, {
        folder: "logos",
        maxSizeBytes: 3 * 1024 * 1024,
      });
      onUpdate({ logoUrl: res.url });
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload logo image");
    } finally {
      setIsUploadingLogo(false);
      if (logoInputRef.current) logoInputRef.current.value = "";
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setIsUploadingBanner(true);
    try {
      const res = await objectStorageService.uploadAsset(file, {
        folder: "banners",
        maxSizeBytes: 5 * 1024 * 1024,
      });
      onUpdate({ bannerUrl: res.url });
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload banner image");
    } finally {
      setIsUploadingBanner(false);
      if (bannerInputRef.current) bannerInputRef.current.value = "";
    }
  };

  const handleRemoveLogo = () => {
    onUpdate({ logoUrl: undefined });
  };

  const handleRemoveBanner = () => {
    onUpdate({ bannerUrl: undefined });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#C49A45]/20 text-[#9A6A20] dark:text-[#C49A45]">
            Step 4 of 5
          </span>
          <span className="text-caption text-ink-soft">Visual Identity & Assets</span>
        </div>
        <h2 className="font-display text-heading-xl font-semibold text-ink">
          Personalize your brand identity
        </h2>
        <p className="text-body-sm text-ink-soft mt-1">
          Upload your logo mark and storefront banner. Your visual identity lives within the Bhagya Warm Ivory design language.
        </p>
      </div>

      {uploadError && (
        <div className="p-3 rounded-xl bg-danger/10 border border-danger/20 text-caption text-danger">
          {uploadError}
        </div>
      )}

      <div className="space-y-6">
        {/* 1. Store Logo */}
        <div>
          <label className="block text-body-sm font-medium text-ink mb-1.5">
            Store Logo Mark <span className="text-caption text-ink-soft">(Recommended: 500×500 px)</span>
          </label>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Logo Preview box */}
            <div className="size-24 rounded-2xl border-2 border-line bg-surface flex items-center justify-center relative overflow-hidden shadow-xs shrink-0">
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
                  className="size-full flex items-center justify-center font-display text-2xl font-bold text-white"
                  style={{ backgroundColor: data.brandAccent || "#C49A45" }}
                >
                  {(data.storeName || "B")[0]?.toUpperCase()}
                </div>
              )}

              {isUploadingLogo && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center">
                  <Loader2 className="size-6 text-[#C49A45] animate-spin" />
                </div>
              )}
            </div>

            {/* Upload action buttons */}
            <div className="flex flex-col gap-2">
              <input
                ref={logoInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                onChange={handleLogoUpload}
                className="hidden"
                id="logo-upload"
              />

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => logoInputRef.current?.click()}
                  disabled={isUploadingLogo}
                >
                  <UploadCloud className="size-3.5" />
                  {data.logoUrl ? "Replace Logo" : "Upload Logo"}
                </Button>

                {data.logoUrl && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveLogo}
                    className="text-danger hover:bg-danger/10"
                  >
                    <Trash2 className="size-3.5" />
                    Remove
                  </Button>
                )}
              </div>
              <p className="text-caption text-ink-faint">
                Supports PNG, JPG, or SVG up to 3MB. If skipped, an initial monogram will be generated.
              </p>
            </div>
          </div>
        </div>

        {/* 2. Store Cover / Banner */}
        <div>
          <label className="block text-body-sm font-medium text-ink mb-1.5">
            Store Cover Banner <span className="text-caption text-ink-soft">(Recommended: 1200×400 px)</span>
          </label>

          <div className="space-y-3">
            {/* Banner Preview Area */}
            <div className="relative h-36 w-full rounded-2xl border-2 border-line bg-[#1E1E1C] overflow-hidden flex items-center justify-center shadow-xs">
              {data.bannerUrl ? (
                <Image
                  src={data.bannerUrl}
                  alt="Store Banner"
                  fill
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <div className="text-center p-4">
                  <ImageIcon className="size-8 text-white/30 mx-auto mb-1" />
                  <p className="text-caption text-white/60">
                    Default charcoal craft texture selected
                  </p>
                </div>
              )}

              {isUploadingBanner && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
                  <Loader2 className="size-7 text-[#C49A45] animate-spin" />
                </div>
              )}
            </div>

            {/* Banner upload actions */}
            <input
              ref={bannerInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleBannerUpload}
              className="hidden"
              id="banner-upload"
            />

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => bannerInputRef.current?.click()}
                disabled={isUploadingBanner}
              >
                <UploadCloud className="size-3.5" />
                {data.bannerUrl ? "Change Banner" : "Upload Store Banner"}
              </Button>

              {data.bannerUrl && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveBanner}
                  className="text-danger hover:bg-danger/10"
                >
                  <Trash2 className="size-3.5" />
                  Remove
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* 3. Brand Accent Selection */}
        <div>
          <label className="block text-body-sm font-medium text-ink mb-2">
            Brand Accent Tone
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {BRAND_ACCENTS.map((accent) => {
              const isSelected = (data.brandAccent || "#C49A45") === accent.hex;
              return (
                <button
                  type="button"
                  key={accent.id}
                  onClick={() => onUpdate({ brandAccent: accent.hex })}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all text-left ${
                    isSelected
                      ? "border-[#C49A45] ring-2 ring-[#C49A45]/20 bg-[#C49A45]/5"
                      : "border-line bg-surface hover:border-line-deep"
                  }`}
                >
                  <span
                    className={`size-5 rounded-full ${accent.bgClass} flex items-center justify-center shrink-0 shadow-2xs`}
                  >
                    {isSelected && <Check className="size-3 text-white" strokeWidth={3} />}
                  </span>
                  <span className="text-xs font-semibold text-ink leading-tight">
                    {accent.name}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="mt-1.5 text-caption text-ink-faint">
            Subtle accent applied to store monogram, badges, and maker highlights.
          </p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-line">
        <Button type="button" variant="outline" size="lg" onClick={onBack}>
          <ArrowLeft className="size-4" />
          Back
        </Button>
        <Button type="submit" variant="primary" size="lg">
          Review & Complete
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </form>
  );
}
