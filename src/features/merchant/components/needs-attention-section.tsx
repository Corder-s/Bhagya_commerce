"use client";

import { AlertCircle, ArrowRight, Boxes, CheckCircle2, Clock, PackageCheck } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { AttentionItem } from "@/features/merchant/dashboard-types";

export function NeedsAttentionSection({ items }: { items: AttentionItem[] }) {
  if (!items || items.length === 0) {
    return (
      <Card variant="surface" padding="md" radius="xl" className="border-line shadow-card">
        <CardContent className="flex items-center gap-3 py-2 text-ink-soft text-body-sm">
          <CheckCircle2 className="size-5 text-[#2F5E3D] shrink-0" />
          <span>
            <strong>All caught up!</strong> No orders or inventory require immediate action right now.
          </span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="size-4 text-[#9A6A20] dark:text-[#C49A45]" />
          <h3 className="text-body-sm font-bold uppercase tracking-wider text-ink">
            Needs Your Attention
          </h3>
        </div>
        <span className="text-caption text-ink-soft">
          {items.length} actionable {items.length === 1 ? "task" : "tasks"}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {items.map((item) => {
          const isUrgent = item.severity === "urgent";
          const Icon = item.type === "pending_orders" ? Clock : Boxes;

          return (
            <Card
              key={item.id}
              variant="surface"
              padding="md"
              radius="xl"
              className={`border transition-all shadow-card ${
                isUrgent
                  ? "border-[#C49A45]/50 bg-[#C49A45]/5 ring-1 ring-[#C49A45]/20"
                  : "border-line bg-surface"
              }`}
            >
              <CardContent className="flex items-start justify-between gap-3 p-1">
                <div className="flex items-start gap-3">
                  <div
                    className={`size-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      isUrgent
                        ? "bg-[#C49A45] text-[#151515]"
                        : "bg-surface-subtle border border-line text-[#9A6A20] dark:text-[#C49A45]"
                    }`}
                  >
                    <Icon className="size-4.5" />
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-body-sm font-bold text-ink leading-tight">
                      {item.title}
                    </h4>
                    <p className="text-caption text-ink-soft leading-snug">
                      {item.description}
                    </p>
                  </div>
                </div>

                <Button asChild variant="outline" size="sm" className="shrink-0 text-xs">
                  <Link href={item.actionHref as any}>
                    {item.actionLabel}
                    <ArrowRight className="size-3" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
