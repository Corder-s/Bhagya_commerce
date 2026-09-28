/**
 * Bhagya Commerce — Shipment & Logistics Types (Step 18)
 *
 * Provider-neutral domain models separating Order from Shipment.
 * Prepared for carrier integrations (Delhivery, BlueDart, Shadowfax, etc.).
 */

export type ShipmentStatus =
  | "manifested"
  | "picked_up"
  | "in_transit"
  | "reached_hub"
  | "out_for_delivery"
  | "delivered"
  | "delayed"
  | "failed_attempt"
  | "returned_to_origin";

export type FulfillmentStatus =
  | "unfulfilled"
  | "processing"
  | "packed"
  | "ready_for_pickup"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface ShipmentEvent {
  id: string;
  shipmentId: string;
  status: ShipmentStatus | string;
  location?: string;
  description: string;
  eventTime: string;
  source: "carrier" | "bhagya_predicted";
}

export interface DeliveryAttempt {
  id: string;
  shipmentId: string;
  attemptNumber: number;
  status: "failed" | "rescheduled" | "rto_initiated";
  reason: string;
  actionRequired?: string;
  attemptedAt: string;
}

export interface ShippingLabel {
  id: string;
  shipmentId: string;
  storageKey: string;
  mimeType: string;
  barcode: string;
  downloadUrl: string;
  createdAt: string;
}

export interface PickupRequest {
  id: string;
  shipmentId: string;
  carrier: string;
  pickupDate: string;
  status: "scheduled" | "completed" | "rescheduled" | "cancelled";
  referenceNumber: string;
  notes?: string;
  createdAt: string;
}

export interface ShippingRate {
  id: string;
  provider: string;
  serviceCode: string;
  serviceName: string;
  carrier: string;
  estimatedDays: number;
  price: number;
  currency: string;
  codSupported: boolean;
  zone: string;
}

export interface ServiceabilityResult {
  postalCode: string;
  serviceable: boolean;
  status: "DELIVERABLE" | "NOT_SERVICEABLE" | "LIMITED_SERVICE";
  codAvailable: boolean;
  estimatedDeliveryDays: number;
  availableCarriers: string[];
  message: string;
}

export interface Fulfillment {
  id: string;
  orderId: string;
  storeId: string;
  status: FulfillmentStatus;
  carrier?: string;
  trackingNumber?: string;
  packageWeightKg: number;
  packageDimensions: string;
  notes?: string;
  pickupScheduled?: boolean;
  pickupReference?: string;
  labelGenerated?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Shipment {
  id: string;
  orderId: string;
  orderNumber: string;
  carrier?: string;
  trackingNumber?: string;
  status: ShipmentStatus;
  statusLabel: string;
  origin?: string;
  destination?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  lastLocation?: string;
  lastUpdated?: string;
  events: ShipmentEvent[];
  carrierVerificationStatus: "verified_by_carrier" | "estimated_by_bhagya";
  supportContact?: string;
  deliveryAttempts?: DeliveryAttempt[];
  ndrReason?: string;
  ndrActionRequired?: string;
}
