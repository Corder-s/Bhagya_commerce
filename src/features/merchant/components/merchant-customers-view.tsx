"use client";

import { Search, Users } from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { MerchantCustomer } from "@/features/merchant/dashboard-types";
import { formatPrice } from "@/lib/format";
import { merchantDashboardService } from "@/services/merchant-dashboard.service";

export function MerchantCustomersView() {
  const [customers, setCustomers] = React.useState<MerchantCustomer[]>([]);
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState(true);

  const loadCustomers = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await merchantDashboardService.getCustomers(undefined, searchQuery);
      setCustomers(data);
    } catch {
      // Safe fallback
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  React.useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div>
        <h1 className="font-display text-display-sm font-bold text-ink">
          Customer Relationships
        </h1>
        <p className="text-body-sm text-ink-soft mt-0.5">
          Buyers who have purchased handcrafted goods from your store.
        </p>
      </div>

      {/* Search Input */}
      <Card variant="surface" padding="sm" radius="xl" className="border-line shadow-card bg-surface">
        <CardContent className="flex items-center justify-between p-2">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-ink-soft" />
            <Input
              placeholder="Search by customer name or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs h-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card variant="surface" padding="none" radius="xl" className="border-line shadow-card overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-ink-soft text-body-sm animate-pulse">
            Loading customer list...
          </div>
        ) : customers.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Users className="size-10 text-ink-soft mx-auto" />
            <p className="text-body-sm font-semibold text-ink">No customer records found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-caption divide-y divide-line">
              <thead className="bg-surface-subtle text-ink-soft uppercase text-[11px] tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Total Orders</th>
                  <th className="py-3.5 px-4">Lifetime Spend</th>
                  <th className="py-3.5 px-4">Last Order</th>
                  <th className="py-3.5 px-4">Relationship</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line bg-surface text-ink">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-surface-subtle/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-body-sm text-ink block">
                        {c.name}
                      </span>
                      <span className="font-mono text-[11px] text-ink-soft">
                        {c.email}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-ink-soft">{c.city}</td>
                    <td className="py-3.5 px-4 font-semibold font-mono text-body-sm tabular-nums">
                      {c.ordersCount} {c.ordersCount === 1 ? "order" : "orders"}
                    </td>
                    <td className="py-3.5 px-4 font-bold font-display tabular-nums text-body-sm text-ink">
                      {formatPrice(c.totalSpent)}
                    </td>
                    <td className="py-3.5 px-4 text-ink-soft text-[11px] whitespace-nowrap">
                      {new Date(c.lastOrderDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        tone={c.status === "repeat" ? "gold" : c.status === "active" ? "success" : "neutral"}
                        size="sm"
                      >
                        {c.status === "repeat" ? "Repeat Patron" : c.status === "active" ? "Active" : "New"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
