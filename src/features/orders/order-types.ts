import type { Address, CheckoutContact } from "@/features/checkout/checkout-types";
import type { CartItem } from "@/features/cart/cart-types";
import type { DeliveryMethod } from "@/data/delivery-methods";
import type { Payment } from "@/features/payment/payment-types";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "refunded";

export type OrderEventType =
  | "CART_CREATED"
  | "ITEM_ADDED"
  | "CHECKOUT_STARTED"
  | "ADDRESS_SELECTED"
  | "DELIVERY_SELECTED"
  | "PAYMENT_STARTED"
  | "PAYMENT_SUCCESS"
  | "PAYMENT_FAILED"
  | "ORDER_CREATED"
  | "ORDER_CONFIRMED"
  | "ORDER_PROCESSING"
  | "ORDER_SHIPPED"
  | "OUT_FOR_DELIVERY"
  | "ORDER_DELIVERED"
  | "ORDER_CANCELLED"
  | "REFUND_INITIATED"
  | "REFUND_COMPLETED";

export interface OrderEvent {
  id: string;
  type: OrderEventType;
  status: string;
  description: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface ReturnRequest {
  id: string;
  orderId: string;
  reason: string;
  comments?: string;
  status: "requested" | "approved" | "rejected" | "completed";
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  contact: CheckoutContact;
  shippingAddress: Address;
  deliveryMethod: DeliveryMethod;
  payment?: Payment;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  tax: number;
  total: number;
  status: OrderStatus;
  estimatedDelivery?: string;
  trackingNumber?: string;
  carrier?: string;
  returnRequest?: ReturnRequest;
  createdAt: string;
  updatedAt?: string;
  events?: OrderEvent[];
}

export interface CreateOrderInput {
  items: CartItem[];
  contact: CheckoutContact;
  shippingAddress: Address;
  deliveryMethod: DeliveryMethod;
  payment?: Payment;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  tax: number;
  total: number;
  status?: OrderStatus;
  idempotencyKey?: string;
}
