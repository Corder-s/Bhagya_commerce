import * as React from "react";
import { CheckCircle2, Clock, Package, RotateCcw, Truck, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@/features/orders/order-types";
import { cn } from "@/lib/utils";

export interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
  size?: "sm" | "md";
}

const statusConfig: Record<
  OrderStatus,
  {
    label: string;
    tone: "primary" | "success" | "warning" | "danger" | "neutral";
    icon: React.ComponentType<{ className?: string }>;
    className?: string;
  }
> = {
  pending: {
    label: "Payment Pending",
    tone: "warning",
    icon: Clock,
  },
  confirmed: {
    label: "Order Confirmed",
    tone: "success",
    icon: CheckCircle2,
  },
  processing: {
    label: "Artisan Processing",
    tone: "primary",
    icon: Package,
  },
  shipped: {
    label: "In Transit",
    tone: "primary",
    icon: Truck,
  },
  out_for_delivery: {
    label: "Out for Delivery",
    tone: "primary",
    icon: Truck,
  },
  delivered: {
    label: "Delivered",
    tone: "success",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    tone: "danger",
    icon: XCircle,
  },
  refunded: {
    label: "Refunded",
    tone: "neutral",
    icon: RotateCcw,
  },
};

export function OrderStatusBadge({ status, className, size = "md" }: OrderStatusBadgeProps) {
  const config = statusConfig[status] || {
    label: status,
    tone: "neutral",
    icon: Package,
  };
  const Icon = config.icon;

  return (
    <Badge
      tone={config.tone}
      size={size}
      className={cn("inline-flex items-center gap-1.5 font-medium tracking-tight", className)}
    >
      <Icon className={size === "sm" ? "size-3" : "size-3.5"} aria-hidden="true" />
      <span>{config.label}</span>
    </Badge>
  );
}
