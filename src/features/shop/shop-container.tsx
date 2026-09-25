"use client";

import {
  ChevronDown,
  Filter,
  LayoutGrid,
  LayoutList,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import * as React from "react";

import { ProductCard, ProductCardSkeleton } from "@/features/products/product-card";
import { categories } from "@/data/categories";
import { filterAndSortProducts, products as allProducts } from "@/data/products";
import { marketingRoutes } from "@/config/routes";
import { cn } from "@/lib/utils";
import type { FilterState, ProductBucket, SortOption } from "@/types/catalogue";

/* ─────────────────────────── constants ───────────────────────────────────── */

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "recommended", label: "Recommended" },
  { value: "newest", label: "Newest First" },
  { value: "top-rated", label: "Top Rated" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

const PRICE_OPTIONS = [
  { value: "all", label: "All Prices" },
  { value: "under-500", label: "Under ₹500" },
  { value: "500-1000", label: "₹500 – ₹1,000" },
  { value: "1000-2500", label: "₹1,000 – ₹2,500" },
  { value: "above-2500", label: "Above ₹2,500" },
] as const;

const AVAILABILITY_OPTIONS = [
  { value: "all", label: "All" },
  { value: "in-stock", label: "In Stock" },
  { value: "low-stock", label: "Low Stock" },
  { value: "made-to-order", label: "Made to Order" },
] as const;

const BUCKET_TABS: { value: ProductBucket | "all"; label: string }[] = [
  { value: "all", label: "All Products" },
  { value: "for-you", label: "For You" },
  { value: "trending", label: "Trending" },
  { value: "new-arrivals", label: "New Arrivals" },
  { value: "best-sellers", label: "Best Sellers" },
  { value: "conscious-picks", label: "Conscious Picks" },
];

const DEFAULT_FILTERS: FilterState = {
  category: "all",
  brand: "all",
  price: "all",
  rating: "all",
  availability: "all",
  discountOnly: false,
};

const PAGE_SIZE = 12;

/* ─────────────────────────── ShopContainer ──────────────────────────────── */

export function ShopContainer() {
  const [query, setQuery] = React.useState("");
  const [filters, setFilters] = React.useState<FilterState>(DEFAULT_FILTERS);
  const [sort, setSort] = React.useState<SortOption>("recommended");
  const [bucket, setBucket] = React.useState<ProductBucket | "all">("all");
  const [page, setPage] = React.useState(1);
  const [layout, setLayout] = React.useState<"grid" | "list">("grid");
  const [filterOpen, setFilterOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // ── derived ──────────────────────────────────────────────────────────────

  const filtered = React.useMemo(() => {
    return filterAndSortProducts({
      query,
      bucket: bucket === "all" ? null : bucket,
      category: filters.category === "all" ? "all" : filters.category,
      brand: filters.brand,
      price: filters.price,
      rating: filters.rating,
      availability: filters.availability,
      discountOnly: filters.discountOnly,
      sort,
    });
  }, [query, filters, sort, bucket]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageItems = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = page < totalPages;

  // Reset page when filters change
  React.useEffect(() => {
    setPage(1);
  }, [query, filters, sort, bucket]);

  // Active filter count (excluding category since it shows in nav)
  const activeFilterCount = React.useMemo(() => {
    let count = 0;
    if (filters.price !== "all") count++;
    if (filters.rating !== "all") count++;
    if (filters.availability !== "all") count++;
    if (filters.discountOnly) count++;
    return count;
  }, [filters]);

  function resetFilters() {
    setFilters(DEFAULT_FILTERS);
    setQuery("");
    setBucket("all");
    setSort("recommended");
  }

  const anyActive = activeFilterCount > 0 || query || bucket !== "all";

  /* ─── render ───────────────────────────────────────────────────────────── */

  return (
    <div className="w-full">
      {/* ── Search bar ──────────────────────────────────────────────────── */}
      <div className="mb-8 flex gap-3">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink-faint"
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, brands, materials…"
            className={cn(
              "w-full rounded-xl border border-line bg-surface py-3.5 pl-11 pr-4",
              "text-body-sm text-ink placeholder:text-ink-faint",
              "transition-colors duration-fast ease-brand",
              "focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20",
            )}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-ink-faint hover:text-ink"
              aria-label="Clear search"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>

      {/* ── Category rail ────────────────────────────────────────────────── */}
      <div className="mb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => setFilters((f) => ({ ...f, category: "all" }))}
            className={cn(
              "shrink-0 rounded-pill border px-4 py-2 text-body-sm font-semibold transition-all duration-fast shadow-xs cursor-pointer",
              filters.category === "all"
                ? "border-primary bg-primary text-[#151515] font-bold shadow-sm shadow-primary/20"
                : "border-line bg-surface text-ink-soft hover:border-primary hover:text-gold-dark dark:hover:text-gold",
            )}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() =>
                setFilters((f) => ({
                  ...f,
                  category: f.category === cat.slug ? "all" : cat.slug,
                }))
              }
              className={cn(
                "shrink-0 rounded-pill border px-4 py-2 text-body-sm font-semibold transition-all duration-fast shadow-xs cursor-pointer",
                filters.category === cat.slug
                  ? "border-primary bg-primary text-[#151515] font-bold shadow-sm shadow-primary/20"
                  : "border-line bg-surface text-ink-soft hover:border-primary hover:text-gold-dark dark:hover:text-gold",
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* ── Discovery tabs ───────────────────────────────────────────────── */}
      <div className="mb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {BUCKET_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setBucket(tab.value)}
              className={cn(
                "shrink-0 rounded-lg px-4 py-2 text-body-sm font-medium transition-colors duration-fast",
                bucket === tab.value
                  ? "bg-canvas-deep text-ink"
                  : "text-ink-faint hover:text-ink",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Toolbar: filters + sort + layout ─────────────────────────────── */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        {/* Filter toggle */}
        <button
          type="button"
          onClick={() => setFilterOpen((o) => !o)}
          className={cn(
            "inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-body-sm font-medium",
            "transition-colors duration-fast ease-brand",
            filterOpen || activeFilterCount > 0
              ? "border-primary/40 bg-primary/10 text-primary"
              : "border-line bg-surface text-ink-soft hover:text-ink",
          )}
        >
          <SlidersHorizontal className="size-4" aria-hidden="true" />
          Filters
          {activeFilterCount > 0 && (
            <span className="grid size-5 place-items-center rounded-full bg-primary text-[11px] font-bold text-white">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Sort */}
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className={cn(
              "appearance-none rounded-lg border border-line bg-surface py-2.5 pl-4 pr-9 text-body-sm text-ink",
              "transition-colors duration-fast focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20",
            )}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-ink-faint"
            aria-hidden="true"
          />
        </div>

        {/* Reset */}
        {anyActive && (
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 text-body-sm text-ink-faint hover:text-ink"
          >
            <X className="size-3.5" aria-hidden="true" />
            Clear all
          </button>
        )}

        {/* Result count */}
        <p className="ml-auto text-body-sm text-ink-faint">
          <span className="font-semibold text-ink">{filtered.length}</span>{" "}
          {filtered.length === 1 ? "product" : "products"}
        </p>

        {/* Layout toggle */}
        <div className="hidden items-center gap-1 sm:flex">
          <button
            type="button"
            onClick={() => setLayout("grid")}
            aria-label="Grid layout"
            className={cn(
              "rounded-md p-2 transition-colors",
              layout === "grid"
                ? "bg-canvas-deep text-ink"
                : "text-ink-faint hover:text-ink",
            )}
          >
            <LayoutGrid className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => setLayout("list")}
            aria-label="List layout"
            className={cn(
              "rounded-md p-2 transition-colors",
              layout === "list"
                ? "bg-canvas-deep text-ink"
                : "text-ink-faint hover:text-ink",
            )}
          >
            <LayoutList className="size-4" />
          </button>
        </div>
      </div>

      {/* ── Filter panel (expandable) ─────────────────────────────────────── */}
      {filterOpen && (
        <div className="mb-8 rounded-2xl border border-line bg-surface p-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Price */}
            <div>
              <p className="mb-3 text-body-sm font-semibold text-ink">Price Range</p>
              <div className="flex flex-col gap-2">
                {PRICE_OPTIONS.map((opt) => (
                  <label key={opt.value} className="flex cursor-pointer items-center gap-2.5">
                    <input
                      type="radio"
                      name="price"
                      value={opt.value}
                      checked={filters.price === opt.value}
                      onChange={() =>
                        setFilters((f) => ({ ...f, price: opt.value as FilterState["price"] }))
                      }
                      className="accent-primary"
                    />
                    <span className="text-body-sm text-ink-soft">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div>
              <p className="mb-3 text-body-sm font-semibold text-ink">Customer Rating</p>
              <div className="flex flex-col gap-2">
                {(
                  [
                    { value: "all", label: "All Ratings" },
                    { value: "4-plus", label: "4★ & above" },
                    { value: "3-plus", label: "3★ & above" },
                  ] as const
                ).map((opt) => (
                  <label key={opt.value} className="flex cursor-pointer items-center gap-2.5">
                    <input
                      type="radio"
                      name="rating"
                      value={opt.value}
                      checked={filters.rating === opt.value}
                      onChange={() =>
                        setFilters((f) => ({ ...f, rating: opt.value }))
                      }
                      className="accent-primary"
                    />
                    <span className="text-body-sm text-ink-soft">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div>
              <p className="mb-3 text-body-sm font-semibold text-ink">Availability</p>
              <div className="flex flex-col gap-2">
                {AVAILABILITY_OPTIONS.map((opt) => (
                  <label key={opt.value} className="flex cursor-pointer items-center gap-2.5">
                    <input
                      type="radio"
                      name="availability"
                      value={opt.value}
                      checked={filters.availability === opt.value}
                      onChange={() =>
                        setFilters((f) => ({ ...f, availability: opt.value }))
                      }
                      className="accent-primary"
                    />
                    <span className="text-body-sm text-ink-soft">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Extras */}
            <div>
              <p className="mb-3 text-body-sm font-semibold text-ink">Extras</p>
              <label className="flex cursor-pointer items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={filters.discountOnly}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, discountOnly: e.target.checked }))
                  }
                  className="accent-primary"
                />
                <span className="text-body-sm text-ink-soft">Discounted only</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* ── Product grid ─────────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-24 text-center">
          <Filter className="size-10 text-ink-faint" aria-hidden="true" />
          <p className="text-body-lg font-medium text-ink">No products found</p>
          <p className="max-w-xs text-body-sm text-ink-soft">
            Try adjusting your search or filters to discover more.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-2 rounded-lg border border-line px-5 py-2.5 text-body-sm font-medium text-ink hover:border-line-strong"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <>
          <div
            className={cn(
              "grid gap-x-5 gap-y-10",
              layout === "grid"
                ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
                : "grid-cols-1 sm:grid-cols-2",
            )}
          >
            {pageItems.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                href={marketingRoutes.product(product.slug)}
              />
            ))}
          </div>

          {/* Load more */}
          {hasMore && (
            <div className="mt-14 flex justify-center">
              <button
                type="button"
                onClick={() => setPage((p) => p + 1)}
                className={cn(
                  "rounded-xl border border-line bg-surface px-8 py-3.5 text-body-sm font-medium text-ink",
                  "transition-colors duration-fast hover:border-line-strong hover:bg-canvas-deep",
                )}
              >
                Load more —{" "}
                <span className="text-ink-faint">
                  showing {pageItems.length} of {filtered.length}
                </span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
