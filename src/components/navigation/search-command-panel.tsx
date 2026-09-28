"use client";

import {
  ArrowRight,
  Clock,
  ExternalLink,
  Flame,
  FolderOpen,
  Layers,
  Search,
  Sparkles,
  Store,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Input } from "@/components/ui/input";
import { Modal, ModalContent } from "@/components/ui/modal";
import { marketingRoutes } from "@/config/routes";
import type { AutocompleteResult } from "@/features/search/search-types";
import { searchService } from "@/services/search.service";

export function SearchCommandPanel({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<AutocompleteResult | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState<number>(-1);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Load recent & popular searches on open
  React.useEffect(() => {
    if (open) {
      searchService.autocomplete("").then(setResults);
      setSelectedIndex(-1);
    }
  }, [open]);

  // Debounced autocomplete with cancellation
  React.useEffect(() => {
    if (!open) return;

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await searchService.autocomplete(query);
        if (!controller.signal.aborted) {
          setResults(res);
          setSelectedIndex(-1);
        }
      } catch {
        // ignore
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 180);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query, open]);

  // Collect navigable items for keyboard navigation
  const flatItems = React.useMemo(() => {
    if (!results) return [];
    const list: { type: "product" | "brand" | "category" | "collection" | "recent"; href: string; label: string }[] = [];

    if (query.trim()) {
      results.products.forEach((p) => {
        list.push({ type: "product", href: marketingRoutes.product(p.slug), label: p.name });
      });
      results.brands.forEach((b) => {
        list.push({ type: "brand", href: `/search?brand=${b.slug}`, label: b.name });
      });
      results.categories.forEach((c) => {
        list.push({ type: "category", href: `/search?category=${c.slug}`, label: c.name });
      });
      results.collections.forEach((col) => {
        list.push({ type: "collection", href: `/collections/${col.slug}`, label: col.title });
      });
    } else {
      results.recentSearches.forEach((r) => {
        list.push({ type: "recent", href: `/search?q=${encodeURIComponent(r)}`, label: r });
      });
    }

    return list;
  }, [results, query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < flatItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : flatItems.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < flatItems.length) {
        const item = flatItems[selectedIndex];
        onOpenChange(false);
        router.push(item.href as any);
      } else if (query.trim()) {
        onOpenChange(false);
        router.push(`/search?q=${encodeURIComponent(query.trim())}` as any);
      }
    } else if (e.key === "Escape") {
      onOpenChange(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onOpenChange(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}` as any);
    }
  };

  const handleRemoveRecent = (e: React.MouseEvent, term: string) => {
    e.stopPropagation();
    e.preventDefault();
    searchService.removeRecentSearch(term);
    setResults((prev) =>
      prev ? { ...prev, recentSearches: prev.recentSearches.filter((s) => s !== term) } : null,
    );
  };

  const handleClearAllRecent = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    searchService.clearRecentSearches();
    setResults((prev) => (prev ? { ...prev, recentSearches: [] } : null));
  };

  const hasAnySuggestions =
    results &&
    (results.products.length > 0 ||
      results.brands.length > 0 ||
      results.categories.length > 0 ||
      results.collections.length > 0);

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent
        title="Search Bhagya Commerce"
        description="Find handcrafted goods, master weavers, and pure sustainable materials"
        size="lg"
      >
        <div className="space-y-4" onKeyDown={handleKeyDown}>
          {/* Search Input Bar */}
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="absolute left-4 size-5 text-ink-soft pointer-events-none" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search handloom, terracotta cookware, cold-pressed oils…"
              className="w-full rounded-2xl border border-line bg-canvas-subtle py-3.5 pl-12 pr-12 text-body-md font-semibold text-ink placeholder:text-ink-soft focus:border-primary focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              autoFocus
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3.5 rounded-full p-1 text-ink-soft hover:text-ink hover:bg-surface transition-colors"
                aria-label="Clear query"
              >
                <X className="size-4" />
              </button>
            )}
          </form>

          {/* Autocomplete Content Area */}
          <div className="max-h-[60vh] overflow-y-auto pr-1 space-y-5 divide-y divide-line">
            {/* ── When Query is Empty: Recent & Popular ───────────────── */}
            {!query.trim() && (
              <div className="space-y-5 pt-1">
                {/* Recent Searches */}
                {results?.recentSearches && results.recentSearches.length > 0 && (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <p className="text-caption font-bold uppercase tracking-wider text-ink-soft flex items-center gap-1.5">
                        <Clock className="size-3.5" />
                        <span>Recent Searches</span>
                      </p>
                      <button
                        type="button"
                        onClick={handleClearAllRecent}
                        className="text-[11px] font-semibold text-ink-soft hover:text-danger transition-colors cursor-pointer"
                      >
                        Clear All
                      </button>
                    </div>
                    <ul className="space-y-1">
                      {results.recentSearches.map((term, idx) => (
                        <li key={term}>
                          <div
                            onClick={() => {
                              onOpenChange(false);
                              router.push(`/search?q=${encodeURIComponent(term)}` as any);
                            }}
                            className={`flex items-center justify-between p-2.5 rounded-xl transition-colors cursor-pointer ${
                              selectedIndex === idx
                                ? "bg-primary/15 text-primary font-bold"
                                : "hover:bg-surface-subtle text-ink"
                            }`}
                          >
                            <span className="flex items-center gap-2.5 text-body-sm">
                              <Clock className="size-3.5 text-ink-soft" />
                              <span>{term}</span>
                            </span>
                            <button
                              type="button"
                              onClick={(e) => handleRemoveRecent(e, term)}
                              className="p-1 text-ink-soft hover:text-danger rounded-full"
                              aria-label={`Remove ${term}`}
                            >
                              <X className="size-3.5" />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Popular Trending Suggestions */}
                <div className="space-y-2.5">
                  <p className="text-caption font-bold uppercase tracking-wider text-ink-soft flex items-center gap-1.5">
                    <Flame className="size-3.5 text-[#E89535]" />
                    <span>Popular Right Now</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {results?.popularSearches.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => {
                          onOpenChange(false);
                          router.push(`/search?q=${encodeURIComponent(term)}` as any);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-pill border border-line bg-canvas px-3.5 py-1.5 text-caption font-semibold text-ink hover:border-primary hover:text-primary transition-all cursor-pointer shadow-xs"
                      >
                        <span>{term}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── When Query is Present: Categorized Results ──────────── */}
            {query.trim() && (
              <div className="space-y-5 pt-2">
                {/* 1. Products (up to 5) */}
                {results?.products && results.products.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-caption font-bold uppercase tracking-wider text-ink-soft flex items-center gap-1.5">
                      <Sparkles className="size-3.5 text-[#E89535]" />
                      <span>Products</span>
                    </p>
                    <div className="space-y-1">
                      {results.products.map((prod) => (
                        <Link
                          key={prod.id}
                          href={marketingRoutes.product(prod.slug)}
                          onClick={() => onOpenChange(false)}
                          className="flex items-center gap-3.5 p-2 rounded-xl hover:bg-surface-subtle transition-colors group"
                        >
                          <div className="relative size-12 rounded-lg bg-canvas-deep overflow-hidden shrink-0 border border-line">
                            <Image
                              src={prod.imageSrc}
                              alt={prod.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-body-sm font-semibold text-ink group-hover:text-primary truncate transition-colors">
                              {prod.name}
                            </p>
                            <p className="text-caption text-ink-soft truncate">
                              {prod.brandName} · {prod.categoryName}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-body-sm font-bold text-ink font-mono">
                              ₹{prod.priceInr.toLocaleString("en-IN")}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Brands & Makers (up to 3) */}
                {results?.brands && results.brands.length > 0 && (
                  <div className="space-y-2 pt-3">
                    <p className="text-caption font-bold uppercase tracking-wider text-ink-soft flex items-center gap-1.5">
                      <Store className="size-3.5 text-primary" />
                      <span>Artisan Guilds & Brands</span>
                    </p>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {results.brands.map((b) => (
                        <Link
                          key={b.slug}
                          href={`/search?brand=${b.slug}`}
                          onClick={() => onOpenChange(false)}
                          className="flex items-center justify-between p-2.5 rounded-xl border border-line bg-surface hover:border-primary hover:bg-surface-raised transition-all group"
                        >
                          <div className="min-w-0">
                            <p className="text-body-sm font-bold text-ink group-hover:text-primary truncate">
                              {b.name}
                            </p>
                            <p className="text-caption text-ink-soft">{b.origin}</p>
                          </div>
                          <span className="text-[11px] font-semibold text-ink-faint shrink-0">
                            {b.productCount} craft{b.productCount === 1 ? "" : "s"}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Categories & Collections (up to 3) */}
                {(results?.categories.length || results?.collections.length) ? (
                  <div className="space-y-2 pt-3">
                    <p className="text-caption font-bold uppercase tracking-wider text-ink-soft flex items-center gap-1.5">
                      <FolderOpen className="size-3.5 text-primary" />
                      <span>Categories & Collections</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {results?.categories.map((c) => (
                        <Link
                          key={c.slug}
                          href={`/search?category=${c.slug}`}
                          onClick={() => onOpenChange(false)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-pill border border-line bg-canvas text-caption font-semibold text-ink hover:border-primary hover:text-primary transition-all"
                        >
                          <Layers className="size-3 text-primary" />
                          <span>{c.name}</span>
                          <span className="text-ink-faint">({c.productCount})</span>
                        </Link>
                      ))}
                      {results?.collections.map((col) => (
                        <Link
                          key={col.slug}
                          href={`/collections/${col.slug}`}
                          onClick={() => onOpenChange(false)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-pill border border-line bg-canvas text-caption font-semibold text-ink hover:border-primary hover:text-primary transition-all"
                        >
                          <Sparkles className="size-3 text-[#E89535]" />
                          <span>{col.title}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}

                {/* Zero Suggestions */}
                {!hasAnySuggestions && !loading && (
                  <div className="py-8 text-center space-y-2">
                    <p className="text-body-sm font-semibold text-ink">
                      No quick suggestions for &ldquo;{query}&rdquo;
                    </p>
                    <p className="text-caption text-ink-soft">
                      Press <kbd className="px-1.5 py-0.5 rounded border border-line bg-canvas font-mono text-xs">Enter</kbd> to run full catalog search.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Action */}
          <div className="flex items-center justify-between border-t border-line pt-3 text-caption text-ink-soft">
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-ink-faint">
                <kbd className="px-1.5 py-0.5 rounded border border-line bg-canvas font-mono text-[10px]">↑</kbd>
                <kbd className="px-1.5 py-0.5 rounded border border-line bg-canvas font-mono text-[10px]">↓</kbd>
                to navigate
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-ink-faint">
                <kbd className="px-1.5 py-0.5 rounded border border-line bg-canvas font-mono text-[10px]">↵</kbd>
                to search
              </span>
            </div>

            {query.trim() && (
              <button
                type="button"
                onClick={() => {
                  onOpenChange(false);
                  router.push(`/search?q=${encodeURIComponent(query.trim())}` as any);
                }}
                className="inline-flex items-center gap-1.5 text-body-sm font-bold text-primary hover:underline cursor-pointer"
              >
                <span>See all results for &ldquo;{query}&rdquo;</span>
                <ArrowRight className="size-3.5" />
              </button>
            )}
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
}
