/**
 * Bhagya Commerce — Order Domain Service (Step 7)
 *
 * Provides domain operations for creating, fetching, filtering, searching,
 * cancelling, returning, and managing customer orders.
 *
 * Establishes clean service boundaries for future Spring Boot REST endpoints:
 *   - GET  /api/v1/orders
 *   - GET  /api/v1/orders/{id}
 *   - POST /api/v1/orders
 *   - GET  /api/v1/orders/{id}/events
 *   - POST /api/v1/orders/{id}/cancel
 *   - POST /api/v1/orders/{id}/return
 *   - GET  /api/v1/orders/{id}/invoice
 */

import type {
  CreateOrderInput,
  Order,
  OrderEvent,
  OrderStatus,
  ReturnRequest,
} from "@/features/orders/order-types";
import { orderStorage } from "@/lib/storage/order-storage";
import { notificationService } from "@/services/notification.service";

/**
 * Seed realistic orders for demonstration and immediate evaluation
 */
const SEED_ORDERS: Order[] = [
  {
    id: "ord_demo_01",
    orderNumber: "BG-20260115-VRN892",
    items: [
      {
        id: "item_seed_01",
        productId: "p_silk_throw",
        name: "Handloom Cotton Throw Indigo",
        variantName: "Indigo Blue · 140x200 cm",
        slug: "handloom-cotton-throw-indigo",
        unitPrice: 2450,
        mrpInr: 3200,
        quantity: 1,
        imageSrc: "/placeholder.png",
        imageAlt: "Handloom Cotton Throw Indigo",
        brandName: "Varanasi Weavers Guild",
      },
    ],
    contact: {
      email: "aarav.sharma@example.com",
      phone: "+91 98765 43210",
    },
    shippingAddress: {
      id: "addr_01",
      fullName: "Aarav Sharma",
      phone: "+91 98765 43210",
      addressLine1: "42, Shanti Niketan, 4th Cross",
      addressLine2: "Indiranagar",
      city: "Bengaluru",
      state: "Karnataka",
      postalCode: "560038",
      country: "India",
      addressType: "home",
      isDefault: true,
    },
    deliveryMethod: {
      id: "del_standard",
      name: "Standard Ground Delivery",
      description: "Delivered via eco-friendly surface logistics",
      estimatedDays: "3–5 business days",
      price: 0,
    },
    payment: {
      id: "pay_seed_01",
      method: "upi",
      status: "captured",
      amount: 2450,
      currency: "INR",
      providerPaymentId: "UPI-IND-892348921043",
      createdAt: "2026-01-15T09:00:00.000Z",
      updatedAt: "2026-01-15T09:00:00.000Z",
    },
    subtotal: 2450,
    discount: 0,
    deliveryFee: 0,
    tax: 122.5,
    total: 2450,
    status: "delivered",
    estimatedDelivery: "Delivered on 18 Jan 2026",
    trackingNumber: "BLUEDART-8923418290",
    carrier: "BlueDart Express",
    createdAt: "2026-01-15T08:30:00.000Z",
    updatedAt: "2026-01-18T14:20:00.000Z",
    events: [
      {
        id: "evt_01_1",
        type: "ORDER_CREATED",
        status: "complete",
        description: "Order placed and confirmed",
        createdAt: "2026-01-15T08:30:00.000Z",
      },
      {
        id: "evt_01_2",
        type: "PAYMENT_SUCCESS",
        status: "complete",
        description: "Payment of ₹2,450 verified via UPI",
        createdAt: "2026-01-15T08:32:00.000Z",
      },
      {
        id: "evt_01_3",
        type: "ORDER_PROCESSING",
        status: "complete",
        description: "Item inspected and packaged at Varanasi Artisan Hub",
        createdAt: "2026-01-16T10:00:00.000Z",
      },
      {
        id: "evt_01_4",
        type: "ORDER_SHIPPED",
        status: "complete",
        description: "Dispatched via BlueDart Express (AWB: BLUEDART-8923418290)",
        createdAt: "2026-01-16T18:00:00.000Z",
      },
      {
        id: "evt_01_5",
        type: "OUT_FOR_DELIVERY",
        status: "complete",
        description: "Out for delivery with courier agent",
        createdAt: "2026-01-18T09:15:00.000Z",
      },
      {
        id: "evt_01_6",
        type: "ORDER_DELIVERED",
        status: "complete",
        description: "Delivered to Aarav Sharma at Bengaluru",
        createdAt: "2026-01-18T14:20:00.000Z",
      },
    ],
  },
  {
    id: "ord_demo_02",
    orderNumber: "BG-20260210-KMR314",
    items: [
      {
        id: "item_seed_02",
        productId: "p_walnut_bowl",
        name: "Handmade Kashmir Walnut Wood Bowl",
        variantName: "Natural Grain · 8 inch",
        slug: "handmade-kashmir-walnut-wood-bowl",
        unitPrice: 3890,
        mrpInr: 4500,
        quantity: 1,
        imageSrc: "/placeholder.png",
        imageAlt: "Handmade Kashmir Walnut Wood Bowl",
        brandName: "Srinagar Woodcraft Co.",
      },
      {
        id: "item_seed_03",
        productId: "p_brass_diya",
        name: "Handcrafted Brass Diya Lamp",
        variantName: "Traditional Polish",
        slug: "handcrafted-brass-diya-lamp",
        unitPrice: 1000,
        mrpInr: 1200,
        quantity: 1,
        imageSrc: "/placeholder.png",
        imageAlt: "Handcrafted Brass Diya Lamp",
        brandName: "Moradabad Brass Masters",
      },
    ],
    contact: {
      email: "aarav.sharma@example.com",
      phone: "+91 98765 43210",
    },
    shippingAddress: {
      id: "addr_01",
      fullName: "Aarav Sharma",
      phone: "+91 98765 43210",
      addressLine1: "42, Shanti Niketan, 4th Cross",
      addressLine2: "Indiranagar",
      city: "Bengaluru",
      state: "Karnataka",
      postalCode: "560038",
      country: "India",
      addressType: "home",
      isDefault: true,
    },
    deliveryMethod: {
      id: "del_express",
      name: "Priority Express Air",
      description: "Fast-tracked air courier with fragile handling",
      estimatedDays: "2 business days",
      price: 150,
    },
    payment: {
      id: "pay_seed_02",
      method: "card",
      status: "captured",
      amount: 4890,
      currency: "INR",
      providerPaymentId: "TXN-HDFC-9842103891",
      createdAt: "2026-02-10T11:00:00.000Z",
      updatedAt: "2026-02-10T11:00:00.000Z",
    },
    subtotal: 4890,
    discount: 150,
    deliveryFee: 150,
    tax: 244.5,
    total: 4890,
    status: "shipped",
    estimatedDelivery: "Expected in 2 business days",
    trackingNumber: "BLUEDART-98421038",
    carrier: "BlueDart Express",
    createdAt: "2026-02-10T10:45:00.000Z",
    updatedAt: "2026-02-11T08:30:00.000Z",
    events: [
      {
        id: "evt_02_1",
        type: "ORDER_CREATED",
        status: "complete",
        description: "Order placed and confirmed",
        createdAt: "2026-02-10T10:45:00.000Z",
      },
      {
        id: "evt_02_2",
        type: "PAYMENT_SUCCESS",
        status: "complete",
        description: "Payment of ₹4,890 authorized via Card",
        createdAt: "2026-02-10T10:48:00.000Z",
      },
      {
        id: "evt_02_3",
        type: "ORDER_PROCESSING",
        status: "complete",
        description: "Items packed in artisan protective packaging",
        createdAt: "2026-02-10T15:00:00.000Z",
      },
      {
        id: "evt_02_4",
        type: "ORDER_SHIPPED",
        status: "complete",
        description: "Handed over to BlueDart Express for transit to Bengaluru Hub",
        createdAt: "2026-02-11T08:30:00.000Z",
      },
    ],
  },
  {
    id: "ord_demo_03",
    orderNumber: "BG-20260301-BLR108",
    items: [
      {
        id: "item_seed_04",
        productId: "p_ashwagandha",
        name: "Ashwagandha Churna Organic Root Powder",
        variantName: "200g Jar",
        slug: "ashwagandha-churna-organic-root-powder",
        unitPrice: 480,
        mrpInr: 600,
        quantity: 2,
        imageSrc: "/placeholder.png",
        imageAlt: "Ashwagandha Churna Organic Root Powder",
        brandName: "Vedic Botanicals",
      },
    ],
    contact: {
      email: "aarav.sharma@example.com",
      phone: "+91 98765 43210",
    },
    shippingAddress: {
      id: "addr_01",
      fullName: "Aarav Sharma",
      phone: "+91 98765 43210",
      addressLine1: "42, Shanti Niketan, 4th Cross",
      addressLine2: "Indiranagar",
      city: "Bengaluru",
      state: "Karnataka",
      postalCode: "560038",
      country: "India",
      addressType: "home",
      isDefault: true,
    },
    deliveryMethod: {
      id: "del_standard",
      name: "Standard Ground Delivery",
      description: "Delivered via eco-friendly surface logistics",
      estimatedDays: "3–5 business days",
      price: 0,
    },
    payment: {
      id: "pay_seed_03",
      method: "cod",
      status: "pending",
      amount: 960,
      currency: "INR",
      createdAt: "2026-03-01T14:10:00.000Z",
      updatedAt: "2026-03-01T14:10:00.000Z",
    },
    subtotal: 960,
    discount: 0,
    deliveryFee: 0,
    tax: 48,
    total: 960,
    status: "confirmed",
    estimatedDelivery: "3–5 business days",
    createdAt: "2026-03-01T14:05:00.000Z",
    updatedAt: "2026-03-01T14:05:00.000Z",
    events: [
      {
        id: "evt_03_1",
        type: "ORDER_CREATED",
        status: "complete",
        description: "Order placed with Cash on Delivery",
        createdAt: "2026-03-01T14:05:00.000Z",
      },
      {
        id: "evt_03_2",
        type: "ORDER_CONFIRMED",
        status: "complete",
        description: "Order confirmed. Awaiting maker batch dispatch.",
        createdAt: "2026-03-01T14:10:00.000Z",
      },
    ],
  },
];

