"use client";

import {
  AlertCircle,
  ArrowRight,
  ChevronDown,
  Clock,
  Filter,
  Flame,
  HelpCircle,
  LayoutGrid,
  LayoutList,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Tag,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { ProductCard, ProductCardSkeleton } from "@/features/products/product-card";
import { SearchFilterDrawer } from "@/features/search/components/search-filter-drawer";
import type {
  SearchEngineResult,
  SearchQueryParams,
  SearchSortOption,
} from "@/features/search/search-types";
import { analyticsTracker } from "@/lib/analytics/tracker";
import { marketingRoutes } from "@/config/routes";
import { searchService } from "@/services/search.service";

const SORT_OPTIONS: { value: SearchSortOption; label: string }[] = [
  { value: "recommended", label: "Recommended" },
  { value: "newest", label: "Newest Arrivals" },
  { value: "top-rated", label: "Top Rated" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export function SearchResultsView() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read URL query params
  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "all";
  const initialBrand = searchParams.get("brand") || "all";
  const initialRating = searchParams.get("rating") || "all";
  const initialAvailability = (searchParams.get("availability") as any) || "all";
  const initialDiscount = searchParams.get("discountOnly") === "true";
  const initialSort = (searchParams.get("sort") as SearchSortOption) || "recommended";
  const initialPage = parseInt(searchParams.get("page") || "1", 10);

  const [inputQuery, setInputQuery] = React.useState(initialQuery);
  const [params, setParams] = React.useState<SearchQueryParams>({
    q: initialQuery,
    category: initialCategory,
    brand: initialBrand,
    rating: initialRating,
    availability: initialAvailability,
    discountOnly: initialDiscount,
    sort: initialSort,
    page: initialPage,
  });

  const [data, setData] = React.useState<SearchEngineResult | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [layout, setLayout] = React.useState<"grid" | "list">("grid");
  const [filterDrawerOpen, setFilterDrawerOpen] = React.useState(false);
  const [showFiltersPanel, setShowFiltersPanel] = React.useState(false);

  // Sync state when URL search params change
  React.useEffect(() => {
    const q = searchParams.get("q") || "";
    setInputQuery(q);
    setParams({
      q,
      category: searchParams.get("category") || "all",
      brand: searchParams.get("brand") || "all",
      rating: searchParams.get("rating") || "all",
      availability: (searchParams.get("availability") as any) || "all",
      discountOnly: searchParams.get("discountOnly") === "true",
      sort: (searchParams.get("sort") as SearchSortOption) || "recommended",
      page: parseInt(searchParams.get("page") || "1", 10),
    });
  }, [searchParams]);

  // Execute Search
  const executeSearch = React.useCallback(async (currentParams: SearchQueryParams) => {
    setLoading(true);
    setError(null);
    try {
      const result = await searchService.search(currentParams);
      setData(result);

      // Track search analytics
      if (currentParams.q?.trim()) {
        if (result.total > 0) {
          analyticsTracker.trackSearch(result.query, result.total);
        } else {
          analyticsTracker.trackNoResults(result.query);
        }
      }
    } catch (err: any) {
      setError(err?.message || "Failed to fetch search results.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    executeSearch(params);
  }, [params, executeSearch]);

  // Update URL helper
  const updateUrl = (updated: Partial<SearchQueryParams>) => {
    const next: SearchQueryParams = { ...params, ...updated };
    const sp = new URLSearchParams();

    if (next.q) sp.set("q", next.q);
    if (next.category && next.category !== "all") sp.set("category", next.category);
    if (next.brand && next.brand !== "all") sp.set("brand", next.brand);
    if (next.rating && next.rating !== "all") sp.set("rating", next.rating);
    if (next.availability && next.availability !== "all") sp.set("availability", next.availability);
    if (next.discountOnly) sp.set("discountOnly", "true");
    if (next.sort && next.sort !== "recommended") sp.set("sort", next.sort);
    if (next.page && next.page > 1) sp.set("page", next.page.toString());

    router.push(`/search?${sp.toString()}`, { scroll: false });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrl({ q: inputQuery.trim(), page: 1 });
  };

  const clearAllFilters = () => {
    updateUrl({
      category: "all",
      brand: "all",
      rating: "all",
      availability: "all",
      discountOnly: false,
      sort: "recommended",
      page: 1,
    });
  };

  // Active filter count calculation
  const activeFiltersCount = React.useMemo(() => {
    let count = 0;
    if (params.category && params.category !== "all") count++;
    if (params.brand && params.brand !== "all") count++;
    if (params.rating && params.rating !== "all") count++;
    if (params.availability && params.availability !== "all") count++;
    if (params.discountOnly) count++;
    return count;
  }, [params]);

  const anyActiveFilter = activeFiltersCount > 0 || Boolean(params.q);

  return (
    <div className="space-y-8">
      {/* ── 1. Search Query Hero Input ─────────────────────────────────── */}
      <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8 shadow-card space-y-6">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-ink-soft pointer-events-none" />
            <input
              type="search"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Search handcrafted textiles, pottery, ayurveda, organic foods…"
              className="w-full rounded-2xl border border-line bg-canvas-subtle py-4 pl-12 pr-12 text-body-md font-semibold text-ink placeholder:text-ink-soft focus:border-primary focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
            {inputQuery && (
              <button
                type="button"
                onClick={() => {
                  setInputQuery("");
                  updateUrl({ q: "", page: 1 });
                }}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-ink-soft hover:bg-surface-sunken hover:text-ink transition-colors"
                aria-label="Clear search input"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
          <Button type="submit" variant="primary" size="lg" className="rounded-2xl shrink-0 px-7">
            Search
          </Button>
        </form>

        {/* Popular searches quick pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-caption text-ink-soft">
          <span className="font-semibold flex items-center gap-1.5 text-ink">
            <Flame className="size-3.5 text-[#E89535]" />
            Trending:
          </span>
          {["Handloom cotton throw", "Terracotta cookware", "Millets", "Ayurvedic churna", "Clay diya"].map(
            (term) => (
              <button
                key={term}
                type="button"
                onClick={() => {
                  setInputQuery(term);
                  updateUrl({ q: term, page: 1 });
                }}
                className="rounded-pill border border-line bg-canvas px-3 py-1 text-caption text-ink-soft hover:border-primary hover:text-primary transition-colors cursor-pointer"
              >
                {term}
              </button>
            ),
          )}
        </div>
      </div>

      {/* ── 2. Did You Mean Banner ─────────────────────────────────────── */}
      {data?.didYouMean && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#E89535]/10 border border-[#E89535]/30 text-body-sm text-ink">
          <HelpCircle className="size-5 text-[#E89535] shrink-0" />
          <p>
            Did you mean{" "}
            <button
              type="button"
              onClick={() => {
                setInputQuery(data.didYouMean!);
                updateUrl({ q: data.didYouMean!, page: 1 });
              }}
              className="font-bold text-[#E89535] underline hover:text-[#D48024] cursor-pointer"
            >
              &ldquo;{data.didYouMean}&rdquo;
            </button>
            ?
          </p>
        </div>
      )}

      {/* ── 3. Interactive Toolbar: Filters + Sort + Result Count ───────── */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-surface border border-line shadow-xs">
        {/* Left: Filter Toggle & Active Chips */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Mobile filter button */}
          <button
            type="button"
            onClick={() => setFilterDrawerOpen(true)}
            className="sm:hidden inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-4 py-2.5 text-body-sm font-semibold text-ink hover:border-primary"
          >
            <SlidersHorizontal className="size-4 text-primary" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="grid size-5 place-items-center rounded-full bg-primary text-[11px] font-bold text-[#1F1510]">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Desktop filter accordion toggle */}
          <button
            type="button"
            onClick={() => setShowFiltersPanel((p) => !p)}
            className={`hidden sm:inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-body-sm font-semibold transition-all ${
              showFiltersPanel || activeFiltersCount > 0
                ? "border-primary bg-primary/10 text-primary font-bold"
                : "border-line bg-surface text-ink hover:border-line-strong"
            }`}
          >
            <SlidersHorizontal className="size-4" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="grid size-5 place-items-center rounded-full bg-primary text-[11px] font-bold text-[#1F1510]">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Active Filter Chips */}
          {params.category && params.category !== "all" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill text-caption font-semibold bg-surface-raised border border-line text-ink">
              <span>Category: {params.category}</span>
              <button
                type="button"
                onClick={() => updateUrl({ category: "all", page: 1 })}
                className="hover:text-primary"
              >
                <X className="size-3" />
              </button>
            </span>
          )}

          {params.brand && params.brand !== "all" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill text-caption font-semibold bg-surface-raised border border-line text-ink">
              <span>Brand: {params.brand}</span>
              <button
                type="button"
                onClick={() => updateUrl({ brand: "all", page: 1 })}
                className="hover:text-primary"
              >
                <X className="size-3" />
              </button>
            </span>
          )}

          {params.discountOnly && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill text-caption font-semibold bg-success/15 border border-success/30 text-success">
              <span>Discounted Only</span>
              <button
                type="button"
                onClick={() => updateUrl({ discountOnly: false, page: 1 })}
              >
                <X className="size-3" />
              </button>
            </span>
          )}

          {anyActiveFilter && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="inline-flex items-center gap-1 text-caption font-semibold text-ink-soft hover:text-primary transition-colors cursor-pointer ml-1"
            >
              <RotateCcw className="size-3" />
              <span>Clear all</span>
            </button>
          )}
        </div>

        {/* Right: Sort & Layout */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Result Count */}
          <p className="text-body-sm text-ink-soft hidden md:block">
            Found <strong className="text-ink font-bold">{data?.total ?? 0}</strong> products
          </p>

          {/* Sort Selection */}
          <div className="relative">
            <select
              value={params.sort || "recommended"}
              onChange={(e) => updateUrl({ sort: e.target.value as SearchSortOption, page: 1 })}
              className="appearance-none rounded-xl border border-line bg-surface py-2 pl-3.5 pr-8 text-body-sm font-semibold text-ink cursor-pointer focus:border-primary focus:outline-none"
            >
              {SORT_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-4 text-ink-soft" />
          </div>

          {/* Grid / List Layout Switcher */}
          <div className="hidden lg:flex items-center gap-1 border border-line rounded-xl p-1 bg-surface">
            <button
              type="button"
              onClick={() => setLayout("grid")}
              className={`p-1.5 rounded-lg transition-colors ${
                layout === "grid" ? "bg-surface-raised text-primary shadow-xs" : "text-ink-soft hover:text-ink"
              }`}
              aria-label="Grid layout"
            >
              <LayoutGrid className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => setLayout("list")}
              className={`p-1.5 rounded-lg transition-colors ${
                layout === "list" ? "bg-surface-raised text-primary shadow-xs" : "text-ink-soft hover:text-ink"
              }`}
              aria-label="List layout"
            >
              <LayoutList className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── 4. Desktop Expandable Filter Panel ─────────────────────────── */}
      {showFiltersPanel && data?.facets && (
        <div className="rounded-2xl border border-line bg-surface p-6 shadow-sm animate-in fade-in duration-200">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Categories */}
            <div>
              <p className="mb-2.5 text-caption font-bold uppercase tracking-wider text-ink-soft">
                Category
              </p>
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => updateUrl({ category: "all", page: 1 })}
                  className={`w-full text-left text-body-sm px-2.5 py-1.5 rounded-lg transition-colors ${
                    params.category === "all" || !params.category
                      ? "bg-primary/10 text-primary font-bold"
                      : "text-ink-soft hover:bg-surface-subtle hover:text-ink"
                  }`}
                >
                  All Categories
                </button>
                {data.facets.categories.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => updateUrl({ category: params.category === c.id ? "all" : c.id, page: 1 })}
                    className={`w-full flex items-center justify-between text-body-sm px-2.5 py-1.5 rounded-lg transition-colors ${
                      params.category === c.id
                        ? "bg-primary/10 text-primary font-bold"
                        : "text-ink-soft hover:bg-surface-subtle hover:text-ink"
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
              <p className="mb-2.5 text-caption font-bold uppercase tracking-wider text-ink-soft">
                Artisan Brand
              </p>
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => updateUrl({ brand: "all", page: 1 })}
                  className={`w-full text-left text-body-sm px-2.5 py-1.5 rounded-lg transition-colors ${
                    params.brand === "all" || !params.brand
                      ? "bg-primary/10 text-primary font-bold"
                      : "text-ink-soft hover:bg-surface-subtle hover:text-ink"
                  }`}
                >
                  All Brands
                </button>
                {data.facets.brands.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => updateUrl({ brand: params.brand === b.id ? "all" : b.id, page: 1 })}
                    className={`w-full flex items-center justify-between text-body-sm px-2.5 py-1.5 rounded-lg transition-colors ${
                      params.brand === b.id
                        ? "bg-primary/10 text-primary font-bold"
                        : "text-ink-soft hover:bg-surface-subtle hover:text-ink"
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
              <p className="mb-2.5 text-caption font-bold uppercase tracking-wider text-ink-soft">
                Customer Rating
              </p>
              <div className="space-y-1.5">
                {[
                  { id: "all", label: "All Ratings" },
                  { id: "4-plus", label: "4★ & above" },
                  { id: "3-plus", label: "3★ & above" },
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => updateUrl({ rating: r.id, page: 1 })}
                    className={`w-full text-left text-body-sm px-2.5 py-1.5 rounded-lg transition-colors ${
                      (params.rating || "all") === r.id
                        ? "bg-primary/10 text-primary font-bold"
                        : "text-ink-soft hover:bg-surface-subtle hover:text-ink"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability & Offers */}
            <div>
              <p className="mb-2.5 text-caption font-bold uppercase tracking-wider text-ink-soft">
                Availability & Offers
              </p>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-body-sm text-ink cursor-pointer">
                  <input
                    type="radio"
                    name="avail"
                    checked={(params.availability || "all") === "all"}
                    onChange={() => updateUrl({ availability: "all", page: 1 })}
                    className="accent-primary"
                  />
                  <span>All Items</span>
                </label>
                <label className="flex items-center gap-2 text-body-sm text-ink cursor-pointer">
                  <input
                    type="radio"
                    name="avail"
                    checked={params.availability === "in-stock"}
                    onChange={() => updateUrl({ availability: "in-stock", page: 1 })}
                    className="accent-primary"
                  />
                  <span>In Stock Only ({data.facets.inStockCount})</span>
                </label>
                <div className="pt-2 border-t border-line">
                  <label className="flex items-center gap-2 text-body-sm font-semibold text-ink cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(params.discountOnly)}
                      onChange={(e) => updateUrl({ discountOnly: e.target.checked, page: 1 })}
                      className="size-4 rounded accent-primary"
                    />
                    <span>Special Deals ({data.facets.discountedCount})</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 5. Results Area ────────────────────────────────────────────── */}
      {loading ? (
        <div
          className={`grid gap-x-5 gap-y-10 ${
            layout === "grid" ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" : "grid-cols-1 sm:grid-cols-2"
          }`}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="py-16 text-center rounded-3xl border border-line bg-surface p-8 space-y-4 max-w-md mx-auto">
          <AlertCircle className="size-10 text-danger mx-auto" />
          <h3 className="text-heading-md font-bold text-ink">We couldn&apos;t complete your search</h3>
          <p className="text-body-sm text-ink-soft">{error}</p>
          <Button
            variant="primary"
            size="md"
            onClick={() => executeSearch(params)}
            className="gap-2"
          >
            <RotateCcw className="size-4" />
            Try Again
          </Button>
        </div>
      ) : data?.items.length === 0 ? (
        /* Zero Results Recovery */
        <div className="py-16 text-center rounded-3xl border border-line bg-surface p-8 space-y-6 max-w-2xl mx-auto shadow-sm">
          <div className="grid size-14 place-items-center rounded-full bg-gold/10 text-gold-dark dark:text-gold mx-auto border border-gold/20">
            <Search className="size-7" />
          </div>
          <div className="space-y-2">
            <h3 className="text-heading-lg font-bold text-ink">
              No results found {params.q ? `for "${params.q}"` : ""}
            </h3>
            <p className="text-body-sm text-ink-soft max-w-md mx-auto">
              We couldn&apos;t find an exact craft match. Try broadening your keywords, resetting active filters, or explore our heritage collections below.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Button
              variant="outline"
              size="md"
              onClick={clearAllFilters}
              className="gap-2"
            >
              <RotateCcw className="size-4" />
              Reset All Filters
            </Button>
            <Button asChild variant="primary" size="md">
              <Link href={marketingRoutes.shop}>Browse Full Catalog</Link>
            </Button>
          </div>

          {/* Popular Categories */}
          <div className="border-t border-line pt-6 text-left space-y-3">
            <p className="text-caption font-bold uppercase tracking-wider text-ink-soft text-center">
              Popular Artisan Categories
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                { name: "Handloom Textiles", slug: "textiles" },
                { name: "Pottery & Clay", slug: "pottery-clay" },
                { name: "Ayurvedic Wellness", slug: "ayurvedic-wellness" },
                { name: "Organic Millets & Foods", slug: "natural-foods" },
                { name: "Heritage Home Decor", slug: "home-decor" },
              ].map((c) => (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => updateUrl({ category: c.slug, q: "", page: 1 })}
                  className="p-3 rounded-xl border border-line bg-canvas hover:border-primary text-left text-body-sm font-semibold text-ink hover:text-primary transition-all cursor-pointer"
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Product Results Grid */
        <>
          <div
            className={`grid gap-x-5 gap-y-10 ${
              layout === "grid" ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" : "grid-cols-1 sm:grid-cols-2"
            }`}
          >
            {data?.items.map((product) => (
              <div key={product.id} className="relative group">
                <ProductCard
                  product={product}
                  href={marketingRoutes.product(product.slug)}
                />
                {product.matchType === "EXACT" && (
                  <div className="absolute top-2 left-2 z-10 pointer-events-none">
                    <span className="inline-flex items-center gap-1 rounded-pill bg-success text-white px-2.5 py-0.5 text-[10px] font-bold shadow-xs">
                      <Sparkles className="size-3" />
                      Exact Match
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination / Load More */}
          {data && data.totalPages > 1 && (
            <div className="mt-14 flex items-center justify-center gap-3">
              <Button
                variant="outline"
                size="md"
                disabled={params.page === 1}
                onClick={() => updateUrl({ page: Math.max(1, (params.page || 1) - 1) })}
              >
                Previous Page
              </Button>
              <span className="text-body-sm font-semibold text-ink px-3">
                Page {params.page || 1} of {data.totalPages}
              </span>
              <Button
                variant="outline"
                size="md"
                disabled={(params.page || 1) >= data.totalPages}
                onClick={() => updateUrl({ page: (params.page || 1) + 1 })}
              >
                Next Page
              </Button>
            </div>
          )}
        </>
      )}

      {/* Mobile Filter Drawer */}
      {data?.facets && (
        <SearchFilterDrawer
          isOpen={filterDrawerOpen}
          onClose={() => setFilterDrawerOpen(false)}
          params={params}
          facets={data.facets}
          onApply={(updated) => updateUrl({ ...updated, page: 1 })}
          onReset={clearAllFilters}
        />
      )}
    </div>
  );
}
