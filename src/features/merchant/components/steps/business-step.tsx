"use client";

import { ArrowRight, Building2, HelpCircle, Mail, Phone, ShieldCheck, User } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { BusinessType, MerchantOnboardingData } from "@/features/merchant/merchant-types";
import { BUSINESS_TYPES } from "@/features/merchant/merchant-utils";

export function BusinessStep({
  data,
  onUpdate,
  onNext,
}: {
  data: MerchantOnboardingData;
  onUpdate: (fields: Partial<MerchantOnboardingData>) => void;
  onNext: () => void;
}) {
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};

    if (!data.businessName?.trim()) {
      nextErrors.businessName = "Business / Brand name is required";
    } else if (data.businessName.trim().length < 2) {
      nextErrors.businessName = "Business name must be at least 2 characters";
    }

    if (!data.ownerName?.trim()) {
      nextErrors.ownerName = "Owner / Representative full name is required";
    }

    if (!data.contactEmail?.trim()) {
      nextErrors.contactEmail = "Official contact email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contactEmail.trim())) {
      nextErrors.contactEmail = "Please enter a valid email address";
    }

    if (!data.contactPhone?.trim()) {
      nextErrors.contactPhone = "Contact mobile number is required";
    } else if (data.contactPhone.replace(/\D/g, "").length < 10) {
      nextErrors.contactPhone = "Please enter a valid 10-digit mobile number";
    }

    if (!data.businessType) {
      nextErrors.businessType = "Please select your business entity type";
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
            Step 1 of 5
          </span>
          <span className="text-caption text-ink-soft">Business & Legal Entity</span>
        </div>
        <h2 className="font-display text-heading-xl font-semibold text-ink">
          Tell us about your brand
        </h2>
        <p className="text-body-sm text-ink-soft mt-1">
          We use these details for merchant onboarding and official seller communication. You can change them later.
        </p>
      </div>

      <div className="space-y-5">
        {/* Business / Brand Name */}
        <div>
          <label htmlFor="businessName" className="block text-body-sm font-medium text-ink mb-1.5">
            Brand / Enterprise Name <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-ink-soft" />
            <Input
              id="businessName"
              placeholder="e.g. Varanasi Weavers Guild"
              value={data.businessName}
              onChange={(e) => {
                onUpdate({
                  businessName: e.target.value,
                  // Also set store name default if not set
                  storeName: data.storeName ? data.storeName : e.target.value,
                });
                if (errors.businessName) {
                  setErrors((prev) => ({ ...prev, businessName: "" }));
                }
              }}
              className="pl-10"
              aria-invalid={Boolean(errors.businessName)}
            />
          </div>
          {errors.businessName && (
            <p className="mt-1.5 text-caption text-danger">{errors.businessName}</p>
          )}
        </div>

        {/* Owner Full Name */}
        <div>
          <label htmlFor="ownerName" className="block text-body-sm font-medium text-ink mb-1.5">
            Owner / Founder Full Name <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-ink-soft" />
            <Input
              id="ownerName"
              placeholder="e.g. Aarav Sharma"
              value={data.ownerName}
              onChange={(e) => {
                onUpdate({ ownerName: e.target.value });
                if (errors.ownerName) setErrors((prev) => ({ ...prev, ownerName: "" }));
              }}
              className="pl-10"
              aria-invalid={Boolean(errors.ownerName)}
            />
          </div>
          {errors.ownerName && (
            <p className="mt-1.5 text-caption text-danger">{errors.ownerName}</p>
          )}
        </div>

        {/* Contact Grid: Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="contactEmail" className="block text-body-sm font-medium text-ink mb-1.5">
              Contact Email <span className="text-danger">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-ink-soft" />
              <Input
                id="contactEmail"
                type="email"
                placeholder="seller@yourbrand.com"
                value={data.contactEmail}
                onChange={(e) => {
                  onUpdate({ contactEmail: e.target.value });
                  if (errors.contactEmail) setErrors((prev) => ({ ...prev, contactEmail: "" }));
                }}
                className="pl-10"
                aria-invalid={Boolean(errors.contactEmail)}
              />
            </div>
            {errors.contactEmail && (
              <p className="mt-1.5 text-caption text-danger">{errors.contactEmail}</p>
            )}
          </div>

          <div>
            <label htmlFor="contactPhone" className="block text-body-sm font-medium text-ink mb-1.5">
              Mobile Number <span className="text-danger">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-ink-soft" />
              <Input
                id="contactPhone"
                type="tel"
                placeholder="+91 98765 43210"
                value={data.contactPhone}
                onChange={(e) => {
                  onUpdate({ contactPhone: e.target.value });
                  if (errors.contactPhone) setErrors((prev) => ({ ...prev, contactPhone: "" }));
                }}
                className="pl-10"
                aria-invalid={Boolean(errors.contactPhone)}
              />
            </div>
            {errors.contactPhone && (
              <p className="mt-1.5 text-caption text-danger">{errors.contactPhone}</p>
            )}
          </div>
        </div>

        {/* Business Type Selector */}
        <div>
          <label className="block text-body-sm font-medium text-ink mb-2">
            Business Structure <span className="text-danger">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {BUSINESS_TYPES.map((bt) => {
              const isSelected = data.businessType === bt.value;
              return (
                <Card
                  key={bt.value}
                  variant={isSelected ? "botanical" : "surface"}
                  padding="sm"
                  radius="lg"
                  onClick={() => {
                    onUpdate({ businessType: bt.value as BusinessType });
                    if (errors.businessType) setErrors((prev) => ({ ...prev, businessType: "" }));
                  }}
                  className={`cursor-pointer transition-all border ${
                    isSelected
                      ? "border-[#C49A45] ring-2 ring-[#C49A45]/20 bg-[#C49A45]/5"
                      : "border-line hover:border-[#C49A45]/50"
                  }`}
                >
                  <CardContent className="flex items-start gap-2.5 p-1">
                    <input
                      type="radio"
                      name="businessType"
                      checked={isSelected}
                      onChange={() => {}}
                      className="mt-1 accent-[#C49A45]"
                      aria-label={bt.label}
                    />
                    <div className="flex flex-col">
                      <span className="text-body-sm font-semibold text-ink leading-tight">
                        {bt.label}
                      </span>
                      <span className="text-[11px] text-ink-soft leading-snug mt-0.5">
                        {bt.description}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          {errors.businessType && (
            <p className="mt-1.5 text-caption text-danger">{errors.businessType}</p>
          )}
        </div>
      </div>

      {/* Helpful context */}
      <div className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-subtle border border-line text-caption text-ink-soft">
        <ShieldCheck className="size-4 text-[#2F5E3D] shrink-0 mt-0.5" />
        <span>
          <strong>Artisan Trust:</strong> GSTIN is optional for micro-sellers under threshold limits. You will only be asked for payout details after store creation.
        </span>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-end pt-4 border-t border-line">
        <Button type="submit" variant="primary" size="lg" className="w-full sm:w-auto">
          Continue to Store Identity
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </form>
  );
}
