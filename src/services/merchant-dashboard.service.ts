/**
 * Bhagya Commerce — Merchant Dashboard Domain Service (Step 9)
 *
 * Provides domain operations for:
 *   - Aggregating dashboard overview KPIs
 *   - Fetching actionable attention items (pending orders, low stock)
 *   - Recent orders, top products, inventory alerts and activity feeds
 *   - Product catalogue management and inline stock updates
 *
 * Establishes clean service boundaries for future Spring Boot REST endpoints:
 *   - GET   /api/v1/merchant/dashboard/overview
 *   - GET   /api/v1/merchant/dashboard/orders
 *   - GET   /api/v1/merchant/dashboard/products
 *   - GET   /api/v1/merchant/dashboard/inventory
 *   - GET   /api/v1/merchant/dashboard/activity
 *   - POST  /api/v1/merchant/products
 *   - PATCH /api/v1/merchant/inventory/{productId}
 *   - GET   /api/v1/merchant/customers
 */

import {
  SEED_ATTENTION_ITEMS,
  SEED_INVENTORY_ALERTS,
  SEED_MERCHANT_CUSTOMERS,
  SEED_MERCHANT_ORDERS,
  SEED_MERCHANT_PRODUCTS,
  SEED_OVERVIEW_METRICS,
  SEED_RECENT_ACTIVITY,
  SEED_TOP_PRODUCTS,
} from "@/data/merchant-dashboard";
import type {
  AttentionItem,
  DashboardOverviewMetrics,
  InventoryAlert,
  MerchantActivity,
  MerchantCustomer,
  MerchantOrder,
  MerchantProduct,
  TopProduct,
} from "@/features/merchant/dashboard-types";
import type { Store } from "@/features/merchant/merchant-types";
import { merchantStorage } from "@/lib/storage/merchant-storage";

class MerchantDashboardService {
  private productsState: MerchantProduct[] = [...SEED_MERCHANT_PRODUCTS];
  private ordersState: MerchantOrder[] = [...SEED_MERCHANT_ORDERS];
  private activitiesState: MerchantActivity[] = [...SEED_RECENT_ACTIVITY];

  /**
   * Fetch core dashboard overview metrics
   */
  async getOverview(_storeId?: string): Promise<DashboardOverviewMetrics> {
    await new Promise((resolve) => setTimeout(resolve, 80));

    const lowStock = this.productsState.filter((p) => p.stock > 0 && p.stock <= 5).length;
    const outOfStock = this.productsState.filter((p) => p.stock === 0).length;
    const pendingOrders = this.ordersState.filter(
      (o) => o.status === "confirmed" || o.status === "processing" || o.status === "pending",
    ).length;

    return {
      ...SEED_OVERVIEW_METRICS,
      activeProducts: this.productsState.filter((p) => p.status === "published").length,
      pendingOrdersCount: pendingOrders,
      lowStockCount: lowStock + outOfStock,
    };
  }

  /**
   * Fetch urgent attention items (actionable alerts)
   */
  async getNeedsAttention(_storeId?: string): Promise<AttentionItem[]> {
    await new Promise((resolve) => setTimeout(resolve, 60));

    const items: AttentionItem[] = [];

    const pendingCount = this.ordersState.filter(
      (o) => o.status === "confirmed" || o.status === "processing",
    ).length;

    if (pendingCount > 0) {
      items.push({
        id: "att_orders",
        type: "pending_orders",
        title: `${pendingCount} Orders Awaiting Dispatch`,
        count: pendingCount,
        description: "Paid customer orders awaiting packaging and shipping pickup.",
        actionLabel: "Review Orders",
        actionHref: "/merchant/orders",
        severity: "urgent",
      });
    }

    const lowStockCount = this.productsState.filter((p) => p.stock <= 5).length;
    if (lowStockCount > 0) {
      items.push({
        id: "att_stock",
        type: "low_stock",
        title: `${lowStockCount} Products Running Low in Stock`,
        count: lowStockCount,
        description: "Stock has fallen below your minimum inventory safety threshold.",
        actionLabel: "Update Stock",
        actionHref: "/merchant/inventory",
        severity: "warning",
      });
    }

    return items;
  }

  /**
   * Fetch recent orders
   */
  async getRecentOrders(_storeId?: string, limit = 5): Promise<MerchantOrder[]> {
    await new Promise((resolve) => setTimeout(resolve, 90));
    return this.ordersState.slice(0, limit);
  }

  /**
   * Fetch top selling products
   */
  async getTopProducts(_storeId?: string, limit = 4): Promise<TopProduct[]> {
    await new Promise((resolve) => setTimeout(resolve, 80));
    return SEED_TOP_PRODUCTS.slice(0, limit);
  }

