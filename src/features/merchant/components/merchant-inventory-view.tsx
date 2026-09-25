"use client";

import { AlertTriangle, Boxes, CheckCircle2, RefreshCw, Search } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StockUpdateModal } from "@/features/merchant/components/stock-update-modal";
import type { MerchantProduct } from "@/features/merchant/dashboard-types";
import { formatPrice } from "@/lib/format";
import { merchantDashboardService } from "@/services/merchant-dashboard.service";

export function MerchantInventoryView() {
  const [items, setItems] = React.useState<MerchantProduct[]>([]);
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [stockItem, setStockItem] = React.useState<{
    id: string;
    name: string;
    sku: string;
    currentStock: number;
  } | null>(null);

  const loadInventory = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await merchantDashboardService.getInventory(undefined, searchQuery);
      setItems(data);
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  React.useEffect(() => {
    loadInventory();
  }, [loadInventory]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div>
        <h1 className="font-display text-display-sm font-bold text-ink">
          Inventory Control
        </h1>
        <p className="text-body-sm text-ink-soft mt-0.5">
          Real-time stock units, SKU codes, and low-inventory restock triggers.
        </p>
      </div>

      {/* Search Input */}
      <Card variant="surface" padding="sm" radius="xl" className="border-line shadow-card bg-surface">
        <CardContent className="flex items-center justify-between p-2">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-ink-soft" />
            <Input
              placeholder="Search by product name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs h-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card variant="surface" padding="none" radius="xl" className="border-line shadow-card overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-ink-soft text-body-sm animate-pulse">
            Loading inventory ledger...
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Boxes className="size-10 text-ink-soft mx-auto" />
            <p className="text-body-sm font-semibold text-ink">No inventory records found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-caption divide-y divide-line">
              <thead className="bg-surface-subtle text-ink-soft uppercase text-[11px] tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Item & SKU</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Available Stock</th>
                  <th className="py-3.5 px-4">Stock Health</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line bg-surface text-ink">
                {items.map((item) => {
                  const isLow = item.stock > 0 && item.stock <= 5;
                  const isOut = item.stock === 0;

                  return (
                    <tr key={item.id} className="hover:bg-surface-subtle/40 transition-colors">
                      <td className="py-3.5 px-4 max-w-[280px]">
                        <span className="font-semibold text-body-sm text-ink block truncate">
                          {item.name}
                        </span>
                        <span className="font-mono text-[11px] text-ink-soft">
                          SKU: {item.sku}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-ink-soft">{item.category}</td>
                      <td className="py-3.5 px-4 font-bold font-mono text-body-sm tabular-nums">
                        {item.stock} units
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md ${
                            isOut
                              ? "bg-danger/15 text-danger border border-danger/30"
                              : isLow
                                ? "bg-[#9A6A20]/15 text-[#9A6A20] dark:text-[#C49A45] border border-[#9A6A20]/30"
                                : "bg-[#2F5E3D]/15 text-[#2F5E3D] border border-[#2F5E3D]/30"
                          }`}
                        >
                          {isOut ? "Out of Stock" : isLow ? "Low Stock (≤5)" : "In Stock"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setStockItem({
                              id: item.id,
                              name: item.name,
                              sku: item.sku,
                              currentStock: item.stock,
                            })
                          }
                          className="text-xs h-7 px-2.5"
                        >
                          <RefreshCw className="size-3" />
                          Adjust Stock
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <StockUpdateModal
        item={stockItem}
        isOpen={Boolean(stockItem)}
        onClose={() => setStockItem(null)}
        onUpdated={loadInventory}
      />
    </div>
  );
}
