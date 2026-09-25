"use client";

import { ArrowLeft, ShoppingBag, Sparkles, Trash2 } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import { CartItemRow } from "@/features/cart/cart-item-row";
import { CartOrderSummary } from "@/features/cart/cart-order-summary";

export function CartView() {
  const { items, itemCount, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl py-16 text-center sm:py-24">
        <div className="mx-auto grid size-20 place-items-center rounded-3xl bg-gold-soft/30 dark:bg-gold/15 text-gold-dark dark:text-gold shadow-inner border border-line">
          <ShoppingBag className="size-10" aria-hidden="true" />
        </div>

        <h1 className="mt-6 font-display text-display-md sm:text-display-lg font-medium text-ink">
          Your cart is waiting for something good.
        </h1>

        <p className="mt-3 max-w-md mx-auto text-body-lg text-ink-soft">
          Discover thoughtful products from brands creating a better tomorrow.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button asChild size="lg" variant="primary">
            <Link href="/shop">
              <Sparkles className="size-4" aria-hidden="true" />
              Explore Products
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/wishlist">View Saved Items</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-10 lg:py-12">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
        <div>
          <nav aria-label="Breadcrumb" className="mb-2 flex items-center gap-2 text-body-sm text-ink-subtle">
            <Link href="/" className="hover:text-ink transition-colors">Home</Link>
            <span>/</span>
            <span className="text-ink">Shopping Bag</span>
          </nav>
          <h1 className="font-display text-display-md sm:text-display-lg font-medium text-ink">
            Shopping Bag
          </h1>
          <p className="mt-1 text-body-md text-ink-soft">
            {itemCount} {itemCount === 1 ? "item" : "items"} selected from verified Indian artisan houses.
          </p>
        </div>

        <button
          type="button"
          onClick={clearCart}
          className="inline-flex items-center gap-1.5 text-body-sm font-medium text-ink-subtle hover:text-danger transition-colors cursor-pointer"
        >
          <Trash2 className="size-4" aria-hidden="true" />
          Clear all items
        </button>
      </div>

      {/* Main 2-column layout */}
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.9fr)] lg:gap-14 lg:items-start">
        {/* Left Column: Cart Items */}
        <div className="rounded-2xl border border-line bg-surface p-5 sm:p-7 shadow-xs">
          <div className="divide-y divide-line">
            {items.map((item) => (
              <CartItemRow key={item.id} item={item} />
            ))}
          </div>

          <div className="mt-6 border-t border-line pt-6">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-body-sm font-semibold text-gold-dark dark:text-gold hover:underline transition-colors"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Continue shopping for handcrafted items
            </Link>
          </div>
        </div>

        {/* Right Column: Sticky Order Summary */}
        <div className="lg:sticky lg:top-24">
          <CartOrderSummary />
        </div>
      </div>
    </div>
  );
}
