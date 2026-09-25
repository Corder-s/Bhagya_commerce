/**
 * Bhagya Commerce — Shipment & Logistics Types
 *
 * Provider-neutral domain models separating Order from Shipment.
 * Prepared for future carrier webhook integration (e.g. Delhivery, Bluedart, Shiprocket).
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

export interface ShipmentEvent {
  id: string;
  shipmentId: string;
  status: ShipmentStatus | string;
  location?: string;
  description: string;
  eventTime: string;
  source: "carrier" | "bhagya_predicted";
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
}
