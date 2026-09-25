/**
 * Order Storage Abstraction (Step 5)
 *
 * Provides safe localStorage persistence for created orders, allowing confirmation
 * page reloads, order history queries, and order tracking to work seamlessly.
 *
 * SECURITY RULE:
 * Never store CVV, full card numbers, UPI PINs, or gateway secret tokens.
 */

import type { Order } from "@/features/orders/order-types";

const ORDERS_KEY = "bhagya_orders_v1";
const LAST_ORDER_ID_KEY = "bhagya_last_order_id_v1";

export const orderStorage = {
  getOrders(): Order[] {
    if (typeof window === "undefined") return [];
    try {
      const stored = window.localStorage.getItem(ORDERS_KEY);
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  getOrderById(id: string): Order | null {
    if (!id) return null;
    const orders = this.getOrders();
    return orders.find((o) => o.id === id || o.orderNumber === id) || null;
  },

  saveOrder(order: Order): void {
    if (typeof window === "undefined") return;
    try {
      const orders = this.getOrders();
      const existingIndex = orders.findIndex((o) => o.id === order.id);

      if (existingIndex >= 0) {
        orders[existingIndex] = order;
      } else {
        orders.unshift(order);
      }

      window.localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
      window.localStorage.setItem(LAST_ORDER_ID_KEY, order.id);
    } catch {
      // Storage quota or private mode error ignored
    }
  },

  updateOrder(id: string, updates: Partial<Order>): Order | null {
    if (typeof window === "undefined") return null;
    try {
      const orders = this.getOrders();
      const index = orders.findIndex((o) => o.id === id || o.orderNumber === id);
      if (index === -1) return null;

      const updated = {
        ...orders[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      orders[index] = updated;

      window.localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
      return updated;
    } catch {
      return null;
    }
  },

  getLastOrderId(): string | null {
    if (typeof window === "undefined") return null;
    try {
      return window.localStorage.getItem(LAST_ORDER_ID_KEY);
    } catch {
      return null;
    }
  },

  setLastOrderId(id: string): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(LAST_ORDER_ID_KEY, id);
    } catch {
      // Storage error ignored
    }
  },

  clearOrders(): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(ORDERS_KEY);
      window.localStorage.removeItem(LAST_ORDER_ID_KEY);
    } catch {
      // Storage error ignored
    }
  },
};
