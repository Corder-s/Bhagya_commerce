/**
 * Bhagya Commerce — Shipping & Fulfillment Domain Service (Step 18)
 *
 * Provides operations for:
 *   - Calculating shipping rates (backend authoritative, free shipping above threshold)
 *   - Checking pincode serviceability & COD eligibility
 *   - Managing merchant order fulfillment workflow (process, pack, shipment, pickup)
 *   - Generating shipping labels & AWB tracking numbers
 *   - Scheduling carrier pickups
 */

import type {
  Fulfillment,
  FulfillmentStatus,
  PickupRequest,
  ServiceabilityResult,
  ShippingLabel,
  ShippingRate,
} from "@/features/orders/shipment-types";
import { notificationService } from "@/services/notification.service";

class ShippingService {
  private fulfillmentsMap: Map<string, Fulfillment> = new Map();
  private labelsMap: Map<string, ShippingLabel> = new Map();
  private pickupsMap: Map<string, PickupRequest> = new Map();

  constructor() {
    this.seedInitialFulfillments();
  }

  private seedInitialFulfillments() {
    const seedFulfillment: Fulfillment = {
      id: "ful_demo_01",
      orderId: "ord_demo_01",
      storeId: "store_varanasi_silk",
      status: "shipped",
      carrier: "Delhivery Express",
      trackingNumber: "DLH-99281745",
      packageWeightKg: 0.85,
      packageDimensions: "28x22x10 cm",
      notes: "Handwoven Varanasi pure silk throw enclosed with care certificate.",
      pickupScheduled: true,
      pickupReference: "PKP-DEL-89210",
      labelGenerated: true,
      createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    };
    this.fulfillmentsMap.set(seedFulfillment.orderId, seedFulfillment);

    this.labelsMap.set("ship_ord_demo_01", {
      id: "lbl_ord_demo_01",
      shipmentId: "ship_ord_demo_01",
      storageKey: "labels/ship_ord_demo_01/shipping_label.pdf",
      mimeType: "application/pdf",
      barcode: "DLH-99281745",
      downloadUrl: "/api/v1/merchant/shipments/ship_ord_demo_01/label",
      createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    });
  }

  /**
   * Get provider-neutral shipping rates (backend authoritative)
   */
  async getRates(params: {
    originPostalCode?: string;
    destinationPostalCode: string;
    weightKg?: number;
    declaredValueInr?: number;
  }): Promise<ShippingRate[]> {
    await new Promise((resolve) => setTimeout(resolve, 80));

    const isFree = (params.declaredValueInr ?? 0) >= 1500;
    const isHeavy = (params.weightKg ?? 0.5) > 1.0;

    const surfacePrice = isFree ? 0 : isHeavy ? 79 : 49;
    const expressPrice = isHeavy ? 149 : 99;

    return [
      {
        id: "rate_delhivery_surface",
        provider: "Delhivery",
        serviceCode: "SURFACE_STANDARD",
        serviceName: "Delhivery Surface Express",
        carrier: "Delhivery Express",
        estimatedDays: 3,
        price: surfacePrice,
        currency: "INR",
        codSupported: true,
        zone: "NATIONAL",
      },
      {
        id: "rate_bluedart_air",
        provider: "BlueDart",
        serviceCode: "AIR_PRIORITY",
        serviceName: "BlueDart Air Cargo Express",
        carrier: "BlueDart Logistics",
        estimatedDays: 2,
        price: expressPrice,
        currency: "INR",
        codSupported: true,
        zone: "NATIONAL",
      },
    ];
  }

  /**
   * Check delivery serviceability for an Indian pincode
   */
  async checkServiceability(postalCode: string): Promise<ServiceabilityResult> {
    await new Promise((resolve) => setTimeout(resolve, 60));

    const cleanPin = postalCode.trim();
    if (!/^\d{6}$/.test(cleanPin)) {
      return {
        postalCode: cleanPin,
        serviceable: false,
        status: "NOT_SERVICEABLE",
        codAvailable: false,
        estimatedDeliveryDays: 0,
        availableCarriers: [],
        message: "Please enter a valid 6-digit Indian PIN code.",
      };
    }

    if (cleanPin.startsWith("199")) {
      return {
        postalCode: cleanPin,
        serviceable: false,
        status: "NOT_SERVICEABLE",
        codAvailable: false,
        estimatedDeliveryDays: 0,
        availableCarriers: [],
        message: "Remote mountain zone — courier delivery currently unserviceable.",
      };
    }

    const isMetro = cleanPin.startsWith("560") || cleanPin.startsWith("110") || cleanPin.startsWith("400");

    return {
      postalCode: cleanPin,
      serviceable: true,
      status: "DELIVERABLE",
      codAvailable: true,
      estimatedDeliveryDays: isMetro ? 2 : 4,
      availableCarriers: ["Delhivery Express", "BlueDart Logistics", "Shadowfax Prime"],
      message: `Standard & Express courier delivery available with COD support (${isMetro ? "2–3" : "3–5"} business days).`,
    };
  }

