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
      color: 'bg-[#43A66A]',
      textColor: 'text-[#73D393]',
      icon: <CheckCircle2 className="size-3.5 text-[#43A66A]" />,
    },
    {
      label: 'Shipped',
      count: orders.shippedOrders || 0,
      color: 'bg-[#C49A45]',
      textColor: 'text-[#DDBB72]',
      icon: <Truck className="size-3.5 text-[#C49A45]" />,
    },
    {
      label: 'Processing',
      count: orders.processingOrders || 0,
      color: 'bg-[#4A96D8]',
      textColor: 'text-[#4A96D8]',
      icon: <Clock className="size-3.5 text-[#4A96D8]" />,
    },
    {
      label: 'Confirmed',
      count: orders.confirmedOrders || 0,
      color: 'bg-[#C8C1B4]',
      textColor: 'text-[#C8C1B4]',
      icon: <Package className="size-3.5 text-[#C8C1B4]" />,
    },
  ];

  const validTotal = Math.max(totalOrders, 1);

  return (
    <div className="rounded-2xl border border-[#444139] bg-[#2B2A25] p-5 shadow-md flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-[#3A3831] pb-3">
          <div>
            <h3 className="font-serif text-base font-semibold text-[#F5F1E8]">Order Status Breakdown</h3>
            <p className="text-xs text-[#9E988C] mt-0.5">Live fulfillment pipeline</p>
          </div>
          <span className="rounded-full bg-[#35332C] px-2.5 py-0.5 text-xs font-semibold text-[#C49A45] border border-[#444139]">
            {totalOrders} Total
          </span>
        </div>

        {/* Multi-segment stacked progress bar */}
        <div className="mt-4 space-y-2">
          <div className="flex h-3 w-full overflow-hidden rounded-full bg-[#24231F] border border-[#3A3831]">
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
                className="flex items-center justify-between rounded-xl border border-[#3A3831] bg-[#302F29] p-2.5"
              >
                <div className="flex items-center gap-2">
                  {st.icon}
                  <span className="text-xs font-medium text-[#C8C1B4]">{st.label}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-[#F5F1E8]">{st.count}</span>
                  <span className="text-[10px] text-[#9E988C] block">{pct}%</span>
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
    <div className="rounded-2xl border border-[#444139] bg-[#2B2A25] p-5 shadow-md flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-[#3A3831] pb-3">
          <div className="flex items-center gap-2">
            <Boxes className="size-4 text-[#C49A45]" />
            <h3 className="font-serif text-base font-semibold text-[#F5F1E8]">Stock & Inventory Health</h3>
          </div>
          <span className="text-xs text-[#9E988C]">{total} SKUs Tracked</span>
        </div>

        {/* Visual Stacked Bar */}
        <div className="mt-4 space-y-2">
          <div className="flex h-3 w-full overflow-hidden rounded-full bg-[#24231F] border border-[#3A3831]">
            <div style={{ width: `${healthyPct}%` }} className="bg-[#43A66A]" title="Healthy Stock" />
            <div style={{ width: `${lowPct}%` }} className="bg-[#C79338]" title="Low Stock Alert" />
            <div style={{ width: `${outPct}%` }} className="bg-[#D05A4A]" title="Out of Stock" />
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between rounded-xl border border-[#3A3831] bg-[#302F29] p-2.5">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#43A66A]" />
              <span className="text-xs text-[#C8C1B4]">Healthy Stock Level</span>
            </div>
            <span className="text-xs font-bold text-[#73D393]">{healthyCount} items ({healthyPct}%)</span>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-[#3A3831] bg-[#302F29] p-2.5">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#C79338]" />
              <span className="text-xs text-[#C8C1B4]">Low Stock Alert</span>
            </div>
            <span className="text-xs font-bold text-[#DDBB72]">{lowStockCount} items ({lowPct}%)</span>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-[#3A3831] bg-[#302F29] p-2.5">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#D05A4A]" />
              <span className="text-xs text-[#C8C1B4]">Out of Stock</span>
            </div>
            <span className="text-xs font-bold text-[#F09284]">{outOfStockCount} items ({outPct}%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
