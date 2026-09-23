import {
  getProductBySlug as dataGetProductBySlug,
  getProductsBySlugs as dataGetProductsBySlugs,
  getRelatedProducts as dataGetRelatedProducts,
  products as allProducts,
} from "@/data/products";
import type { ProductDetail, ProductSummary } from "@/types/catalogue";

/**
 * Product Service — frontend abstraction for product catalogue queries.
 *
 * Current implementation uses local in-memory records from `@/data/products`.
 * Architecture ready for future Spring Boot REST API integration (`/api/v1/products`).
 */
export const productService = {
  /**
   * Fetch all product summaries.
   */
  async getAllProducts(): Promise<ProductDetail[]> {
    return Promise.resolve([...allProducts]);
  },

  /**
   * Fetch a single product by its unique URL slug.
   */
  async getProductBySlug(slug: string): Promise<ProductDetail | null> {
    const product = dataGetProductBySlug(slug);
    return Promise.resolve(product ?? null);
  },

  /**
   * Fetch a single product by its unique ID.
   */
  async getProductById(id: string): Promise<ProductDetail | null> {
    const product = allProducts.find((p) => p.id === id);
    return Promise.resolve(product ?? null);
  },

  /**
   * Fetch related product recommendations based on category, tags, and brand.
   */
  async getRelatedProducts(slug: string, limit = 4): Promise<ProductSummary[]> {
    return Promise.resolve(dataGetRelatedProducts(slug, limit));
  },

  /**
   * Fetch products by a list of IDs (e.g. for wishlist hydration).
   */
  async getProductsByIds(ids: string[]): Promise<ProductDetail[]> {
    const idSet = new Set(ids);
    const matched = allProducts.filter((p) => idSet.has(p.id));
    return Promise.resolve(matched);
  },

  /**
   * Fetch products by slugs.
   */
  async getProductsBySlugs(slugs: readonly string[]): Promise<ProductSummary[]> {
    return Promise.resolve(dataGetProductsBySlugs(slugs));
  },
};
