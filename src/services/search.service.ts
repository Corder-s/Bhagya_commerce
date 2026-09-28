import { brands } from "@/data/brands";
import { categories } from "@/data/categories";
import { collections } from "@/data/collections";
import { products as allProducts } from "@/data/products";
import type {
  AutocompleteResult,
  SearchEngineResult,
  SearchFacets,
  SearchQueryParams,
  SearchResultItem,
} from "@/features/search/search-types";

const RECENT_SEARCHES_KEY = "bhagya_recent_searches";
const MAX_RECENT = 5;

const POPULAR_SEARCHES = [
  "Handloom cotton throw",
  "Terracotta cookware",
  "Unpolished millets",
  "Ayurvedic churna",
  "Cold pressed oil",
  "Clay diya sets",
];

const TRENDING_SEARCHES = [
  "Indigo dyed saree",
  "Brass pooja bell",
  "Neem wooden comb",
  "A2 bilona ghee",
  "Khadi shirt",
];

const COMMON_TYPOS: Record<string, string> = {
  oragnic: "organic",
  organik: "organic",
  shmapoo: "shampoo",
  handlom: "handloom",
  teracota: "terracotta",
  terracota: "terracotta",
  ayurvadic: "ayurvedic",
  ayurweda: "ayurvedic",
  milet: "millet",
  millets: "millet",
  cotten: "cotton",
  potery: "pottery",
  indgo: "indigo",
  neeme: "neem",
};

/**
 * Search Service — Authoritative client & API bridge for Bhagya Commerce Search Engine.
 */