function generateOrderNumber(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `BG-${yyyy}${mm}${dd}-${rand}`;
}

class OrderService {
  private ensureInitialized() {
    if (typeof window === "undefined") return;
    const existing = orderStorage.getOrders();
    if (existing.length === 0) {
      SEED_ORDERS.forEach((o) => orderStorage.saveOrder(o));
    }
  }

  /**
   * Create a new order after checkout / payment authorization
   */
  async createOrder(input: CreateOrderInput): Promise<Order> {
    this.ensureInitialized();
    await new Promise((resolve) => setTimeout(resolve, 300));

    const id = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const orderNumber = generateOrderNumber();
    const now = new Date().toISOString();

    const isCod = input.payment?.method === "cod";
    const status: OrderStatus = input.status || "confirmed";

    const events: OrderEvent[] = [
      {
        id: `evt_${Date.now()}_1`,
        type: "ORDER_CREATED",
        status: "complete",
        description: `Order ${orderNumber} created successfully`,
        createdAt: now,
      },
    ];

    if (input.payment) {
      if (isCod) {
        events.push({
          id: `evt_${Date.now()}_2`,
          type: "ORDER_CONFIRMED",
          status: "complete",
          description: "Order placed with Cash on Delivery (Pay at Doorstep)",
          createdAt: now,
        });
      } else if (input.payment.status === "captured") {
        events.push(
          {
            id: `evt_${Date.now()}_2`,
            type: "PAYMENT_SUCCESS",
            status: "complete",
            description: `Payment of ₹${input.total.toLocaleString("en-IN")} received via ${input.payment.method.toUpperCase()}`,
            createdAt: now,
          },
          {
            id: `evt_${Date.now()}_3`,
            type: "ORDER_CONFIRMED",
            status: "complete",
            description: "Payment verified. Preparing order for dispatch.",
            createdAt: now,
          },
        );
      }
    }

    const order: Order = {
      id,
      orderNumber,
      items: input.items,
      contact: input.contact,
      shippingAddress: input.shippingAddress,
      deliveryMethod: input.deliveryMethod,
      payment: input.payment,
      subtotal: input.subtotal,
      discount: input.discount,
      deliveryFee: input.deliveryFee,
      tax: input.tax,
      total: input.total,
      status,
      estimatedDelivery: input.deliveryMethod?.estimatedDays || "3–5 business days",
      trackingNumber: `BLUEDART-${Math.floor(10000000 + Math.random() * 90000000)}`,
      carrier: "BlueDart Express",
      createdAt: now,
      updatedAt: now,
      events,
    };

    orderStorage.saveOrder(order);

    // Trigger notification
    notificationService.pushNotification({
      type: "order",
      title: "Order Placed Successfully",
      message: `Your order ${orderNumber} for ₹${input.total.toLocaleString("en-IN")} has been placed.`,
      actionUrl: `/orders/${order.id}`,
      metadata: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        amount: order.total,
      },
    }).catch(() => {});

