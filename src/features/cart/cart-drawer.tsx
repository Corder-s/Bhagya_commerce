"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import { CartItemRow } from "@/features/cart/cart-item-row";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export function CartDrawer() {
  const { isDrawerOpen, closeCartDrawer, items, itemCount, subtotal } = useCart();

  // Close on Escape key
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isDrawerOpen) {
        closeCartDrawer();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDrawerOpen, closeCartDrawer]);

  // Lock body scroll when drawer is open
  React.useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeCartDrawer}
            aria-hidden="true"
            className="fixed inset-0 z-modal bg-ink/40 backdrop-blur-xs"
          />

          {/* Drawer Panel */}
          <motion.div
            key="cart-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-drawer-title"
            className={cn(
              "fixed inset-y-0 right-0 z-modal flex w-full max-w-md flex-col bg-surface shadow-2xl",
              "border-l border-line",
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-6">
              <div className="flex items-center gap-2">
                <ShoppingBag className="size-5 text-primary" aria-hidden="true" />
                <h2 id="cart-drawer-title" className="text-heading-md font-semibold text-ink">
                  Shopping Bag
                </h2>
                <span className="rounded-pill bg-soft-green px-2 py-0.5 text-caption font-bold text-primary">
                  {itemCount}
                </span>
              </div>

              <button
                type="button"
                onClick={closeCartDrawer}
                aria-label="Close shopping bag"
                className="grid size-9 place-items-center rounded-lg text-ink-soft hover:bg-canvas-deep hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>

            {/* Content / Items List */}
            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
                <div className="grid size-16 place-items-center rounded-2xl bg-soft-green text-primary">
                  <ShoppingBag className="size-8" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-heading-md font-semibold text-ink">
                  Your bag is empty
                </h3>
                <p className="mt-2 max-w-xs text-body-sm text-ink-soft">
                  Discover thoughtful handcrafted goods from India&apos;s finest master artisans.
                </p>
                <Button
                  asChild
                  size="md"
                  variant="primary"
                  className="mt-6"
                  onClick={closeCartDrawer}
                >
                  <Link href="/shop">Explore Products</Link>
                </Button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-5 py-3 sm:px-6 divide-y divide-line">
                  {items.map((item) => (
                    <CartItemRow key={item.id} item={item} compact />
                  ))}
                </div>

                {/* Drawer Footer */}
                <div className="border-t border-line bg-canvas/60 p-5 sm:p-6">
                  <div className="mb-4 flex items-baseline justify-between">
                    <span className="text-body-md font-medium text-ink-soft">
                      Subtotal
                    </span>
                    <span className="text-heading-md font-bold text-ink tabular-nums">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    <Button
                      asChild
                      size="lg"
                      variant="primary"
                      fullWidth
                      onClick={closeCartDrawer}
                    >
                      <Link href="/checkout">
                        Proceed to Checkout
                        <ArrowRight className="size-4" aria-hidden="true" />
                      </Link>
                    </Button>

                    <Button
                      asChild
                      size="md"
                      variant="outline"
                      fullWidth
                      onClick={closeCartDrawer}
                    >
                      <Link href="/cart">View Full Bag</Link>
                    </Button>
                  </div>

                  <p className="mt-3 text-center text-caption text-ink-faint">
                    Shipping & taxes calculated during checkout
                  </p>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
