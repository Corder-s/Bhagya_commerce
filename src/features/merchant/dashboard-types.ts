/**
 * Bhagya Commerce — Merchant Dashboard Domain Types (Step 9)
 */

import type { OrderStatus } from "@/features/orders/order-types";

export interface DashboardOverviewMetrics {
  todaySales: number;
  salesChangePercent?: number | null;
  todayOrders: number;
  ordersChangePercent?: number | null;
  totalCustomers: number;
  activeProducts: number;
  pendingOrdersCount: number;
  lowStockCount: number;
}

export type AttentionSeverity = "urgent" | "warning" | "info";

export interface AttentionItem {
  id: string;
  type: "pending_orders" | "low_stock" | "payment_issue" | "delivery_issue";
  title: string;
  count: number;
  description: string;
  actionLabel: string;
  actionHref: string;
  severity: AttentionSeverity;
}

export interface MerchantOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  itemCount: number;
  itemPreviewNames: string[];
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  status: OrderStatus;
  createdAt: string;
  shippingCity: string;
  shippingAddressLine?: string;
}

export interface TopProduct {
  id: string;
  name: string;
  slug: string;
  imageSrc: string;
  category: string;
  price: number;
  unitsSold: number;
  ordersCount: number;
  revenue: number;
  stock: number;
}

export interface InventoryAlert {
  id: string;
  productId: string;
  productName: string;
  variantName?: string;
  sku: string;
  currentStock: number;
  threshold: number;
  status: "low_stock" | "out_of_stock";
  lastRestockedAt?: string;
}

export type ActivityType =
  | "order_received"
  | "order_shipped"
  | "stock_updated"
  | "product_added"
  | "store_updated";

export interface MerchantActivity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  actionUrl?: string;
}

export interface MerchantProduct {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  mrp?: number;
  stock: number;
  status: "published" | "draft" | "archived";
  imageSrc: string;
  sku: string;
  createdAt: string;
  salesCount: number;
  description?: string;
}

export interface MerchantCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderDate: string;
  status: "active" | "repeat" | "new";
}
