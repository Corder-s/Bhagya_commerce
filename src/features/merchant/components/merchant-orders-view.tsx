"use client";

import { ReceiptIndianRupee, Search } from "lucide-react";
import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RecentOrdersTable } from "@/features/merchant/components/recent-orders-table";
import type { MerchantOrder } from "@/features/merchant/dashboard-types";
import { merchantDashboardService } from "@/services/merchant-dashboard.service";

export function MerchantOrdersView() {
  const [orders, setOrders] = React.useState<MerchantOrder[]>([]);
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState(true);

  const loadOrders = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await merchantDashboardService.getOrders(undefined, {
        status: selectedStatus,
        search: searchQuery,
      });
      setOrders(data);
    } catch {
      // Safe fallback
    } finally {
      setIsLoading(false);
    }
  }, [selectedStatus, searchQuery]);

  React.useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div>
        <h1 className="font-display text-display-sm font-bold text-ink">
          Store Orders
        </h1>
        <p className="text-body-sm text-ink-soft mt-0.5">
          Process customer purchases, schedule courier dispatch, and track fulfilment.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <Card variant="surface" padding="sm" radius="xl" className="border-line shadow-card bg-surface">
        <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-3 p-2">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {[
              { id: "all", label: "All Orders" },
              { id: "confirmed", label: "Confirmed" },
              { id: "processing", label: "Processing" },
              { id: "shipped", label: "Shipped" },
              { id: "delivered", label: "Delivered" },
            ].map((tab) => (
              <button
                type="button"
                key={tab.id}
                onClick={() => setSelectedStatus(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedStatus === tab.id
                    ? "bg-[#C49A45] text-[#151515]"
                    : "text-ink-soft hover:bg-surface-subtle hover:text-ink"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-ink-soft" />
            <Input
              placeholder="Search by order # or buyer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs h-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Orders List / Table */}
      <RecentOrdersTable orders={orders} title="Fulfilment Orders" showViewAll={false} />
    </div>
  );
}
