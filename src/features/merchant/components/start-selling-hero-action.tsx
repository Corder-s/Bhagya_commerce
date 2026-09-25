"use client";

import { ArrowRight, CheckCircle2, LayoutDashboard, ShoppingBag, Sparkles, Store } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import type { Store as StoreType } from "@/features/merchant/merchant-types";
import { merchantService } from "@/services/merchant.service";

export function StartSellingHeroAction() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [existingStore, setExistingStore] = React.useState<StoreType | null>(null);
  const [isCheckingStore, setIsCheckingStore] = React.useState(true);

  React.useEffect(() => {
    async function checkStore() {
      if (user?.id) {
        try {
          const store = await merchantService.getUserStore(user.id);
          setExistingStore(store);
        } catch {
          // Fallback
        }
      }
      setIsCheckingStore(false);
    }

    if (!isLoading) {
      checkStore();
    }
  }, [user, isLoading]);

  if (isLoading || isCheckingStore) {
    return (
      <div className="flex items-center gap-3 py-2">
        <div className="h-11 w-40 rounded-xl bg-surface-subtle animate-pulse" />
        <div className="h-11 w-32 rounded-xl bg-surface-subtle animate-pulse" />
      </div>
    );
  }

  // If user already has an active store
  if (isAuthenticated && existingStore) {
    return (
      <div className="space-y-4 w-full max-w-lg animate-in fade-in duration-300">
        <Card variant="surface" padding="md" radius="xl" className="border-line shadow-card bg-surface">
          <CardContent className="space-y-3 p-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="size-8 rounded-lg bg-[#C49A45]/20 text-[#9A6A20] dark:text-[#C49A45] flex items-center justify-center">
                  <Store className="size-4" />
                </span>
                <span className="text-caption font-semibold text-ink-soft uppercase tracking-wider">
                  Your Active Store
                </span>
              </div>
              <Badge tone="success" size="sm">
                Live on Bhagya
              </Badge>
            </div>

            <div>
              <h3 className="font-display text-heading-lg font-bold text-ink">
                {existingStore.name}
              </h3>
              <p className="font-mono text-caption text-ink-soft mt-0.5">
                bhagya.in/store/{existingStore.slug}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-line">
              <Button asChild size="md" variant="primary">
                <Link href={"/merchant/dashboard" as any}>
                  <LayoutDashboard className="size-4" />
                  Open Merchant Dashboard
                  <ArrowRight className="size-4" />
                </Link>
              </Button>

              <Button asChild size="md" variant="outline">
                <Link href={"/shop" as any}>
                  <ShoppingBag className="size-4" />
                  Continue Shopping
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If visitor is logged out or logged in without a store
  const startSellingHref = isAuthenticated
    ? "/merchant/onboarding"
    : "/login?redirect=/merchant/onboarding";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button asChild size="lg" variant="primary">
          <Link href={startSellingHref as any}>
            <Sparkles className="size-4" />
            Start Selling
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </Button>

        <Button asChild size="lg" variant="outline">
          <Link href={"/shop" as any}>
            <ShoppingBag className="size-4" />
            Continue Shopping
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-2 text-caption text-ink-soft">
        <CheckCircle2 className="size-3.5 text-[#2F5E3D]" />
        <span>One unified account — shop and sell with the same login.</span>
      </div>
    </div>
  );
}
