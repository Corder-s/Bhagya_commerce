/**
 * Bhagya Commerce — Order Tracking & Shipment Service
 *
 * Frontend service abstraction prepared for future Spring Boot logistics endpoints:
 *  - GET /api/v1/orders/{id}/tracking
 *  - GET /api/v1/shipments/{id}/events
 *  - POST /api/v1/orders/{id}/tracking/refresh
 */

import type { Shipment, ShipmentEvent, ShipmentStatus } from "@/features/orders/shipment-types";
import { orderService } from "@/services/order.service";

class TrackingService {
  /**
   * Get shipment tracking details for an order
   */
  async getShipment(orderId: string): Promise<Shipment | null> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const order = await orderService.getOrder(orderId);
    if (!order) return null;

    const awb = order.trackingNumber || `BLUEDART-${order.orderNumber.replace(/[^0-9]/g, "").slice(0, 10) || "8923418290"}`;
    const carrier = order.carrier || "BlueDart Express";
    const origin = "Varanasi Artisan Cluster, UP";
    const destination = `${order.shippingAddress.city}, ${order.shippingAddress.state}`;

    let shipmentStatus: ShipmentStatus = "manifested";
    let statusLabel = "Shipment Manifested";

    switch (order.status) {
      case "confirmed":
      case "processing":
      case "pending":
        shipmentStatus = "manifested";
        statusLabel = "Awaiting Pickup from Artisan Hub";
        break;
      case "shipped":
        shipmentStatus = "in_transit";
        statusLabel = "In Transit to Destination Hub";
        break;
      case "out_for_delivery":
        shipmentStatus = "out_for_delivery";
        statusLabel = "Out for Delivery";
        break;
      case "delivered":
        shipmentStatus = "delivered";
        statusLabel = "Successfully Delivered";
        break;
      case "cancelled":
        shipmentStatus = "returned_to_origin";
        statusLabel = "Order Cancelled — Returned to Maker";
        break;
      case "refunded":
        shipmentStatus = "returned_to_origin";
        statusLabel = "Return Received & Inspected";
        break;
    }

    const orderDate = new Date(order.createdAt);
    const day1 = new Date(orderDate.getTime() + 6 * 3600 * 1000).toISOString();
    const day2 = new Date(orderDate.getTime() + 24 * 3600 * 1000).toISOString();
    const day3 = new Date(orderDate.getTime() + 48 * 3600 * 1000).toISOString();

    const events: ShipmentEvent[] = [
      {
        id: `shp_evt_1_${order.id}`,
        shipmentId: `shp_${order.id}`,
        status: "manifested",
        location: origin,
        description: "Electronic shipping manifest created by Bhagya logistics partner",
        eventTime: order.createdAt,
        source: "carrier",
      },
    ];

    if (["shipped", "out_for_delivery", "delivered"].includes(order.status)) {
      events.push(
        {
          id: `shp_evt_2_${order.id}`,
          shipmentId: `shp_${order.id}`,
          status: "picked_up",
          location: origin,
          description: "Package received at Varanasi logistics hub and scanned into transit network",
          eventTime: day1,
          source: "carrier",
        },
        {
          id: `shp_evt_3_${order.id}`,
          shipmentId: `shp_${order.id}`,
          status: "in_transit",
          location: "Lucknow Central Sorting Hub",
          description: "Transit container processed and forwarded to regional distribution center",
          eventTime: day2,
          source: "carrier",
        },
      );
    }

    if (["out_for_delivery", "delivered"].includes(order.status)) {
      events.push({
        id: `shp_evt_4_${order.id}`,
        shipmentId: `shp_${order.id}`,
        status: "out_for_delivery",
        location: `${order.shippingAddress.city} Delivery Center`,
        description: `Package assigned to last-mile courier agent for delivery to ${order.shippingAddress.postalCode}`,
        eventTime: day3,
        source: "carrier",
      });
    }

    if (order.status === "delivered") {
      events.push({
        id: `shp_evt_5_${order.id}`,
        shipmentId: `shp_${order.id}`,
        status: "delivered",
        location: destination,
        description: `Delivered and signed at doorstep (${order.shippingAddress.fullName})`,
        eventTime: new Date(orderDate.getTime() + 54 * 3600 * 1000).toISOString(),
        source: "carrier",
      });
    }

    // Sort newest event first for display
    events.sort((a, b) => new Date(b.eventTime).getTime() - new Date(a.eventTime).getTime());

    const isDelivered = order.status === "delivered";

    return {
      id: `shp_${order.id}`,
      orderId: order.id,
      orderNumber: order.orderNumber,
      carrier,
      trackingNumber: awb,
      status: shipmentStatus,
      statusLabel,
      origin,
      destination,
      estimatedDelivery: order.estimatedDelivery || "3–5 business days",
      actualDelivery: isDelivered ? events[0]?.eventTime : undefined,
      lastLocation: events[0]?.location || origin,
      lastUpdated: events[0]?.eventTime || order.createdAt,
      events,
      carrierVerificationStatus: "verified_by_carrier",
      supportContact: "+91 8000 123 456 (Bhagya Priority Dispatch)",
    };
  }

  /**
   * Refresh tracking updates from carrier adapter
   */
  async refreshTracking(orderId: string): Promise<Shipment | null> {
    await new Promise((resolve) => setTimeout(resolve, 350));
    return this.getShipment(orderId);
  }
}

export const trackingService = new TrackingService();
