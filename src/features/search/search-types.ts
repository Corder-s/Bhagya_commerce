import type { ProductSummary, SortOption } from "@/types/catalogue";

export type SearchSortOption =
  | "recommended"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "top-rated";

export interface SearchQueryParams {
  q?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: string;
  availability?: "all" | "in-stock" | "low-stock" | "made-to-order";
  discountOnly?: boolean;
  sort?: SearchSortOption;
  page?: number;
  pageSize?: number;
}

export interface SearchFacetItem {
  id: string;
  label: string;
  count: number;
}

export interface SearchFacets {
  categories: SearchFacetItem[];
  brands: SearchFacetItem[];
  priceRanges: SearchFacetItem[];
  ratings: SearchFacetItem[];
  inStockCount: number;
  discountedCount: number;
}

export interface SearchResultItem extends ProductSummary {
  relevanceScore?: number;
  matchType?: "EXACT" | "PREFIX" | "WORD" | "CATEGORY" | "BRAND" | "TAG" | "DESCRIPTION";
}

export interface SearchEngineResult {
  query: string;
  normalizedQuery: string;
  items: SearchResultItem[];
  total: number;
  totalPages: number;
  page: number;
  pageSize: number;
  didYouMean?: string | null;
  facets: SearchFacets;
  popularSearches: string[];
  executionTimeMs: number;
}

export interface AutocompleteProductSuggestion {
  id: string;
  name: string;
  slug: string;
  categorySlug: string;
  categoryName: string;
  brandName: string;
  priceInr: number;
  imageSrc: string;
}

export interface AutocompleteBrandSuggestion {
  slug: string;
  name: string;
  origin: string;
  productCount: number;
}

export interface AutocompleteCategorySuggestion {
  slug: string;
  name: string;
  productCount: number;
}

export interface AutocompleteCollectionSuggestion {
  slug: string;
  title: string;
  description: string;
}

export interface AutocompleteResult {
  query: string;
  products: AutocompleteProductSuggestion[];
  brands: AutocompleteBrandSuggestion[];
  categories: AutocompleteCategorySuggestion[];
  collections: AutocompleteCollectionSuggestion[];
  popularSearches: string[];
  recentSearches: string[];
}
