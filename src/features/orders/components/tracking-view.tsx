"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  MapPin,
  Package,
  RotateCw,
  ShieldCheck,
  Truck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { OrderStatusBadge } from "./order-status-badge";
import type { Shipment, ShipmentEvent } from "@/features/orders/shipment-types";
import { trackingService } from "@/services/tracking.service";
import { toast } from "@/lib/toast";

export interface TrackingViewProps {
  orderId: string;
}

export function TrackingView({ orderId }: { orderId: string }) {
  const [shipment, setShipment] = React.useState<Shipment | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  const loadShipment = React.useCallback(async () => {
    try {
      const data = await trackingService.getShipment(orderId);
      setShipment(data);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  React.useEffect(() => {
    loadShipment();
  }, [loadShipment]);

  async function handleRefresh() {
    setRefreshing(true);
    try {
      const data = await trackingService.refreshTracking(orderId);
      setShipment(data);
      toast.success("Tracking Refreshed", "Latest courier checkpoint data retrieved.");
    } catch {
      toast.error("Error", "Could not refresh tracking. Please retry.");
    } finally {
      setRefreshing(false);
    }
  }

  function handleCopyAwb(awb?: string) {
    if (!awb) return;
    navigator.clipboard.writeText(awb);
    toast.success("AWB Copied", `Tracking number ${awb} copied to clipboard.`);
  }

  if (loading) {
    return (
      <div className="flex min-h-[350px] flex-col items-center justify-center gap-3 py-16">
        <div className="size-8 animate-spin rounded-full border-2 border-gold/20 border-t-gold" />
        <p className="text-body-sm text-ink-soft">Retrieving logistics tracking updates…</p>
      </div>
    );
  }

  if (!shipment) {
    return (
      <Card variant="surface" padding="lg" radius="xl" className="border-line shadow-card text-center max-w-lg mx-auto">
        <CardContent className="space-y-4 py-6">
          <AlertCircle className="size-12 text-warning mx-auto" />
          <h3 className="text-heading-lg font-semibold text-ink">Tracking Information Unavailable</h3>
          <p className="text-body-sm text-ink-soft">
            We couldn&apos;t find active logistics records for order ID <strong className="font-mono text-ink">{orderId}</strong>.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Button asChild variant="primary" size="md">
              <Link href="/account/orders">My Orders</Link>
            </Button>
            <Button variant="outline" size="md" onClick={loadShipment}>
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Tracking Summary Banner */}
      <Card variant="surface" padding="none" radius="xl" className="border-line shadow-card overflow-hidden">
        <div className="border-b border-line bg-surface-raised p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-heading-lg font-bold text-ink">
                {shipment.orderNumber}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-soft px-3 py-1 text-xs font-semibold text-gold-dark dark:text-gold border border-gold/30">
                <Truck className="size-3.5" />
                <span>{shipment.statusLabel}</span>
              </span>
            </div>
            <p className="text-caption text-ink-soft">
              Carrier: <strong className="text-ink font-medium">{shipment.carrier || "BlueDart Express"}</strong> · Tracking No:{" "}
              <button
                type="button"
                onClick={() => handleCopyAwb(shipment.trackingNumber)}
                className="font-mono font-bold text-gold-dark dark:text-gold hover:underline inline-flex items-center gap-1"
                title="Click to copy AWB"
              >
                <span>{shipment.trackingNumber}</span>
                <Copy className="size-3" />
              </button>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="gap-1.5"
            >
              <RotateCw className={`size-3.5 ${refreshing ? "animate-spin text-gold" : ""}`} />
              <span>{refreshing ? "Updating…" : "Refresh"}</span>
            </Button>
            <Button asChild variant="primary" size="sm" className="gap-1.5">
              <Link href={`/orders/${orderId}`}>Order Details</Link>
            </Button>
          </div>
        </div>

        {/* Route Hubs & Estimate */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-line p-6 bg-surface">
          <div className="py-2 md:py-0 md:pr-6 space-y-1">
            <span className="text-caption text-ink-faint flex items-center gap-1.5 uppercase font-medium">
              <Building2 className="size-3.5 text-gold-dark dark:text-gold" /> Origin Hub
            </span>
            <p className="text-body-sm font-semibold text-ink">{shipment.origin}</p>
          </div>

          <div className="py-2 md:py-0 md:px-6 space-y-1">
            <span className="text-caption text-ink-faint flex items-center gap-1.5 uppercase font-medium">
              <MapPin className="size-3.5 text-gold-dark dark:text-gold" /> Destination
            </span>
            <p className="text-body-sm font-semibold text-ink">{shipment.destination}</p>
          </div>

          <div className="py-2 md:py-0 md:pl-6 space-y-1">
            <span className="text-caption text-ink-faint flex items-center gap-1.5 uppercase font-medium">
              <Clock className="size-3.5 text-gold-dark dark:text-gold" /> Delivery Estimate
            </span>
            <p className="text-body-sm font-bold text-gold-dark dark:text-gold">
              {shipment.estimatedDelivery}
            </p>
            <span className="text-[11px] text-ink-faint block">
              Verified by carrier checkpoint scans
            </span>
          </div>
        </div>
      </Card>

      {/* Main Timeline & Tracking Verification */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Cols: Real Scanned Checkpoints */}
        <div className="lg:col-span-2 space-y-6">
          <Card variant="surface" padding="lg" radius="xl" className="border-line shadow-card">
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between border-b border-line pb-4">
                <h3 className="text-heading-md font-semibold text-ink">Shipment Checkpoints</h3>
                <span className="text-caption text-ink-soft">
                  Last verified: {shipment.lastUpdated ? new Date(shipment.lastUpdated).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "Recently"}
                </span>
              </div>

              {/* Checkpoint list */}
              <ol className="relative flex flex-col space-y-6">
                {shipment.events.map((evt, idx) => {
                  const isLatest = idx === 0;
                  const isLast = idx === shipment.events.length - 1;

                  return (
                    <li key={evt.id} className="relative flex gap-4">
                      {/* Vertical line connecting checkpoints */}
                      {!isLast && (
                        <div
                          className={`absolute left-4 top-8 -bottom-6 w-0.5 ${
                            isLatest ? "bg-gold" : "bg-line"
                          }`}
                          aria-hidden="true"
                        />
                      )}

                      {/* Checkpoint indicator */}
                      <div
                        className={`grid size-8 shrink-0 place-items-center rounded-full border-2 ${
                          isLatest
                            ? "border-gold bg-gold-soft text-gold-dark dark:text-gold ring-4 ring-gold/15"
                            : "border-line bg-surface text-ink-subtle"
                        }`}
                      >
                        {evt.status === "delivered" ? (
                          <CheckCircle2 className="size-4 text-success" />
                        ) : isLatest ? (
                          <Truck className="size-4" />
                        ) : (
                          <div className="size-2 rounded-full bg-ink-faint" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 pt-0.5 space-y-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className={`text-body-sm font-semibold ${isLatest ? "text-ink" : "text-ink-soft"}`}>
                            {evt.description}
                          </p>
                          <time className="text-caption text-ink-faint whitespace-nowrap">
                            {new Date(evt.eventTime).toLocaleDateString("en-IN", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </time>
                        </div>
                        {evt.location && (
                          <p className="text-caption text-ink-soft flex items-center gap-1">
                            <MapPin className="size-3 text-ink-faint" />
                            <span>{evt.location}</span>
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Logistics Information & Trust */}
        <div className="space-y-6">
          <Card variant="surface" padding="md" radius="xl" className="border-line shadow-card space-y-4">
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2.5 text-gold-dark dark:text-gold">
                <ShieldCheck className="size-5" />
                <h4 className="text-heading-sm font-semibold text-ink">Carrier Data Trust</h4>
              </div>
              <p className="text-caption text-ink-soft leading-relaxed">
                All checkpoint updates are verified by {shipment.carrier || "BlueDart"} surface logistics scans. Bhagya never displays simulated or fabricated live GPS coordinates.
              </p>
              <div className="rounded-lg bg-surface-raised p-3.5 text-caption space-y-1.5 border border-line">
                <div className="flex justify-between text-ink-soft">
                  <span>Last Location</span>
                  <strong className="text-ink">{shipment.lastLocation}</strong>
                </div>
                <div className="flex justify-between text-ink-soft">
                  <span>Verification</span>
                  <span className="text-success font-medium">Carrier Confirmed</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="surface" padding="md" radius="xl" className="border-line shadow-card space-y-3">
            <CardContent className="space-y-3">
              <h4 className="text-heading-sm font-semibold text-ink">Need Delivery Assistance?</h4>
              <p className="text-caption text-ink-soft leading-relaxed">
                If your parcel is delayed or you need to coordinate delivery instructions with the courier partner:
              </p>
              <p className="text-body-sm font-semibold text-ink">
                {shipment.supportContact}
              </p>
              <Link
                href="/help#shipping"
                className="text-body-sm text-gold-dark dark:text-gold hover:underline inline-flex items-center gap-1 font-medium pt-1"
              >
                <span>Read Bhagya Delivery Policy</span>
                <ExternalLink className="size-3.5" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