  /**
   * Get or create fulfillment record for an order
   */
  async getFulfillment(orderId: string, storeId = "store_varanasi_silk"): Promise<Fulfillment> {
    await new Promise((resolve) => setTimeout(resolve, 50));

    if (this.fulfillmentsMap.has(orderId)) {
      return this.fulfillmentsMap.get(orderId)!;
    }

    const newFulfillment: Fulfillment = {
      id: `ful_${orderId}`,
      orderId,
      storeId,
      status: "unfulfilled",
      packageWeightKg: 0.5,
      packageDimensions: "25x20x8 cm",
      pickupScheduled: false,
      labelGenerated: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.fulfillmentsMap.set(orderId, newFulfillment);
    return newFulfillment;
  }

  /**
   * Execute merchant fulfillment action
   */
  async executeFulfillmentAction(
    orderId: string,
    action: "process" | "pack" | "create_shipment" | "request_pickup" | "ship" | "deliver" | "cancel",
    payload?: {
      carrier?: string;
      weightKg?: number;
      dimensions?: string;
      notes?: string;
      pickupDate?: string;
    },
  ): Promise<Fulfillment> {
    await new Promise((resolve) => setTimeout(resolve, 120));

    const fulfillment = await this.getFulfillment(orderId);

    switch (action) {
      case "process":
        fulfillment.status = "processing";
        break;

      case "pack":
        fulfillment.status = "packed";
        if (payload?.weightKg) fulfillment.packageWeightKg = payload.weightKg;
        if (payload?.dimensions) fulfillment.packageDimensions = payload.dimensions;
        if (payload?.notes) fulfillment.notes = payload.notes;
        break;

      case "create_shipment": {
        const carrier = payload?.carrier || "Delhivery Express";
        const awbNumber = `DLH-${Math.floor(10000000 + Math.random() * 90000000)}`;
        fulfillment.carrier = carrier;
        fulfillment.trackingNumber = awbNumber;
        fulfillment.status = "ready_for_pickup";
        fulfillment.labelGenerated = true;

        // Auto-generate label
        this.labelsMap.set(`ship_${orderId}`, {
          id: `lbl_${orderId}`,
          shipmentId: `ship_${orderId}`,
          storageKey: `labels/ship_${orderId}/label_${awbNumber}.pdf`,
          mimeType: "application/pdf",
          barcode: awbNumber,
          downloadUrl: `/api/v1/merchant/shipments/ship_${orderId}/label`,
          createdAt: new Date().toISOString(),
        });

        // Trigger notification
        notificationService.pushNotification({
          type: "order",
          title: "Shipment Created & AWB Assigned",
          message: `AWB ${awbNumber} generated with ${carrier}. Parcel ready for courier dispatch.`,
          actionUrl: `/orders/${orderId}/tracking`,
        });
        break;
      }

      case "request_pickup": {
        const carrier = fulfillment.carrier || "Delhivery Express";
        const ref = `PKP-${carrier.slice(0, 3).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;
        fulfillment.pickupScheduled = true;
        fulfillment.pickupReference = ref;

        this.pickupsMap.set(`ship_${orderId}`, {
          id: `pkp_${orderId}`,
          shipmentId: `ship_${orderId}`,
          carrier,
          pickupDate: payload?.pickupDate || new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
          status: "scheduled",
          referenceNumber: ref,
          notes: payload?.notes || "Fragile handcrafted goods packed in protective container",
          createdAt: new Date().toISOString(),
        });
        break;
      }

      case "ship":
        fulfillment.status = "shipped";
        break;

      case "deliver":
        fulfillment.status = "delivered";
        break;

      case "cancel":
        fulfillment.status = "cancelled";
        break;
    }

    fulfillment.updatedAt = new Date().toISOString();
    this.fulfillmentsMap.set(orderId, fulfillment);
    return fulfillment;
  }

  /**
   * Get generated shipping label for printing / download
   */
  async getShippingLabel(shipmentId: string): Promise<ShippingLabel | null> {
    await new Promise((resolve) => setTimeout(resolve, 60));
    return this.labelsMap.get(shipmentId) || null;
  }

  /**
   * Get scheduled pickup request details
   */
  async getPickupRequest(shipmentId: string): Promise<PickupRequest | null> {
    await new Promise((resolve) => setTimeout(resolve, 60));
    return this.pickupsMap.get(shipmentId) || null;
  }
}

export const shippingService = new ShippingService();
