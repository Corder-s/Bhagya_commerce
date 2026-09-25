/**
 * Notification Storage
 *
 * Provides safe localStorage persistence for customer notifications.
 */

import type { Notification, NotificationPreferences } from "@/features/notifications/notification-types";

const NOTIFICATIONS_KEY = "bhagya_notifications_v1";
const PREFERENCES_KEY = "bhagya_notif_prefs_v1";

const DEFAULT_PREFERENCES: NotificationPreferences = {
  orderUpdates: {
    email: true,
    sms: true,
    whatsapp: true,
    push: true,
  },
  deliveryAlerts: {
    email: true,
    sms: true,
    whatsapp: true,
    push: true,
  },
  marketing: {
    email: false,
    sms: false,
    whatsapp: false,
    push: false,
  },
};

const SEED_NOTIFICATIONS: Notification[] = [
  {
    id: "notif_01",
    type: "delivery",
    title: "Order Delivered",
    message: "Your order BG-20260115-VRN892 has been delivered. We hope you enjoy your handcrafted Varanasi Silk!",
    read: false,
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    actionUrl: "/orders/ord_demo_01",
    metadata: {
      orderId: "ord_demo_01",
      orderNumber: "BG-20260115-VRN892",
      status: "delivered",
    },
  },
  {
    id: "notif_02",
    type: "order",
    title: "Shipment Dispatched",
    message: "Order BG-20260210-KMR314 is on its way via BlueDart Express (AWB: BLUEDART-98421038).",
    read: false,
    createdAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    actionUrl: "/orders/ord_demo_02/tracking",
    metadata: {
      orderId: "ord_demo_02",
      orderNumber: "BG-20260210-KMR314",
      trackingNumber: "BLUEDART-98421038",
      status: "shipped",
    },
  },
  {
    id: "notif_03",
    type: "payment",
    title: "Payment Confirmed",
    message: "Payment of ₹4,890 for order BG-20260210-KMR314 was verified successfully via UPI.",
    read: true,
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    actionUrl: "/orders/ord_demo_02",
    metadata: {
      orderId: "ord_demo_02",
      amount: 4890,
      status: "confirmed",
    },
  },
  {
    id: "notif_04",
    type: "account",
    title: "Welcome to Bhagya Commerce",
    message: "Your unified Bhagya identity is active. Explore artisanal collections or track deliveries anytime.",
    read: true,
    createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    actionUrl: "/account",
  },
];

export const notificationStorage = {
  getNotifications(): Notification[] {
    if (typeof window === "undefined") return SEED_NOTIFICATIONS;
    try {
      const stored = window.localStorage.getItem(NOTIFICATIONS_KEY);
      if (!stored) {
        window.localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(SEED_NOTIFICATIONS));
        return SEED_NOTIFICATIONS;
      }
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : SEED_NOTIFICATIONS;
    } catch {
      return SEED_NOTIFICATIONS;
    }
  },

  saveNotifications(notifications: Notification[]): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
    } catch {
      // Storage error ignored
    }
  },

  getPreferences(): NotificationPreferences {
    if (typeof window === "undefined") return DEFAULT_PREFERENCES;
    try {
      const stored = window.localStorage.getItem(PREFERENCES_KEY);
      if (!stored) return DEFAULT_PREFERENCES;
      return JSON.parse(stored);
    } catch {
      return DEFAULT_PREFERENCES;
    }
  },

  savePreferences(prefs: NotificationPreferences): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(PREFERENCES_KEY, JSON.stringify(prefs));
    } catch {
      // Storage error ignored
    }
  },
};
