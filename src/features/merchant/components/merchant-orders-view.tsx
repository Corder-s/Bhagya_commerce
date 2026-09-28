"use client";

import { Box, CheckCircle2, Clock, ReceiptIndianRupee, Search, Send, Truck } from "lucide-react";
import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RecentOrdersTable } from "@/features/merchant/components/recent-orders-table";
import type { MerchantOrder } from "@/features/merchant/dashboard-types";
import { merchantDashboardService } from "@/services/merchant-dashboard.service";

export function MerchantOrdersView() {
  const [allOrders, setAllOrders] = React.useState<MerchantOrder[]>([]);
  const [orders, setOrders] = React.useState<MerchantOrder[]>([]);
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState(true);

  const loadOrders = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const all = await merchantDashboardService.getOrders(undefined, { status: "all" });
      setAllOrders(all);

      const filtered = await merchantDashboardService.getOrders(undefined, {
        status: selectedStatus,
        search: searchQuery,
      });
      setOrders(filtered);
    } catch {
      // Safe fallback
    } finally {
      setIsLoading(false);
    }
  }, [selectedStatus, searchQuery]);

  React.useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Compute logistics metrics backed by actual order data
  const toPackCount = allOrders.filter(
    (o) => o.status === "confirmed" || o.status === "processing" || o.status === "pending",
  ).length;
  const inTransitCount = allOrders.filter(
    (o) => o.status === "shipped" || o.status === "out_for_delivery",
  ).length;
  const deliveredCount = allOrders.filter((o) => o.status === "delivered").length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div>
        <h1 className="font-display text-display-sm font-bold text-ink">
          Store Orders & Logistics
        </h1>
        <p className="text-body-sm text-ink-soft mt-0.5">
          Process customer purchases, package parcels, generate AWBs, and schedule carrier dispatch.
        </p>
      </div>

      {/* Logistics KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card variant="surface" padding="sm" radius="xl" className="border-line shadow-card bg-surface">
          <CardContent className="p-3 space-y-1">
            <div className="flex items-center justify-between text-ink-soft">
              <span className="text-caption font-semibold">Total Orders</span>
              <ReceiptIndianRupee className="size-4 text-[#E89535]" />
            </div>
            <p className="font-display text-heading-md font-bold text-ink">{allOrders.length}</p>
            <p className="text-[11px] text-ink-soft">Received through store</p>
          </CardContent>
        </Card>

        <Card variant="surface" padding="sm" radius="xl" className="border-line shadow-card bg-surface">
          <CardContent className="p-3 space-y-1">
            <div className="flex items-center justify-between text-ink-soft">
              <span className="text-caption font-semibold">To Pack & Inspect</span>
              <Box className="size-4 text-amber-600 dark:text-amber-400" />
            </div>
            <p className="font-display text-heading-md font-bold text-ink">{toPackCount}</p>
            <p className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">Pending parcel dispatch</p>
          </CardContent>
        </Card>

        <Card variant="surface" padding="sm" radius="xl" className="border-line shadow-card bg-surface">
          <CardContent className="p-3 space-y-1">
            <div className="flex items-center justify-between text-ink-soft">
              <span className="text-caption font-semibold">In Transit</span>
              <Truck className="size-4 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="font-display text-heading-md font-bold text-ink">{inTransitCount}</p>
            <p className="text-[11px] text-blue-700 dark:text-blue-400 font-medium">Handed to carrier</p>
          </CardContent>
        </Card>

        <Card variant="surface" padding="sm" radius="xl" className="border-line shadow-card bg-surface">
          <CardContent className="p-3 space-y-1">
            <div className="flex items-center justify-between text-ink-soft">
              <span className="text-caption font-semibold">Delivered</span>
              <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="font-display text-heading-md font-bold text-ink">{deliveredCount}</p>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">Doorstep completed</p>
          </CardContent>
        </Card>
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
                    ? "bg-[#E89535] text-[#241812] font-bold"
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
      <RecentOrdersTable
        orders={orders}
        title="Fulfilment Orders"
        showViewAll={false}
        onOrderUpdated={loadOrders}
      />
    </div>
  );
}
