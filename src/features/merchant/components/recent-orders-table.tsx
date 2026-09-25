"use client";

import { ArrowRight, Eye, ReceiptIndianRupee } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { OrderQuickViewModal } from "@/features/merchant/components/order-quick-view-modal";
import type { MerchantOrder } from "@/features/merchant/dashboard-types";
import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";
import { formatPrice } from "@/lib/format";

export function RecentOrdersTable({
  orders,
  title = "Recent Orders",
  showViewAll = true,
}: {
  orders: MerchantOrder[];
  title?: string;
  showViewAll?: boolean;
}) {
  const [selectedOrder, setSelectedOrder] = React.useState<MerchantOrder | null>(null);

  if (!orders || orders.length === 0) {
    return (
      <Card variant="surface" padding="md" radius="xl" className="border-line shadow-card text-center py-8">
        <CardContent className="space-y-2">
          <ReceiptIndianRupee className="size-8 text-ink-soft mx-auto" />
          <h4 className="text-body-sm font-semibold text-ink">No orders received yet</h4>
          <p className="text-caption text-ink-soft">
            When customers purchase your handcrafted items, orders will appear here in real-time.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card variant="surface" padding="none" radius="xl" className="border-line shadow-card overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-line bg-surface">
          <div className="flex items-center gap-2">
            <ReceiptIndianRupee className="size-4 text-[#C49A45]" />
            <h3 className="text-body-sm font-bold uppercase tracking-wider text-ink">
              {title}
            </h3>
          </div>

          {showViewAll && (
            <Button asChild variant="ghost" size="sm" className="text-xs text-[#9A6A20] dark:text-[#C49A45] hover:underline">
              <Link href={"/merchant/orders" as any}>
                View All Orders
                <ArrowRight className="size-3" />
              </Link>
            </Button>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-caption divide-y divide-line">
            <thead className="bg-surface-subtle text-ink-soft uppercase text-[11px] tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line bg-surface text-ink">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-surface-subtle/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-semibold text-xs text-ink">
                    {order.orderNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-medium text-ink block">{order.customerName}</span>
                    <span className="text-[11px] text-ink-soft">{order.shippingCity}</span>
                  </td>
                  <td className="py-3.5 px-4 max-w-[200px]">
                    <span className="text-ink truncate block" title={order.itemPreviewNames.join(", ")}>
                      {order.itemPreviewNames[0]}
                      {order.itemCount > 1 ? ` +${order.itemCount - 1} more` : ""}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold font-display text-body-sm tabular-nums text-ink">
                    {formatPrice(order.total)}
                  </td>
                  <td className="py-3.5 px-4">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="py-3.5 px-4 text-ink-soft text-[11px] whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedOrder(order)}
                      className="text-xs h-7 px-2.5"
                    >
                      <Eye className="size-3" />
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Stacked Cards View */}
        <div className="md:hidden divide-y divide-line">
          {orders.map((order) => (
            <div key={order.id} className="p-4 space-y-2 bg-surface">
              <div className="flex items-center justify-between">
                <span className="font-mono font-semibold text-xs text-ink">
                  {order.orderNumber}
                </span>
                <OrderStatusBadge status={order.status} />
              </div>

              <div className="flex items-center justify-between text-caption">
                <span className="font-medium text-ink">{order.customerName} ({order.shippingCity})</span>
                <span className="font-display font-bold text-body-sm text-ink tabular-nums">
                  {formatPrice(order.total)}
                </span>
              </div>

              <p className="text-caption text-ink-soft truncate">
                {order.itemPreviewNames.join(", ")}
              </p>

              <div className="flex items-center justify-between pt-1 text-caption text-ink-soft">
                <span>
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedOrder(order)}
                  className="text-xs h-7 px-2"
                >
                  <Eye className="size-3" />
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <OrderQuickViewModal
        order={selectedOrder}
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
      />
    </>
  );
}