export const searchService = {
  /**
   * Search catalog products with multi-attribute filtering, facet calculation,
   * deterministic scoring, and typo tolerance.
   */
  async search(params: SearchQueryParams): Promise<SearchEngineResult> {
    const startTime = performance.now();
    const rawQuery = params.q?.trim() ?? "";
    const cleanQuery = rawQuery.toLowerCase().replace(/\s+/g, " ");

    // 1. Filter base products
    let results: SearchResultItem[] = allProducts.map((p) => ({ ...p }));

    // Text Search & Relevance Ranking
    if (cleanQuery) {
      results = results
        .map((p) => {
          let score = 0;
          let matchType: SearchResultItem["matchType"] = "DESCRIPTION";
          const pName = p.name.toLowerCase();
          const pBrand = p.brand.name.toLowerCase();
          const pCat = p.categorySlug.toLowerCase();
          const pBlurb = p.blurb.toLowerCase();

          if (pName === cleanQuery) {
            score += 100;
            matchType = "EXACT";
          } else if (pName.startsWith(cleanQuery)) {
            score += 75;
            matchType = "PREFIX";
          } else if (pName.includes(cleanQuery)) {
            score += 50;
            matchType = "WORD";
          } else if (pBrand.includes(cleanQuery)) {
            score += 40;
            matchType = "BRAND";
          } else if (pCat.includes(cleanQuery)) {
            score += 30;
            matchType = "CATEGORY";
          } else if (pBlurb.includes(cleanQuery)) {
            score += 20;
            matchType = "DESCRIPTION";
          }

          if (p.availability === "in-stock") score += 10;
          if (p.rating) score += p.rating.value * 2;

          return { ...p, relevanceScore: score, matchType };
        })
        .filter((p) => (p.relevanceScore ?? 0) > 0);
    }

    // Facet calculations before strict narrowing
    const facets = calculateFacets(results);

    // Apply Filters
    if (params.category && params.category !== "all") {
      results = results.filter((p) => p.categorySlug === params.category);
    }

    if (params.brand && params.brand !== "all") {
      results = results.filter((p) => p.brand.slug === params.brand);
    }

    if (params.minPrice !== undefined) {
      results = results.filter((p) => p.priceInr >= params.minPrice!);
    }

    if (params.maxPrice !== undefined) {
      results = results.filter((p) => p.priceInr <= params.maxPrice!);
    }

    if (params.rating && params.rating !== "all") {
      const minRate = params.rating === "4-plus" ? 4.0 : params.rating === "3-plus" ? 3.0 : 0;
      results = results.filter((p) => (p.rating?.value ?? 0) >= minRate);
    }

    if (params.availability && params.availability !== "all") {
      results = results.filter((p) => p.availability === params.availability);
    }

    if (params.discountOnly) {
      results = results.filter((p) => p.mrpInr !== null && p.mrpInr > p.priceInr);
    }

    // Sorting
    const sort = params.sort ?? "recommended";
    switch (sort) {
      case "newest":
        // Preserve default collection order or bucket order
        break;
      case "price-asc":
        results.sort((a, b) => a.priceInr - b.priceInr);
        break;
      case "price-desc":
        results.sort((a, b) => b.priceInr - a.priceInr);
        break;
      case "top-rated":
        results.sort((a, b) => (b.rating?.value ?? 0) - (a.rating?.value ?? 0));
        break;
      case "recommended":
      default:
        if (cleanQuery) {
          results.sort((a, b) => (b.relevanceScore ?? 0) - (a.relevanceScore ?? 0));
        } else {
          results.sort((a, b) => (b.rating?.value ?? 0) - (a.rating?.value ?? 0));
        }
        break;
    }

    // Typo / Did You Mean detection
    let didYouMean: string | null = null;
    if (results.length === 0 && cleanQuery) {
      for (const [typo, fix] of Object.entries(COMMON_TYPOS)) {
        if (cleanQuery.includes(typo)) {
          didYouMean = cleanQuery.replace(typo, fix);
          break;
        }
      }
    }

    // Pagination
    const pageSize = params.pageSize ?? 12;
    const page = params.page ?? 1;
    const total = results.length;
    const totalPages = Math.ceil(total / pageSize);
    const paginatedItems = results.slice((page - 1) * pageSize, page * pageSize);

    // Save recent search if query is non-empty
    if (rawQuery) {
      this.addRecentSearch(rawQuery);
    }

    return {
      query: rawQuery,
      normalizedQuery: cleanQuery,
      items: paginatedItems,
      total,
      totalPages,
      page,
      pageSize,
      didYouMean,
      facets,
      popularSearches: POPULAR_SEARCHES,
      executionTimeMs: Math.round(performance.now() - startTime),
    };
  },

  /**
   * Fast autocomplete for live search suggestions across Products, Brands, Categories, Collections.
   */
  async autocomplete(query: string): Promise<AutocompleteResult> {
    const raw = query.trim();
    const clean = raw.toLowerCase().replace(/\s+/g, " ");

    const recent = this.getRecentSearches();

    if (!clean) {
      return {
        query: raw,
        products: [],
        brands: [],
        categories: [],
        collections: [],
        popularSearches: POPULAR_SEARCHES,
        recentSearches: recent,
      };
    }

    // 1. Suggest Products (up to 5)
    const matchedProducts = allProducts
      .filter((p) => {
        const name = p.name.toLowerCase();
        const brand = p.brand.name.toLowerCase();
        const cat = p.categorySlug.toLowerCase();
        return name.includes(clean) || brand.includes(clean) || cat.includes(clean);
      })
      .slice(0, 5)
      .map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        categorySlug: p.categorySlug,
        categoryName: categories.find((c) => c.slug === p.categorySlug)?.name || p.categorySlug,
        brandName: p.brand.name,
        priceInr: p.priceInr,
        imageSrc: p.image?.src || "/placeholder.png",
      }));

    // 2. Suggest Brands (up to 3)
    const matchedBrands = brands
      .filter((b) => b.name.toLowerCase().includes(clean) || b.blurb.toLowerCase().includes(clean) || b.craft.toLowerCase().includes(clean))
      .slice(0, 3)
      .map((b) => ({
        slug: b.slug,
        name: b.name,
        origin: b.region,
        productCount: allProducts.filter((p) => p.brand.slug === b.slug).length,
      }));

    // 3. Suggest Categories (up to 3)
    const matchedCategories = categories
      .filter((c) => c.name.toLowerCase().includes(clean) || c.descriptor.toLowerCase().includes(clean))
      .slice(0, 3)
      .map((c) => ({
        slug: c.slug,
        name: c.name,
        productCount: allProducts.filter((p) => p.categorySlug === c.slug).length,
      }));

    // 4. Suggest Collections (up to 3)
    const matchedCollections = collections
      .filter((col) => col.name.toLowerCase().includes(clean) || col.description.toLowerCase().includes(clean))
      .slice(0, 3)
      .map((col) => ({
        slug: col.slug,
        title: col.name,
        description: col.description,
      }));

    return {
      query: raw,
      products: matchedProducts,
      brands: matchedBrands,
      categories: matchedCategories,
      collections: matchedCollections,
      popularSearches: POPULAR_SEARCHES,
      recentSearches: recent,
    };
  },

  /**
   * Recent searches management in LocalStorage
   */
  getRecentSearches(): string[] {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  addRecentSearch(query: string): void {
    if (typeof window === "undefined" || !query.trim()) return;
    try {
      const clean = query.trim();
      const existing = this.getRecentSearches().filter((q) => q.toLowerCase() !== clean.toLowerCase());
      const updated = [clean, ...existing].slice(0, MAX_RECENT);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch {}
  },

  removeRecentSearch(query: string): void {
    if (typeof window === "undefined") return;
    try {
      const existing = this.getRecentSearches().filter((q) => q.toLowerCase() !== query.toLowerCase());
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(existing));
    } catch {}
  },

  clearRecentSearches(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch {}
  },

  getPopularSearches(): string[] {
    return POPULAR_SEARCHES;
  },

  getTrendingSearches(): string[] {
    return TRENDING_SEARCHES;
  },
};

