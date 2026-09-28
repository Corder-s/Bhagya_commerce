"use client";

import { Check, RotateCcw, SlidersHorizontal, X } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import type { SearchFacets, SearchQueryParams } from "@/features/search/search-types";

export interface SearchFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  params: SearchQueryParams;
  facets: SearchFacets;
  onApply: (updated: Partial<SearchQueryParams>) => void;
  onReset: () => void;
}

export function SearchFilterDrawer({
  isOpen,
  onClose,
  params,
  facets,
  onApply,
  onReset,
}: SearchFilterDrawerProps) {
  const [localCategory, setLocalCategory] = React.useState(params.category || "all");
  const [localBrand, setLocalBrand] = React.useState(params.brand || "all");
  const [localRating, setLocalRating] = React.useState(params.rating || "all");
  const [localAvailability, setLocalAvailability] = React.useState(params.availability || "all");
  const [localDiscount, setLocalDiscount] = React.useState(Boolean(params.discountOnly));

  React.useEffect(() => {
    if (isOpen) {
      setLocalCategory(params.category || "all");
      setLocalBrand(params.brand || "all");
      setLocalRating(params.rating || "all");
      setLocalAvailability(params.availability || "all");
      setLocalDiscount(Boolean(params.discountOnly));
    }
  }, [isOpen, params]);

  if (!isOpen) return null;

  const handleSave = () => {
    onApply({
      category: localCategory,
      brand: localBrand,
      rating: localRating,
      availability: localAvailability as SearchQueryParams["availability"],
      discountOnly: localDiscount,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs transition-opacity duration-200">
      <div className="w-full sm:max-w-lg max-h-[85vh] flex flex-col rounded-t-3xl sm:rounded-2xl border border-line bg-surface shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-6 py-4 bg-surface-raised">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="size-4 text-primary" />
            <h3 className="text-body-md font-bold text-ink">Filter Catalog</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-ink-soft hover:bg-surface hover:text-ink transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Filter Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Categories */}
          <div>
            <h4 className="text-caption font-bold uppercase tracking-wider text-ink-soft mb-2.5">
              Category
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setLocalCategory("all")}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-body-sm font-semibold border transition-all ${
                  localCategory === "all"
                    ? "border-primary bg-primary/10 text-primary font-bold"
                    : "border-line bg-surface text-ink-soft hover:text-ink"
                }`}
              >
                <span>All Categories</span>
                {localCategory === "all" && <Check className="size-3.5" />}
              </button>
              {facets.categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setLocalCategory(localCategory === c.id ? "all" : c.id)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-body-sm font-semibold border transition-all ${
                    localCategory === c.id
                      ? "border-primary bg-primary/10 text-primary font-bold"
                      : "border-line bg-surface text-ink-soft hover:text-ink"
                  }`}
                >
                  <span className="truncate">{c.label}</span>
                  <span className="text-[11px] text-ink-faint tabular-nums">({c.count})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Brands */}
          <div>
            <h4 className="text-caption font-bold uppercase tracking-wider text-ink-soft mb-2.5">
              Artisan Guild / Brand
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setLocalBrand("all")}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-body-sm font-semibold border transition-all ${
                  localBrand === "all"
                    ? "border-primary bg-primary/10 text-primary font-bold"
                    : "border-line bg-surface text-ink-soft hover:text-ink"
                }`}
              >
                <span>All Brands</span>
                {localBrand === "all" && <Check className="size-3.5" />}
              </button>
              {facets.brands.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setLocalBrand(localBrand === b.id ? "all" : b.id)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-body-sm font-semibold border transition-all ${
                    localBrand === b.id
                      ? "border-primary bg-primary/10 text-primary font-bold"
                      : "border-line bg-surface text-ink-soft hover:text-ink"
                  }`}
                >
                  <span className="truncate">{b.label}</span>
                  <span className="text-[11px] text-ink-faint tabular-nums">({b.count})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Ratings */}
          <div>
            <h4 className="text-caption font-bold uppercase tracking-wider text-ink-soft mb-2.5">
              Minimum Rating
            </h4>
            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: "All Ratings" },
                { id: "4-plus", label: "4★ & above" },
                { id: "3-plus", label: "3★ & above" },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setLocalRating(r.id)}
                  className={`px-3 py-1.5 rounded-pill text-body-sm font-semibold border transition-all ${
                    localRating === r.id
                      ? "border-primary bg-primary/10 text-primary font-bold"
                      : "border-line bg-surface text-ink-soft hover:text-ink"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div>
            <h4 className="text-caption font-bold uppercase tracking-wider text-ink-soft mb-2.5">
              Availability
            </h4>
            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: "All Items" },
                { id: "in-stock", label: `In Stock (${facets.inStockCount})` },
                { id: "low-stock", label: "Low Stock" },
                { id: "made-to-order", label: "Made to Order" },
              ].map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setLocalAvailability(a.id as any)}
                  className={`px-3 py-1.5 rounded-pill text-body-sm font-semibold border transition-all ${
                    localAvailability === a.id
                      ? "border-primary bg-primary/10 text-primary font-bold"
                      : "border-line bg-surface text-ink-soft hover:text-ink"
                  }`}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          {/* Discounted only */}
          <div className="pt-2 border-t border-line">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={localDiscount}
                onChange={(e) => setLocalDiscount(e.target.checked)}
                className="size-4 rounded accent-primary cursor-pointer"
              />
              <span className="text-body-sm font-semibold text-ink">
                Special Offers & Discounts Only ({facets.discountedCount})
              </span>
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-line px-6 py-4 bg-surface-raised gap-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setLocalCategory("all");
              setLocalBrand("all");
              setLocalRating("all");
              setLocalAvailability("all");
              setLocalDiscount(false);
              onReset();
              onClose();
            }}
            className="text-ink-soft hover:text-ink gap-1.5"
          >
            <RotateCcw className="size-3.5" />
            <span>Reset</span>
          </Button>

          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={handleSave}
            className="flex-1 max-w-[200px]"
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
