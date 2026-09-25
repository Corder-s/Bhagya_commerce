"use client";

import { Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { QuantitySelector } from "@/components/ui/quantity-selector";
import { useCart } from "@/context/cart-context";
import type { CartItem } from "@/features/cart/cart-types";
import { calculateDiscountPercentage, formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface CartItemRowProps {
  item: CartItem;
  compact?: boolean;
  className?: string;
}

export function CartItemRow({ item, compact = false, className }: CartItemRowProps) {
  const { updateQuantity, removeItem } = useCart();
  const discount = calculateDiscountPercentage(item.unitPrice, item.mrpInr);
  const itemTotal = item.unitPrice * item.quantity;

  return (
    <div
      className={cn(
        "group relative flex gap-3.5 sm:gap-4 transition-all duration-base",
        compact ? "py-3" : "py-4 sm:py-5 border-b border-line last:border-b-0",
        className,
      )}
    >
      {/* Product Image Thumbnail */}
      <Link
        href={`/products/${item.slug}`}
        className={cn(
          "relative shrink-0 overflow-hidden rounded-xl bg-canvas-deep border border-line focus-visible:outline-2 focus-visible:outline-offset-2",
          compact ? "size-16 sm:size-18" : "size-20 sm:size-24",
        )}
      >
        <Image
          src={item.imageSrc}
          alt={item.imageAlt}
          fill
          sizes="(min-width: 640px) 6rem, 5rem"
          className="object-cover transition-transform duration-base group-hover:scale-105"
        />
      </Link>

      {/* Item Details */}
      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-caption font-medium uppercase tracking-[0.08em] text-ink-subtle">
              {item.brandName}
            </p>
            <h4 className="mt-0.5 truncate text-body-sm sm:text-body-md font-semibold text-ink hover:text-primary">
              <Link href={`/products/${item.slug}`}>{item.name}</Link>
            </h4>

            {item.variantName && (
              <span className="mt-1 inline-flex items-center rounded-pill bg-gold-soft/30 dark:bg-gold/15 px-2 py-0.5 text-caption font-medium text-gold-dark dark:text-gold">
                {item.variantName}
              </span>
            )}
          </div>

          {/* Remove Button */}
          <button
            type="button"
            onClick={() => removeItem(item.id)}
            aria-label={`Remove ${item.name} from bag`}
            className="grid size-8 place-items-center rounded-lg text-ink-subtle transition-colors hover:bg-danger-surface hover:text-danger focus-visible:outline-2 focus-visible:outline-offset-2 cursor-pointer"
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </button>
        </div>

        {/* Pricing & Quantity Controls */}
        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
          <QuantitySelector
            size={compact ? "sm" : "sm"}
            value={item.quantity}
            onChange={(qty) => updateQuantity(item.id, qty)}
            label={item.name}
          />

          <div className="text-right">
            <div className="flex items-baseline gap-1.5 justify-end">
              <span className="text-body-sm sm:text-body-md font-bold text-ink tabular-nums">
                {formatPrice(itemTotal)}
              </span>
              {item.quantity > 1 && (
                <span className="text-caption text-ink-subtle tabular-nums hidden sm:inline">
                  ({formatPrice(item.unitPrice)} each)
                </span>
              )}
            </div>

            {item.mrpInr && discount && (
              <p className="text-caption text-emerald-700 dark:text-emerald-400 font-medium">
                Save {discount}%
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
