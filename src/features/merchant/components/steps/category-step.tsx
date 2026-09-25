"use client";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  Compass,
  Heart,
  Home,
  Leaf,
  Palette,
  Plus,
  Recycle,
  Shirt,
  Sparkles,
  Sun,
  Utensils,
  X,
} from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { MerchantOnboardingData } from "@/features/merchant/merchant-types";
import { MERCHANT_CATEGORIES } from "@/features/merchant/merchant-utils";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Leaf,
  Sparkles,
  Heart,
  Palette,
  Shirt,
  Home,
  Sun,
  Recycle,
  Utensils,
  Compass,
};

export function CategoryStep({
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
  const [customTagInput, setCustomTagInput] = React.useState("");
  const [error, setError] = React.useState("");

  const selectedCategory = MERCHANT_CATEGORIES.find((c) => c.id === data.primaryCategoryId);

  const handleCategorySelect = (id: string) => {
    onUpdate({ primaryCategoryId: id });
    setError("");
  };

  const handleTagToggle = (tag: string) => {
    const current = data.specialtyTags || [];
    if (current.includes(tag)) {
      onUpdate({ specialtyTags: current.filter((t) => t !== tag) });
    } else {
      if (current.length >= 8) return;
      onUpdate({ specialtyTags: [...current, tag] });
    }
  };

  const handleAddCustomTag = () => {
    const trimmed = customTagInput.trim();
    if (!trimmed) return;
    const current = data.specialtyTags || [];
    if (!current.includes(trimmed) && current.length < 8) {
      onUpdate({ specialtyTags: [...current, trimmed] });
    }
    setCustomTagInput("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.primaryCategoryId) {
      setError("Please select a primary category for your store");
      return;
    }
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#C49A45]/20 text-[#9A6A20] dark:text-[#C49A45]">
            Step 3 of 5
          </span>
          <span className="text-caption text-ink-soft">Marketplace Category</span>
        </div>
        <h2 className="font-display text-heading-xl font-semibold text-ink">
          Select your primary craft category
        </h2>
        <p className="text-body-sm text-ink-soft mt-1">
          Choose where your store will be featured in the Bhagya discovery catalogue.
        </p>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {MERCHANT_CATEGORIES.map((category) => {
          const isSelected = data.primaryCategoryId === category.id;
          const IconComponent = ICONS[category.iconName] || Compass;

          return (
            <Card
              key={category.id}
              variant={isSelected ? "botanical" : "surface"}
              padding="md"
              radius="lg"
              onClick={() => handleCategorySelect(category.id)}
              className={`cursor-pointer transition-all border text-left ${
                isSelected
                  ? "border-[#C49A45] ring-2 ring-[#C49A45]/20 bg-[#C49A45]/5"
                  : "border-line hover:border-[#C49A45]/40 hover:bg-surface-subtle"
              }`}
            >
              <CardContent className="flex items-start gap-3 p-1">
                <div
                  className={`size-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? "bg-[#C49A45] text-[#151515]"
                      : "bg-surface-subtle border border-line text-[#9A6A20] dark:text-[#C49A45]"
                  }`}
                >
                  <IconComponent className="size-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-body-sm font-semibold text-ink">
                      {category.name}
                    </h3>
                    {isSelected && (
                      <span className="size-5 rounded-full bg-[#C49A45] text-[#151515] flex items-center justify-center">
                        <Check className="size-3" strokeWidth={3} />
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-ink-soft mt-0.5 leading-snug line-clamp-2">
                    {category.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {error && <p className="text-caption text-danger">{error}</p>}

      {/* Suggested & Custom Specialty Tags */}
      {selectedCategory && (
        <div className="p-4 rounded-xl bg-surface-subtle border border-line space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-body-sm font-semibold text-ink">
              Specialty Craft Tags <span className="text-caption text-ink-soft">(Optional, up to 8)</span>
            </span>
            <span className="text-[11px] text-ink-soft font-mono">
              {(data.specialtyTags || []).length} / 8 selected
            </span>
          </div>

          <p className="text-caption text-ink-soft">
            Select tags that describe your unique craft materials and artisanal techniques:
          </p>

          <div className="flex flex-wrap gap-2">
            {selectedCategory.suggestedTags.map((tag) => {
              const isSelected = (data.specialtyTags || []).includes(tag);
              return (
                <button
                  type="button"
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    isSelected
                      ? "bg-[#C49A45] text-[#151515] border-[#C49A45] font-semibold"
                      : "bg-surface border-line text-ink-soft hover:border-[#C49A45]/40 hover:text-ink"
                  }`}
                >
                  {isSelected ? `✓ ${tag}` : `+ ${tag}`}
                </button>
              );
            })}
          </div>

          {/* Custom Tag Input */}
          <div className="flex gap-2 pt-1">
            <Input
              placeholder="Add custom craft tag (e.g. GI Tagged, Zero Plastic)..."
              value={customTagInput}
              onChange={(e) => setCustomTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddCustomTag();
                }
              }}
              className="text-xs h-9"
              maxLength={24}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddCustomTag}
              disabled={!customTagInput.trim() || (data.specialtyTags || []).length >= 8}
            >
              <Plus className="size-3.5" />
              Add
            </Button>
          </div>

          {/* Selected custom tags list */}
          {(data.specialtyTags || []).length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {(data.specialtyTags || []).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface text-ink text-xs font-medium border border-line"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleTagToggle(tag)}
                    className="text-ink-soft hover:text-danger ml-0.5"
                    aria-label={`Remove tag ${tag}`}
                  >
                    <X className="size-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-line">
        <Button type="button" variant="outline" size="lg" onClick={onBack}>
          <ArrowLeft className="size-4" />
          Back
        </Button>
        <Button type="submit" variant="primary" size="lg">
          Configure Branding
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </form>
  );
}