function calculateFacets(products: SearchResultItem[]): SearchFacets {
  // Category counts
  const catMap = new Map<string, number>();
  categories.forEach((c) => catMap.set(c.slug, 0));
  products.forEach((p) => {
    catMap.set(p.categorySlug, (catMap.get(p.categorySlug) ?? 0) + 1);
  });
  const categoryFacets = categories.map((c) => ({
    id: c.slug,
    label: c.name,
    count: catMap.get(c.slug) ?? 0,
  }));

  // Brand counts
  const brandMap = new Map<string, number>();
  brands.forEach((b) => brandMap.set(b.slug, 0));
  products.forEach((p) => {
    brandMap.set(p.brand.slug, (brandMap.get(p.brand.slug) ?? 0) + 1);
  });
  const brandFacets = brands.map((b) => ({
    id: b.slug,
    label: b.name,
    count: brandMap.get(b.slug) ?? 0,
  }));

  // Price ranges
  const priceRanges = [
    { id: "under-500", label: "Under ₹500", count: products.filter((p) => p.priceInr < 500).length },
    { id: "500-1000", label: "₹500 – ₹1,000", count: products.filter((p) => p.priceInr >= 500 && p.priceInr <= 1000).length },
    { id: "1000-2500", label: "₹1,000 – ₹2,500", count: products.filter((p) => p.priceInr > 1000 && p.priceInr <= 2500).length },
    { id: "above-2500", label: "Above ₹2,500", count: products.filter((p) => p.priceInr > 2500).length },
  ];

  // Ratings
  const ratings = [
    { id: "4-plus", label: "4★ & above", count: products.filter((p) => (p.rating?.value ?? 0) >= 4).length },
    { id: "3-plus", label: "3★ & above", count: products.filter((p) => (p.rating?.value ?? 0) >= 3).length },
  ];

  const inStockCount = products.filter((p) => p.availability === "in-stock").length;
  const discountedCount = products.filter((p) => p.mrpInr !== null && p.mrpInr > p.priceInr).length;

  return {
    categories: categoryFacets,
    brands: brandFacets,
    priceRanges,
    ratings,
    inStockCount,
    discountedCount,
  };
}
