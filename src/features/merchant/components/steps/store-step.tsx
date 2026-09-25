"use client";

import { ArrowLeft, ArrowRight, CheckCircle2, Globe, Sparkles, Store, XCircle } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { MerchantOnboardingData } from "@/features/merchant/merchant-types";
import { slugifyStoreName, validateStoreSlug } from "@/features/merchant/merchant-utils";
import { merchantService } from "@/services/merchant.service";

export function StoreStep({
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
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSlugChecking, setIsSlugChecking] = React.useState<boolean>(false);
  const [slugStatus, setSlugStatus] = React.useState<"idle" | "valid" | "invalid">("idle");
  const [slugMessage, setSlugMessage] = React.useState<string>("");

  // Initialize slug from storeName or businessName if empty
  React.useEffect(() => {
    if (!data.storeSlug && (data.storeName || data.businessName)) {
      const initialSlug = slugifyStoreName(data.storeName || data.businessName);
      onUpdate({ storeSlug: initialSlug });
    }
  }, [data.storeName, data.businessName, data.storeSlug, onUpdate]);

  // Check slug availability with debounce
  React.useEffect(() => {
    if (!data.storeSlug) {
      setSlugStatus("idle");
      setSlugMessage("");
      return;
    }

    const timer = setTimeout(async () => {
      setIsSlugChecking(true);
      try {
        const check = await merchantService.checkSlugAvailability(data.storeSlug);
        if (check.available) {
          setSlugStatus("valid");
          setSlugMessage(`bhagya.in/store/${data.storeSlug} is available`);
          if (errors.storeSlug) {
            setErrors((prev) => ({ ...prev, storeSlug: "" }));
          }
        } else {
          setSlugStatus("invalid");
          setSlugMessage(check.message || "This URL is unavailable");
        }
      } catch {
        setSlugStatus("idle");
      } finally {
        setIsSlugChecking(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [data.storeSlug, errors.storeSlug]);

  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};

    if (!data.storeName?.trim()) {
      nextErrors.storeName = "Store name is required";
    }

    const slugCheck = validateStoreSlug(data.storeSlug || "");
    if (!slugCheck.valid) {
      nextErrors.storeSlug = slugCheck.message || "Invalid store slug";
    }

    if (!data.storeDescription?.trim()) {
      nextErrors.storeDescription = "Please provide a brief store description";
    } else if (data.storeDescription.trim().length < 20) {
      nextErrors.storeDescription = "Description should be at least 20 characters";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#C49A45]/20 text-[#9A6A20] dark:text-[#C49A45]">
            Step 2 of 5
          </span>
          <span className="text-caption text-ink-soft">Store Identity & URL</span>
        </div>
        <h2 className="font-display text-heading-xl font-semibold text-ink">
          Name your store & choose your URL
        </h2>
        <p className="text-body-sm text-ink-soft mt-1">
          Your store is your independent home on Bhagya Commerce. Customers will discover your brand and products here.
        </p>
      </div>

      <div className="space-y-5">
        {/* Store Name */}
        <div>
          <label htmlFor="storeName" className="block text-body-sm font-medium text-ink mb-1.5">
            Store Name <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <Store className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-ink-soft" />
            <Input
              id="storeName"
              placeholder="e.g. Varanasi Heritage Silks"
              value={data.storeName}
              onChange={(e) => {
                const name = e.target.value;
                const autoSlug = slugifyStoreName(name);
                onUpdate({
                  storeName: name,
                  // Auto update slug if user hasn't heavily customized it
                  storeSlug: autoSlug,
                });
                if (errors.storeName) setErrors((prev) => ({ ...prev, storeName: "" }));
              }}
              className="pl-10"
              aria-invalid={Boolean(errors.storeName)}
            />
          </div>
          {errors.storeName && (
            <p className="mt-1.5 text-caption text-danger">{errors.storeName}</p>
          )}
        </div>

        {/* Store URL Slug */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="storeSlug" className="block text-body-sm font-medium text-ink">
              Store URL Handle <span className="text-danger">*</span>
            </label>
            <span className="text-[11px] text-ink-soft">Lowercase letters, numbers, hyphens</span>
          </div>

          <div className="flex rounded-xl border border-line bg-surface overflow-hidden focus-within:ring-2 focus-within:ring-[#C49A45] focus-within:border-[#C49A45] transition-all">
            <span className="inline-flex items-center px-3.5 bg-surface-subtle border-r border-line text-xs font-mono text-ink-soft select-none">
              bhagya.in/store/
            </span>
            <input
              id="storeSlug"
              type="text"
              placeholder="your-store-handle"
              value={data.storeSlug}
              onChange={(e) => {
                const clean = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
                onUpdate({ storeSlug: clean });
                if (errors.storeSlug) setErrors((prev) => ({ ...prev, storeSlug: "" }));
              }}
              className="flex-1 min-w-0 px-3.5 py-2.5 bg-transparent text-body-sm font-mono text-ink focus:outline-none"
              aria-invalid={Boolean(errors.storeSlug)}
            />
          </div>

          {/* Availability Status */}
          <div className="mt-1.5 flex items-center justify-between min-h-5">
            {isSlugChecking ? (
              <span className="text-[11px] text-ink-soft animate-pulse">
                Checking handle availability...
              </span>
            ) : slugStatus === "valid" ? (
              <span className="flex items-center gap-1 text-[11px] font-medium text-[#2F5E3D]">
                <CheckCircle2 className="size-3.5" />
                {slugMessage}
              </span>
            ) : slugStatus === "invalid" ? (
              <span className="flex items-center gap-1 text-[11px] font-medium text-danger">
                <XCircle className="size-3.5" />
                {slugMessage}
              </span>
            ) : errors.storeSlug ? (
              <span className="text-caption text-danger">{errors.storeSlug}</span>
            ) : (
              <span className="text-[11px] text-ink-faint">
                Share this link directly on Instagram, WhatsApp & business cards
              </span>
            )}
          </div>
        </div>

        {/* Short Tagline */}
        <div>
          <label htmlFor="storeTagline" className="block text-body-sm font-medium text-ink mb-1.5">
            Brand Tagline / Catchphrase <span className="text-ink-soft text-caption">(Optional)</span>
          </label>
          <div className="relative">
            <Sparkles className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#C49A45]" />
            <Input
              id="storeTagline"
              placeholder="e.g. 4th generation master weavers of pure Banarasi brocade"
              value={data.storeTagline || ""}
              onChange={(e) => onUpdate({ storeTagline: e.target.value })}
              className="pl-10"
              maxLength={100}
            />
          </div>
          <p className="mt-1 text-caption text-ink-faint">
            Appears prominently on your store banner and search discovery cards.
          </p>
        </div>

        {/* Store Description / Story */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="storeDescription" className="block text-body-sm font-medium text-ink">
              Store Story & Description <span className="text-danger">*</span>
            </label>
            <span className="text-[11px] text-ink-soft">
              {(data.storeDescription || "").length} / 500 characters
            </span>
          </div>
          <Textarea
            id="storeDescription"
            rows={4}
            placeholder="Tell customers about your craftsmanship, regional heritage, sustainable materials and making process..."
            value={data.storeDescription}
            onChange={(e) => {
              onUpdate({ storeDescription: e.target.value });
              if (errors.storeDescription) setErrors((prev) => ({ ...prev, storeDescription: "" }));
            }}
            maxLength={500}
            aria-invalid={Boolean(errors.storeDescription)}
          />
          {errors.storeDescription && (
            <p className="mt-1.5 text-caption text-danger">{errors.storeDescription}</p>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-line">
        <Button type="button" variant="outline" size="lg" onClick={onBack}>
          <ArrowLeft className="size-4" />
          Back
        </Button>
        <Button type="submit" variant="primary" size="lg">
          Select Category
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </form>
  );
}