    return order;
  }

  /**
   * Fetch order by ID or orderNumber
   */
  async getOrder(id: string): Promise<Order | null> {
    this.ensureInitialized();
    await new Promise((resolve) => setTimeout(resolve, 150));
    return orderStorage.getOrderById(id);
  }

  /**
   * Fetch all orders with optional filter and search query
   */
  async getOrders(options?: {
    status?: OrderStatus | "all";
    search?: string;
  }): Promise<Order[]> {
    this.ensureInitialized();
    await new Promise((resolve) => setTimeout(resolve, 150));

    let orders = orderStorage.getOrders();

    if (options?.status && options.status !== "all") {
      orders = orders.filter((o) => o.status === options.status);
    }

    if (options?.search && options.search.trim()) {
      const q = options.search.trim().toLowerCase();
      orders = orders.filter((o) => {
        const matchesNumber = o.orderNumber.toLowerCase().includes(q);
        const matchesItem = o.items.some((item) =>
          item.name.toLowerCase().includes(q) || item.brandName?.toLowerCase().includes(q),
        );
        return matchesNumber || matchesItem;
      });
    }

    return orders;
  }

  /**
   * Get events/timeline for an order
   */
  async getOrderEvents(id: string): Promise<OrderEvent[]> {
    const order = await this.getOrder(id);
    return order?.events || [];
  }

  /**
   * Cancel an order if it is in cancellable state
   */
  async cancelOrder(id: string, reason?: string): Promise<{ success: boolean; message: string }> {
    const order = await this.getOrder(id);
    if (!order) {
      return { success: false, message: "Order not found." };
    }

    if (["shipped", "out_for_delivery", "delivered", "cancelled"].includes(order.status)) {
      return {
        success: false,
        message: `Order cannot be cancelled because it is already ${order.status}.`,
      };
    }

    const now = new Date().toISOString();
    const updated = orderStorage.updateOrder(id, {
      status: "cancelled",
      events: [
        ...(order.events || []),
        {
          id: `evt_${Date.now()}`,
          type: "ORDER_CANCELLED",
          status: "complete",
          description: reason ? `Cancelled by customer: ${reason}` : "Order cancelled by customer",
          createdAt: now,
        },
      ],
    });

    if (updated) {
      notificationService.pushNotification({
        type: "order",
        title: "Order Cancelled",
        message: `Your order ${order.orderNumber} was cancelled successfully.`,
        actionUrl: `/orders/${order.id}`,
        metadata: { orderId: order.id, orderNumber: order.orderNumber },
      }).catch(() => {});
      return { success: true, message: "Order has been cancelled successfully." };
    }

    return { success: false, message: "Could not cancel order. Please try again." };
  }

  /**
   * Submit a return request for a delivered order
   */
  async requestReturn(id: string, reason: string, comments?: string): Promise<{ success: boolean; message: string }> {
    const order = await this.getOrder(id);
    if (!order) {
      return { success: false, message: "Order not found." };
    }

    if (order.status !== "delivered") {
      return { success: false, message: "Return requests can only be placed for delivered orders." };
    }

    const returnRequest: ReturnRequest = {
      id: `ret_${Date.now()}`,
      orderId: id,
      reason,
      comments,
      status: "requested",
      createdAt: new Date().toISOString(),
    };

    const updated = orderStorage.updateOrder(id, {
      returnRequest,
      events: [
        ...(order.events || []),
        {
          id: `evt_ret_${Date.now()}`,
          type: "REFUND_INITIATED",
          status: "complete",
          description: `Return requested: ${reason}. Artisan verification underway.`,
          createdAt: new Date().toISOString(),
        },
      ],
    });

    if (updated) {
      notificationService.pushNotification({
        type: "order",
        title: "Return Requested",
        message: `Return request received for ${order.orderNumber}. Our team will review within 24 hours.`,
        actionUrl: `/orders/${order.id}`,
        metadata: { orderId: order.id, orderNumber: order.orderNumber },
      }).catch(() => {});
      return { success: true, message: "Return request submitted successfully." };
    }

    return { success: false, message: "Unable to submit return request." };
  }
}

export const orderService = new OrderService();
