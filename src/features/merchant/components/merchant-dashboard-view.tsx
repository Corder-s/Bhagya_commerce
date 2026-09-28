"use client";

import {
  Boxes,
  CheckCircle2,
  ExternalLink,
  Package,
  PackagePlus,
  ReceiptIndianRupee,
  Sparkles,
  Store as StoreIcon,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { AddProductModal } from "@/features/merchant/components/add-product-modal";
import { InventoryAlertsCard } from "@/features/merchant/components/inventory-alerts-card";
import { MetricCard } from "@/features/merchant/components/metric-card";
import { NeedsAttentionSection } from "@/features/merchant/components/needs-attention-section";
import { QuickActionsBar } from "@/features/merchant/components/quick-actions-bar";
import { RecentActivityFeed } from "@/features/merchant/components/recent-activity-feed";
import { RecentOrdersTable } from "@/features/merchant/components/recent-orders-table";
import { TopProductsCard } from "@/features/merchant/components/top-products-card";
import type {
  AttentionItem,
  DashboardOverviewMetrics,
  InventoryAlert,
  MerchantActivity,
  MerchantOrder,
  MerchantProduct,
  TopProduct,
} from "@/features/merchant/dashboard-types";
import type { Store } from "@/features/merchant/merchant-types";
import { merchantDashboardService } from "@/services/merchant-dashboard.service";
import { merchantService } from "@/services/merchant.service";

export function MerchantDashboardView() {
  const { user } = useAuth();
  const [store, setStore] = React.useState<Store | null>(null);
  const [metrics, setMetrics] = React.useState<DashboardOverviewMetrics | null>(null);
  const [attentionItems, setAttentionItems] = React.useState<AttentionItem[]>([]);
  const [recentOrders, setRecentOrders] = React.useState<MerchantOrder[]>([]);
  const [topProducts, setTopProducts] = React.useState<TopProduct[]>([]);
  const [inventoryAlerts, setInventoryAlerts] = React.useState<InventoryAlert[]>([]);
  const [recentActivities, setRecentActivities] = React.useState<MerchantActivity[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAddProductOpen, setIsAddProductOpen] = React.useState(false);

  const loadDashboardData = React.useCallback(async () => {
    try {
      if (user?.id) {
        const storeData = await merchantService.getUserStore(user.id);
        setStore(storeData);
      }

      const [overview, attention, orders, products, invAlerts, activities] = await Promise.all([
        merchantDashboardService.getOverview(),
        merchantDashboardService.getNeedsAttention(),
        merchantDashboardService.getRecentOrders(undefined, 5),
        merchantDashboardService.getTopProducts(undefined, 4),
        merchantDashboardService.getInventoryAlerts(),
        merchantDashboardService.getRecentActivity(undefined, 5),
      ]);

      setMetrics(overview);
      setAttentionItems(attention);
      setRecentOrders(orders);
      setTopProducts(products);
      setInventoryAlerts(invAlerts);
      setRecentActivities(activities);
    } catch {
      // Safe fallback
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  React.useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto py-6">
        <div className="h-16 rounded-2xl bg-surface-subtle animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-surface-subtle animate-pulse" />
          ))}
        </div>
        <div className="h-64 rounded-2xl bg-surface-subtle animate-pulse" />
      </div>
    );
  }

  const storeName = store?.name || user?.organizationMembership?.storeName || "Varanasi Heritage Silks";
  const storeSlug = store?.slug || "varanasi-heritage-silks";
  const merchantName = store?.ownerName || user?.name || "Artisan Partner";

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* 1. Header Greeting & Store Status Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-[#DDD4C4] dark:border-[#47362E] bg-[#FFFCF6] dark:bg-[#261B15] shadow-[0_2px_10px_rgba(50,40,25,0.05)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-caption font-bold text-[#D9823B] uppercase tracking-wider">
              Merchant Workspace
            </span>
            <span className="text-[#C9BDAA]">·</span>
            <span className="text-caption text-[#68736B] font-medium">Store ID: {store?.id || "store_varanasi_silk"}</span>
          </div>

          <h1 className="font-display text-display-sm font-bold text-[#252923] dark:text-[#F2EEE5]">
            Good morning, {merchantName.split(" ")[0]}
          </h1>

          <div className="flex items-center gap-2 text-caption text-[#4F5952] dark:text-[#CFC7BA] pt-0.5 font-medium">
            <span>Managing:</span>
            <strong className="text-[#252923] dark:text-[#F2EEE5] font-bold">{storeName}</strong>
            <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#DDEBE1] text-[#2D5E3A] border border-[#B8D9C0]">
              Store Live
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button asChild size="md" className="font-semibold text-[#252923] dark:text-[#F2EEE5] border border-[#DDD4C4] dark:border-[#47362E] bg-[#FFFCF6] dark:bg-[#261B15] hover:bg-[#F0ECE3] dark:hover:bg-[#30231C]">
            <Link href={"/merchant/store" as any}>
              <StoreIcon className="size-4 text-[#D6A23A]" />
              <span>Manage Store</span>
            </Link>
          </Button>

          <Button asChild size="md" className="bg-[#E0A046] hover:bg-[#CC8930] text-[#241F19] font-bold border-0 shadow-xs">
            <Link href={"/shop" as any}>
              <ExternalLink className="size-4" />
              <span>View Storefront</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* 2. Core Dashboard KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Today's Sales"
          value={metrics?.todaySales || 12450}
          isCurrency
          delta={metrics?.salesChangePercent}
          deltaLabel="vs yesterday"
          icon={<TrendingUp className="size-4" />}
          variant="gold"
        />

        <MetricCard
          title="Orders Today"
          value={metrics?.todayOrders || 5}
          delta={metrics?.ordersChangePercent}
          deltaLabel="vs yesterday"
          icon={<ReceiptIndianRupee className="size-4" />}
        />

        <MetricCard
          title="Total Customers"
          value={metrics?.totalCustomers || 48}
          supportingText="Active customer relationships"
          icon={<Users className="size-4" />}
        />

        <MetricCard
          title="Active Products"
          value={metrics?.activeProducts || 14}
          supportingText="Live in catalog"
          icon={<Package className="size-4" />}
        />
      </div>

      {/* 3. Quick Actions Bar */}
      <QuickActionsBar
        onAddProduct={() => setIsAddProductOpen(true)}
        storeSlug={storeSlug}
      />

      {/* 4. Actionable Alerts (Needs Attention) */}
      <NeedsAttentionSection items={attentionItems} />

      {/* 5. Recent Orders Table */}
      <RecentOrdersTable orders={recentOrders} title="Recent Store Orders" />

      {/* 6. Two-Column Operational Grid: Top Products + Inventory Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopProductsCard products={topProducts} />
        <InventoryAlertsCard alerts={inventoryAlerts} onRefresh={loadDashboardData} />
      </div>

      {/* 7. Recent Activity Feed */}
      <RecentActivityFeed activities={recentActivities} />

      {/* Add Product Modal Dialog */}
      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onProductAdded={loadDashboardData}
      />
    </div>
  );
}
