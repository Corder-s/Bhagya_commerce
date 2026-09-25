"use client";

import {
  AlertTriangle,
  ArrowRight,
  Boxes,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Package,
  ReceiptIndianRupee,
  Sparkles,
  TrendingUp,
  Truck,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AIActionConfirmation } from "@/features/ai/components/ai-action-confirmation";
import { AIProductCard } from "@/features/ai/components/ai-product-card";
import type { AIMessage } from "@/features/ai/types/ai.types";
import { formatPrice } from "@/lib/format";

export function AIMessageBubble({
  message,
  onConfirmAction,
}: {
  message: AIMessage;
  onConfirmAction?: (messageId: string, confirmed: boolean) => Promise<void>;
}) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-tr-xs bg-primary px-4 py-2.5 text-body-sm font-medium text-[#151515] shadow-xs">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 max-w-[92%] sm:max-w-[85%]">
      {/* Tool Calling Status Indicator */}
      {message.toolCall && (
        <div className="inline-flex items-center gap-1.5 self-start px-2.5 py-1 rounded-pill bg-surface border border-line text-caption text-ink-soft shadow-xs">
          {message.toolCall.status === "running" ? (
            <Loader2 className="size-3 animate-spin text-[#C49A45]" />
          ) : (
            <CheckCircle2 className="size-3 text-success" />
          )}
          <span className="font-mono text-xs">
            tool: {message.toolCall.name}
          </span>
        </div>
      )}

      {/* Main Assistant Bubble */}
      <div className="rounded-2xl rounded-tl-xs border border-line bg-surface p-4 text-body-sm text-ink shadow-xs space-y-3">
        {/* Render markdown-like paragraphs */}
        <div className="prose prose-sm dark:prose-invert max-w-none text-ink leading-relaxed space-y-2 whitespace-pre-line">
          {message.content}
        </div>

        {/* Structured Data: Product Recommendations */}
        {message.structuredData?.type === "product_recommendations" && (
          <div className="space-y-2 pt-2 border-t border-line">
            <span className="text-caption font-semibold uppercase tracking-wider text-[#9A6A20] dark:text-[#C49A45] block">
              Curated Artisan Products ({message.structuredData.data.length})
            </span>
            <div className="grid grid-cols-1 gap-2.5">
              {message.structuredData.data.map((product) => (
                <AIProductCard key={product.productId} product={product} />
              ))}
            </div>
          </div>
        )}

        {/* Structured Data: Order Lookup */}
        {message.structuredData?.type === "order_lookup" && (
          <div className="p-3.5 rounded-xl border border-line bg-surface-subtle space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="size-4 text-[#C49A45]" />
                <span className="font-mono font-bold text-body-sm text-ink">
                  {message.structuredData.data.orderNumber}
                </span>
              </div>
              <Badge tone="success" size="sm">
                {message.structuredData.data.status.replace(/_/g, " ")}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-caption pt-1 border-t border-line/60">
              <div>
                <span className="text-ink-soft block">Courier:</span>
                <span className="font-medium text-ink">{message.structuredData.data.carrier}</span>
              </div>
              <div>
                <span className="text-ink-soft block">ETA:</span>
                <span className="font-semibold text-ink">{message.structuredData.data.eta}</span>
              </div>
              <div>
                <span className="text-ink-soft block">Destination:</span>
                <span className="text-ink">{message.structuredData.data.shippingCity}</span>
              </div>
              <div>
                <span className="text-ink-soft block">Total Value:</span>
                <span className="font-bold text-ink">{formatPrice(message.structuredData.data.total)}</span>
              </div>
            </div>

            <Button asChild variant="outline" size="sm" className="w-full h-8 text-xs">
              <Link href={`/orders/${message.structuredData.data.orderNumber}/tracking`}>
                <span>Open Live Tracking Map</span>
                <ArrowRight className="size-3" />
              </Link>
            </Button>
          </div>
        )}

        {/* Structured Data: Merchant Sales Summary */}
        {message.structuredData?.type === "merchant_sales_summary" && (
          <div className="p-3.5 rounded-xl border border-line bg-surface-subtle space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-caption font-bold uppercase tracking-wider text-[#9A6A20] dark:text-[#C49A45]">
                Today's Store Performance
              </span>
              <span className="inline-flex items-center gap-1 text-caption font-semibold text-success">
                <TrendingUp className="size-3" />
                +{message.structuredData.data.salesChangePercent}% vs yesterday
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-line/60 text-center">
              <div className="p-2 rounded-lg bg-surface border border-line">
                <span className="text-[11px] text-ink-soft block">Sales</span>
                <span className="font-display text-body-md font-bold text-ink">
                  {formatPrice(message.structuredData.data.todaySales)}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-surface border border-line">
                <span className="text-[11px] text-ink-soft block">Orders</span>
                <span className="font-display text-body-md font-bold text-ink">
                  {message.structuredData.data.todayOrders}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-surface border border-line">
                <span className="text-[11px] text-ink-soft block">Pending</span>
                <span className="font-display text-body-md font-bold text-[#9A6A20]">
                  {message.structuredData.data.pendingOrdersCount}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-surface border border-line">
                <span className="text-[11px] text-ink-soft block">Low Stock</span>
                <span className="font-display text-body-md font-bold text-danger">
                  {message.structuredData.data.lowStockCount}
                </span>
              </div>
            </div>

            <Button asChild variant="outline" size="sm" className="w-full h-8 text-xs">
              <Link href={"/merchant/dashboard" as any}>
                <span>View Full Merchant Dashboard</span>
                <ExternalLink className="size-3" />
              </Link>
            </Button>
          </div>
        )}

        {/* Structured Data: Inventory Warning */}
        {message.structuredData?.type === "inventory_warning" && (
          <div className="p-3.5 rounded-xl border border-line bg-surface-subtle space-y-2.5">
            <div className="flex items-center gap-1.5 text-danger font-semibold text-caption">
              <AlertTriangle className="size-4" />
              <span>Stock Threshold Warnings</span>
            </div>

            <ul className="divide-y divide-line border border-line rounded-lg overflow-hidden bg-surface">
              {message.structuredData.data.items.map((item) => (
                <li key={item.productId} className="p-2.5 flex items-center justify-between text-body-sm">
                  <div>
                    <span className="font-medium text-ink block line-clamp-1">{item.productName}</span>
                    <span className="text-[11px] text-ink-soft font-mono">{item.sku}</span>
                  </div>
                  <Badge tone={item.status === "out_of_stock" ? "danger" : "warning"} size="sm">
                    {item.currentStock} left
                  </Badge>
                </li>
              ))}
            </ul>

            <Button asChild variant="outline" size="sm" className="w-full h-8 text-xs">
              <Link href={"/merchant/inventory" as any}>
                <span>Manage Inventory Ledger</span>
                <ArrowRight className="size-3" />
              </Link>
            </Button>
          </div>
        )}

        {/* Structured Data: Write Action Confirmation */}
        {message.structuredData?.type === "write_action_confirmation" && onConfirmAction && (
          <AIActionConfirmation
            action={message.structuredData.data}
            messageId={message.id}
            onConfirm={onConfirmAction}
          />
        )}
      </div>
    </div>
  );
}
