"use client";

import { Activity, ArrowRight, Boxes, History, PackageCheck, PackagePlus, Store } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import type { ActivityType, MerchantActivity } from "@/features/merchant/dashboard-types";

const ACTIVITY_ICONS: Record<ActivityType, React.ComponentType<{ className?: string }>> = {
  order_received: PackageCheck,
  order_shipped: PackageCheck,
  stock_updated: Boxes,
  product_added: PackagePlus,
  store_updated: Store,
};

export function RecentActivityFeed({ activities }: { activities: MerchantActivity[] }) {
  if (!activities || activities.length === 0) {
    return null;
  }

  return (
    <Card variant="surface" padding="none" radius="xl" className="border-line shadow-card overflow-hidden">
      <div className="flex items-center justify-between p-4 sm:p-5 border-b border-line bg-surface">
        <div className="flex items-center gap-2">
          <History className="size-4 text-[#C49A45]" />
          <h3 className="text-body-sm font-bold uppercase tracking-wider text-ink">
            Store Activity Log
          </h3>
        </div>
        <span className="text-caption text-ink-soft">Recent Events</span>
      </div>

      <div className="divide-y divide-line bg-surface">
        {activities.map((act) => {
          const IconComponent = ACTIVITY_ICONS[act.type] || Activity;

          return (
            <div key={act.id} className="p-4 flex items-start justify-between gap-3 hover:bg-surface-subtle/40 transition-colors">
              <div className="flex items-start gap-3">
                <span className="size-8 rounded-lg bg-surface-subtle border border-line flex items-center justify-center text-[#9A6A20] dark:text-[#C49A45] shrink-0 mt-0.5">
                  <IconComponent className="size-4" />
                </span>

                <div className="space-y-0.5">
                  <h4 className="text-body-sm font-medium text-ink leading-snug">
                    {act.title}
                  </h4>
                  <p className="text-caption text-ink-soft">
                    {act.description}
                  </p>
                </div>
              </div>

              <span className="text-[11px] text-ink-soft whitespace-nowrap shrink-0">
                {new Date(act.timestamp).toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
