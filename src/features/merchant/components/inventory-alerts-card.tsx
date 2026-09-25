"use client";

import { AlertTriangle, ArrowRight, Boxes, CheckCircle2, RefreshCw } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StockUpdateModal } from "@/features/merchant/components/stock-update-modal";
import type { InventoryAlert } from "@/features/merchant/dashboard-types";

export function InventoryAlertsCard({
  alerts,
  onRefresh,
}: {
  alerts: InventoryAlert[];
  onRefresh?: () => void;
}) {
  const [selectedItem, setSelectedItem] = React.useState<{
    id: string;
    name: string;
    sku: string;
    currentStock: number;
  } | null>(null);

  if (!alerts || alerts.length === 0) {
    return (
      <Card variant="surface" padding="md" radius="xl" className="border-line shadow-card">
        <CardContent className="flex items-center gap-3 p-1">
          <CheckCircle2 className="size-5 text-[#2F5E3D]" />
          <span className="text-body-sm text-ink-soft">
            <strong>Healthy Inventory:</strong> All active products are adequately stocked.
          </span>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card variant="surface" padding="none" radius="xl" className="border-line shadow-card overflow-hidden">
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-line bg-surface">
          <div className="flex items-center gap-2">
            <Boxes className="size-4 text-[#9A6A20] dark:text-[#C49A45]" />
            <h3 className="text-body-sm font-bold uppercase tracking-wider text-ink">
              Inventory Alerts
            </h3>
          </div>

          <Button asChild variant="ghost" size="sm" className="text-xs text-[#9A6A20] dark:text-[#C49A45] hover:underline">
            <Link href={"/merchant/inventory" as any}>
              Full Inventory
              <ArrowRight className="size-3" />
            </Link>
          </Button>
        </div>

        <div className="divide-y divide-line bg-surface">
          {alerts.map((alert) => {
            const isOutOfStock = alert.status === "out_of_stock";

            return (
              <div
                key={alert.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface-subtle/40 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-body-sm font-semibold text-ink">
                      {alert.productName}
                    </h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        isOutOfStock
                          ? "bg-danger/15 text-danger border border-danger/30"
                          : "bg-[#9A6A20]/15 text-[#9A6A20] dark:text-[#C49A45] border border-[#9A6A20]/30"
                      }`}
                    >
                      {isOutOfStock ? "Out of Stock" : `${alert.currentStock} Units Left`}
                    </span>
                  </div>

                  <p className="text-caption font-mono text-ink-soft">
                    SKU: {alert.sku} · Threshold: {alert.threshold} units
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setSelectedItem({
                      id: alert.productId,
                      name: alert.productName,
                      sku: alert.sku,
                      currentStock: alert.currentStock,
                    })
                  }
                  className="shrink-0 text-xs h-8"
                >
                  <RefreshCw className="size-3" />
                  Update Stock
                </Button>
              </div>
            );
          })}
        </div>
      </Card>

      <StockUpdateModal
        item={selectedItem}
        isOpen={Boolean(selectedItem)}
        onClose={() => setSelectedItem(null)}
        onUpdated={onRefresh}
      />
    </>
  );
}
