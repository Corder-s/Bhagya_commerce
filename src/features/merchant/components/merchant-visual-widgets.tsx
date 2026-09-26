'use client';

import React from 'react';
import { formatCurrency, formatNumber } from '@/lib/format';
import { Badge } from '@/components/ui/badge';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Boxes,
  ShoppingBag,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';

interface OrderStatusBreakdown {
  confirmedOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders?: number;
}

export function OrderStatusVisualCard({
  orders,
  totalOrders,
}: {
  orders: OrderStatusBreakdown;
  totalOrders: number;
}) {
  const statuses = [
    {
      label: 'Delivered',
      count: orders.deliveredOrders || 0,
      color: 'bg-success',
      textColor: 'text-success',
      icon: <CheckCircle2 className="size-3.5 text-success" />,
    },
    {
      label: 'Shipped',
      count: orders.shippedOrders || 0,
      color: 'bg-primary',
      textColor: 'text-primary',
      icon: <Truck className="size-3.5 text-primary" />,
    },
    {
      label: 'Processing',
      count: orders.processingOrders || 0,
      color: 'bg-warning',
      textColor: 'text-warning',
      icon: <Clock className="size-3.5 text-warning" />,
    },
    {
      label: 'Confirmed',
      count: orders.confirmedOrders || 0,
      color: 'bg-sand-strong',
      textColor: 'text-ink-soft',
      icon: <Package className="size-3.5 text-ink-soft" />,
    },
  ];

  const validTotal = Math.max(totalOrders, 1);

  return (
    <div className="rounded-2xl border border-line bg-surface p-5 shadow-md flex flex-col justify-between transition-colors">
      <div>
        <div className="flex items-center justify-between border-b border-line pb-3">
          <div>
            <h3 className="font-serif text-base font-semibold text-ink">Order Status Breakdown</h3>
            <p className="text-xs text-ink-soft mt-0.5">Live fulfillment pipeline</p>
          </div>
          <span className="rounded-full bg-surface-sunken px-2.5 py-0.5 text-xs font-semibold text-primary border border-line">
            {totalOrders} Total
          </span>
        </div>

        {/* Multi-segment stacked progress bar */}
        <div className="mt-4 space-y-2">
          <div className="flex h-3 w-full overflow-hidden rounded-full bg-surface-sunken border border-line">
            {statuses.map((st) => {
              const widthPct = (st.count / validTotal) * 100;
              if (widthPct === 0) return null;
              return (
                <div
                  key={st.label}
                  style={{ width: `${widthPct}%` }}
                  className={`${st.color} transition-all duration-300`}
                  title={`${st.label}: ${st.count} orders (${Math.round(widthPct)}%)`}
                />
              );
            })}
          </div>
        </div>

        {/* Status Rows */}
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          {statuses.map((st) => {
            const pct = Math.round((st.count / validTotal) * 100);
            return (
              <div
                key={st.label}
                className="flex items-center justify-between rounded-xl border border-line bg-surface-sunken p-2.5"
              >
                <div className="flex items-center gap-2">
                  {st.icon}
                  <span className="text-xs font-medium text-ink-soft">{st.label}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-ink">{st.count}</span>
                  <span className="text-[10px] text-ink-subtle block">{pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function InventoryHealthVisualCard({
  healthyCount = 24,
  lowStockCount = 5,
  outOfStockCount = 1,
}: {
  healthyCount?: number;
  lowStockCount?: number;
  outOfStockCount?: number;
}) {
  const total = healthyCount + lowStockCount + outOfStockCount || 1;
  const healthyPct = Math.round((healthyCount / total) * 100);
  const lowPct = Math.round((lowStockCount / total) * 100);
  const outPct = Math.round((outOfStockCount / total) * 100);

  return (
    <div className="rounded-2xl border border-line bg-surface p-5 shadow-md flex flex-col justify-between transition-colors">
      <div>
        <div className="flex items-center justify-between border-b border-line pb-3">
          <div className="flex items-center gap-2">
            <Boxes className="size-4 text-primary" />
            <h3 className="font-serif text-base font-semibold text-ink">Stock & Inventory Health</h3>
          </div>
          <span className="text-xs text-ink-soft">{total} SKUs Tracked</span>
        </div>

        {/* Visual Stacked Bar */}
        <div className="mt-4 space-y-2">
          <div className="flex h-3 w-full overflow-hidden rounded-full bg-surface-sunken border border-line">
            <div style={{ width: `${healthyPct}%` }} className="bg-success" title="Healthy Stock" />
            <div style={{ width: `${lowPct}%` }} className="bg-warning" title="Low Stock Alert" />
            <div style={{ width: `${outPct}%` }} className="bg-danger" title="Out of Stock" />
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between rounded-xl border border-line bg-surface-sunken p-2.5">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-success" />
              <span className="text-xs text-ink-soft">Healthy Stock Level</span>
            </div>
            <span className="text-xs font-bold text-success">{healthyCount} items ({healthyPct}%)</span>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-line bg-surface-sunken p-2.5">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-warning" />
              <span className="text-xs text-ink-soft">Low Stock Alert</span>
            </div>
            <span className="text-xs font-bold text-warning">{lowStockCount} items ({lowPct}%)</span>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-line bg-surface-sunken p-2.5">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-danger" />
              <span className="text-xs text-ink-soft">Out of Stock</span>
            </div>
            <span className="text-xs font-bold text-danger">{outOfStockCount} items ({outPct}%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
