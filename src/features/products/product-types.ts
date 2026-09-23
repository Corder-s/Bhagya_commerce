import type { BrandSummary, Category, MediaRef } from "@/types/catalogue";

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface ProductVariantOption {
  name: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku?: string;
  priceInr: number;
  mrpInr?: number | null;
  inventoryQuantity: number;
  available: boolean;
  options?: Record<string, string>;
}

export interface ProductInventory {
  available: boolean;
  quantity?: number;
  lowStockThreshold?: number;
}

export interface ProductDetails {
  ingredients?: string[];
  materials?: string[];
  howToUse?: string[];
  specifications?: Record<string, string>;
  benefits?: string[];
  careInstructions?: string;
  origin?: string;
  packaging?: string;
}

export interface ProductReviewItem {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified?: boolean;
  location?: string;
}

export interface ProductRatingSummary {
  value: number;
  count: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  blurb?: string;
  description: string;
  shortDescription?: string;

  brand: {
    slug: string;
    name: string;
    region?: string;
    craft?: string;
  };

  category: {
    slug: string;
    name: string;
  };

  priceInr: number;
  mrpInr?: number | null;
  currency: string;

  rating?: ProductRatingSummary | { value: number; count: number } | null;
  reviewCount: number;
  reviewsList?: readonly ProductReviewItem[];

  images: ProductImage[];
  image?: MediaRef | null;
  gallery?: readonly MediaRef[];

  variants?: ProductVariant[];

  tags: string[];

  inventory: ProductInventory;

  details?: ProductDetails;

  shippingInfo?: string;
  returnPolicy?: string;

  badge?: string;
  isBestSeller?: boolean;
  isFeatured?: boolean;
}