  /**
   * Fetch inventory alerts (low stock or out of stock)
   */
  async getInventoryAlerts(_storeId?: string): Promise<InventoryAlert[]> {
    await new Promise((resolve) => setTimeout(resolve, 70));

    return this.productsState
      .filter((p) => p.stock <= 5)
      .map((p) => ({
        id: `inv_${p.id}`,
        productId: p.id,
        productName: p.name,
        sku: p.sku,
        currentStock: p.stock,
        threshold: 5,
        status: p.stock === 0 ? "out_of_stock" : "low_stock",
        lastRestockedAt: p.createdAt,
      }));
  }

  /**
   * Fetch chronological activity feed
   */
  async getRecentActivity(_storeId?: string, limit = 5): Promise<MerchantActivity[]> {
    await new Promise((resolve) => setTimeout(resolve, 60));
    return this.activitiesState.slice(0, limit);
  }

  /**
   * Fetch merchant products list with optional filtering
   */
  async getProducts(
    _storeId?: string,
    filter?: { status?: string; search?: string },
  ): Promise<MerchantProduct[]> {
    await new Promise((resolve) => setTimeout(resolve, 100));

    let list = [...this.productsState];

    if (filter?.status && filter.status !== "all") {
      list = list.filter((p) => p.status === filter.status);
    }

    if (filter?.search && filter.search.trim()) {
      const q = filter.search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      );
    }

    return list;
  }

  /**
   * Fetch inventory items (merchant products with stock info)
   */
  async getInventory(
    _storeId?: string,
    search?: string,
  ): Promise<MerchantProduct[]> {
    return this.getProducts(_storeId, { search });
  }

  /**
   * Add a new product to catalogue
   */
  async addProduct(
    _storeId: string,
    input: Partial<MerchantProduct>,
  ): Promise<MerchantProduct> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const id = `p_${Date.now()}`;
    const newProduct: MerchantProduct = {
      id,
      name: input.name?.trim() || "Untitled Artisan Product",
      slug: input.slug || input.name?.toLowerCase().replace(/\s+/g, "-") || id,
      category: input.category || "Handmade & Crafts",
      price: Number(input.price) || 999,
      mrp: input.mrp ? Number(input.mrp) : undefined,
      stock: Number(input.stock) || 10,
      status: input.status || "published",
      imageSrc: input.imageSrc || "/placeholder.png",
      sku: input.sku?.trim() || `SKU-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
      salesCount: 0,
      description: input.description,
    };

    this.productsState.unshift(newProduct);

    // Record activity
    this.activitiesState.unshift({
      id: `act_${Date.now()}`,
      type: "product_added",
      title: `Product created: ${newProduct.name}`,
      description: `Added to ${newProduct.category} catalogue with ${newProduct.stock} units`,
      timestamp: new Date().toISOString(),
      actionUrl: "/merchant/products",
    });

    return newProduct;
  }

  /**
   * Update product inventory stock
   */
  async updateProductStock(productId: string, newStock: number): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const idx = this.productsState.findIndex((p) => p.id === productId);
    if (idx === -1) return false;

    const oldStock = this.productsState[idx].stock;
    this.productsState[idx].stock = Math.max(0, newStock);

    // Record activity
    this.activitiesState.unshift({
      id: `act_${Date.now()}`,
      type: "stock_updated",
      title: `Stock updated: ${this.productsState[idx].name}`,
      description: `Stock adjusted from ${oldStock} to ${newStock} units`,
      timestamp: new Date().toISOString(),
      actionUrl: "/merchant/inventory",
    });

    return true;
  }

  /**
   * Fetch all merchant orders with optional status & search filter
   */
  async getOrders(
    _storeId?: string,
    filter?: { status?: string; search?: string },
  ): Promise<MerchantOrder[]> {
    await new Promise((resolve) => setTimeout(resolve, 100));

    let list = [...this.ordersState];

    if (filter?.status && filter.status !== "all") {
      list = list.filter((o) => o.status === filter.status);
    }

    if (filter?.search && filter.search.trim()) {
      const q = filter.search.trim().toLowerCase();
      list = list.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.itemPreviewNames.some((n) => n.toLowerCase().includes(q)),
      );
    }

    return list;
  }

  /**
   * Fetch merchant customers list
   */
  async getCustomers(_storeId?: string, search?: string): Promise<MerchantCustomer[]> {
    await new Promise((resolve) => setTimeout(resolve, 80));

    let list = [...SEED_MERCHANT_CUSTOMERS];

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q),
      );
    }

    return list;
  }

  /**
   * Update store profile settings
   */
  async updateStoreProfile(store: Store): Promise<Store> {
    await new Promise((resolve) => setTimeout(resolve, 350));
    merchantStorage.saveStore(store);

    // Record activity
    this.activitiesState.unshift({
      id: `act_${Date.now()}`,
      type: "store_updated",
      title: "Store settings updated",
      description: "Updated storefront identity and branding assets",
      timestamp: new Date().toISOString(),
      actionUrl: "/merchant/store",
    });

    return store;
  }
}

export const merchantDashboardService = new MerchantDashboardService();
