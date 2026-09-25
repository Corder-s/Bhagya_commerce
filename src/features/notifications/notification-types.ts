/**
 * Bhagya Commerce — Customer Notification Models
 */

export type NotificationType =
  | "order"
  | "payment"
  | "delivery"
  | "account"
  | "system";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  metadata?: {
    orderId?: string;
    orderNumber?: string;
    amount?: number;
    trackingNumber?: string;
    status?: string;
    [key: string]: unknown;
  };
}

export interface NotificationPreferences {
  orderUpdates: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
    push: boolean;
  };
  deliveryAlerts: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
    push: boolean;
  };
  marketing: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
    push: boolean;
  };
}
