/**
 * Bhagya Commerce — AI Tool Registry (Step 10)
 *
 * Defines explicit boundaries and schemas for safe business tools.
 *
 * CRITICAL SAFETY RULES:
 * 1. AI is NEVER given access to payment processing secrets, CVVs, UPI PINs, or raw database queries.
 * 2. WRITE tools (e.g. stock adjustment, order cancellation) ALWAYS require explicit user confirmation.
 * 3. Customer AI queries are restricted strictly to the authenticated user's own orders/cart.
 * 4. Merchant AI queries are restricted strictly to the authenticated merchant's own store context.
 */

import type { AIToolDefinition } from "@/features/ai/types/ai.types";

/**
 * Customer AI Safe Tools
 */
export const CUSTOMER_AI_TOOLS: Record<string, AIToolDefinition> = {
  searchProducts: {
    name: "searchProducts",
    description: "Search handcrafted catalogue products by query, craft category, price, or materials.",
    category: "read",
    requiresConfirmation: false,
    parameters: {
      query: { type: "string", description: "Search keyword e.g. 'silk saree', 'brass lamp', 'organic oil'", required: true },
      category: { type: "string", description: "Filter by craft category" },
      maxPrice: { type: "number", description: "Maximum budget filter in INR" },
    },
  },
  getProductDetails: {
    name: "getProductDetails",
    description: "Fetch comprehensive specifications, materials, artisan story, and care instructions for a specific product.",
    category: "read",
    requiresConfirmation: false,
    parameters: {
      productId: { type: "string", description: "Unique product identifier or slug", required: true },
    },
  },
  getOrderTracking: {
    name: "getOrderTracking",
    description: "Fetch real-time delivery status, courier tracking, and estimated delivery date for a customer order.",
    category: "read",
    requiresConfirmation: false,
    parameters: {
      orderId: { type: "string", description: "Order number e.g. 'ORD-2026-9812'", required: true },
    },
  },
  getRecentOrders: {
    name: "getRecentOrders",
    description: "List recent orders placed by the current authenticated customer.",
    category: "read",
    requiresConfirmation: false,
    parameters: {
      limit: { type: "number", description: "Maximum number of orders to return" },
    },
  },
  getPolicyInfo: {
    name: "getPolicyInfo",
    description: "Retrieve official Bhagya policies regarding 7-day handcrafted returns, pan-India delivery SLAs, and artisan authenticity certification.",
    category: "read",
    requiresConfirmation: false,
    parameters: {
      topic: { type: "string", description: "Policy topic: 'shipping' | 'returns' | 'authenticity' | 'payments'", required: true },
    },
  },
};

/**
 * Merchant AI Safe Tools
 */
export const MERCHANT_AI_TOOLS: Record<string, AIToolDefinition> = {
  getDashboardOverview: {
    name: "getDashboardOverview",
    description: "Fetch live merchant KPI summary including today's sales, order volume, customer relationships, and low-stock count.",
    category: "read",
    requiresConfirmation: false,
    parameters: {
      storeId: { type: "string", description: "Store identifier", required: true },
    },
  },
  getMerchantOrders: {
    name: "getMerchantOrders",
    description: "Retrieve merchant orders filtered by fulfillment status (e.g. pending dispatch, processing, shipped).",
    category: "read",
    requiresConfirmation: false,
    parameters: {
      storeId: { type: "string", description: "Store identifier", required: true },
      status: { type: "string", description: "Order status filter e.g. 'pending', 'confirmed'" },
    },
  },
  getInventoryAlerts: {
    name: "getInventoryAlerts",
    description: "Retrieve products that have fallen below safety inventory stock thresholds.",
    category: "read",
    requiresConfirmation: false,
    parameters: {
      storeId: { type: "string", description: "Store identifier", required: true },
    },
  },
  generateProductDescription: {
    name: "generateProductDescription",
    description: "Draft rich, authentic storytelling copy and craft care notes for an artisan listing.",
    category: "read",
    requiresConfirmation: false,
    parameters: {
      title: { type: "string", description: "Product title", required: true },
      materials: { type: "string", description: "Craft materials used" },
      technique: { type: "string", description: "Artisan technique e.g. 'Hand-loom weaving', 'Bell metal casting'" },
    },
  },
  generateMarketingCopy: {
    name: "generateMarketingCopy",
    description: "Draft customer announcements, WhatsApp updates, or festive story blurbs.",
    category: "read",
    requiresConfirmation: false,
    parameters: {
      campaignTopic: { type: "string", description: "Theme or discount e.g. 'Diwali Handloom Collection'", required: true },
      targetAudience: { type: "string", description: "Audience segment e.g. 'Repeat buyers'" },
    },
  },
  updateInventoryStock: {
    name: "updateInventoryStock",
    description: "Adjust the available stock quantity for a product in the merchant catalogue.",
    category: "write",
    requiresConfirmation: true,
    parameters: {
      productId: { type: "string", description: "Product ID", required: true },
      newStock: { type: "number", description: "Updated stock quantity", required: true },
    },
  },
};
