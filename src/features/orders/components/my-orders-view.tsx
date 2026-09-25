"use client";

import * as React from "react";
import { Package, Search, Sparkles } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { OrderCard } from "./order-card";
import type { Order, OrderStatus } from "@/features/orders/order-types";
import { orderService } from "@/services/order.service";

const STATUS_TABS: { label: string; value: OrderStatus | "all" }[] = [
  { label: "All Orders", value: "all" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Processing", value: "processing" },
  { label: "In Transit", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

export function MyOrdersView() {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<OrderStatus | "all">("all");
  const [searchQuery, setSearchQuery] = React.useState("");

  const loadOrders = React.useCallback(async () => {
    try {
      const data = await orderService.getOrders({
        status: activeTab,
        search: searchQuery,
      });
      setOrders(data);
    } finally {
      setLoading(false);
    }
  }, [activeTab, searchQuery]);

  React.useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Horizontal Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
          {STATUS_TABS.map((tab) => {
            const isActive = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => {
                  setActiveTab(tab.value);
                  setLoading(true);
                }}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-body-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? "bg-gradient-btn-gold text-[#151515] font-bold shadow-xs"
                    : "bg-surface border border-line text-ink-soft hover:text-ink hover:bg-surface-raised"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Order Search Input */}
        <div className="w-full md:w-72">
          <Input
            type="search"
            placeholder="Search by order # or product…"
            leadingIcon={<Search className="size-4" />}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            inputSize="md"
            className="w-full"
          />
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} variant="surface" padding="md" radius="xl" className="border-line shadow-card animate-pulse">
              <CardContent className="h-44 flex items-center justify-center">
                <div className="size-8 rounded-full border-2 border-gold/20 border-t-gold animate-spin" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <Card variant="surface" padding="lg" radius="xl" className="border-line shadow-card text-center py-12">
          <CardContent className="space-y-4 max-w-md mx-auto">
            <div className="grid size-16 place-items-center rounded-2xl bg-gold-soft text-gold-dark dark:text-gold border border-gold/20 mx-auto">
              <Package className="size-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-heading-lg font-semibold text-ink">
                {searchQuery ? "No matching orders found" : "No orders yet"}
              </h3>
              <p className="text-body-sm text-ink-soft leading-relaxed">
                {searchQuery
                  ? `No orders matching "${searchQuery}". Try searching with a different keyword or order number.`
                  : "When you purchase handloom textiles, ayurvedic wellness, or artisanal decor on Bhagya, your orders will appear here with live tracking."}
              </p>
            </div>
            <div className="pt-2 flex justify-center gap-3">
              {searchQuery ? (
                <Button variant="outline" size="md" onClick={() => setSearchQuery("")}>
                  Clear Search
                </Button>
              ) : (
                <Button asChild variant="primary" size="lg">
                  <Link href="/shop">Browse the Shop</Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} onRefresh={loadOrders} />
          ))}
        </div>
      )}

      {/* Footer Identity Hint */}
      <div className="rounded-xl border border-line bg-surface-raised p-4 flex items-center gap-3 text-caption text-ink-soft">
        <Sparkles className="size-4 text-gold-dark dark:text-gold shrink-0" />
        <span>
          Every purchase directly supports verified Indian artisan clusters. Track your deliveries anytime with your single Bhagya login.
        </span>
      </div>
    </div>
  );
}
