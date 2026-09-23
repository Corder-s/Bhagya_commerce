"use client";

import { m } from "framer-motion";
import { Heart, ShoppingBag, Star } from "lucide-react";
import Image from "next/image";
import type { Route } from "next";
import Link from "next/link";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { discountPercent, formatRating, formatReviewCount } from "@/lib/catalogue";
import { pop } from "@/lib/motion";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ProductSummary } from "@/types/catalogue";

/**
 * ProductCard — the catalogue unit, used on the home page and in the
 * shop grid.
 *
 * Wishlist and cart are wired to real context providers that persist to
 * localStorage. Quick Add adds immediately; the full PDP handles quantity.
 */
export function ProductCard({
  product,
  href,
  className,
}: {
  product: ProductSummary;
  /** Where the card sends the customer — the PDP slug route. */
  href: Route;
  className?: string;
}) {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const saved = isWishlisted(product.id);
  const discount = discountPercent(product);
  const lowStock = product.availability === "low-stock";

  function onToggleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    toggleWishlist(product);
  }

  function onQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    addToCart(product, 1);
  }

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col",
        className,
      )}
    >
      <div className="relative aspect-4/5 overflow-hidden rounded-lg bg-canvas-deep">
        {product.image ? (
          <Image
            src={product.image.src}
            alt={product.image.alt}
            width={product.image.width}
            height={product.image.height}
            sizes="(min-width: 1024px) 22rem, (min-width: 640px) 45vw, 46vw"
            className="size-full object-cover transition-transform duration-slow ease-brand group-hover:scale-[1.03]"
          />
        ) : (
          <Skeleton variant="block" className="size-full rounded-none" />
        )}

        {product.badge ? (
          <span className="absolute left-3 top-3">
            <Badge tone="botanical" size="sm">
              {product.badge}
            </Badge>
          </span>
        ) : null}

        {/* Wishlist — z-10 keeps it above the card's stretched link. */}
        <button
          type="button"
          onClick={onToggleWishlist}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          className={cn(
            "absolute right-3 top-3 z-10 grid size-10 place-items-center rounded-pill border-2 backdrop-blur-sm shadow-xs",
            "transition-all duration-fast ease-brand focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-95",
            saved
              ? "border-danger/40 bg-danger-surface text-danger shadow-danger/10"
              : "border-line-strong/80 bg-surface/95 text-ink-soft hover:border-danger hover:text-danger hover:bg-danger-surface/40",
          )}
        >
          <m.span
            variants={pop}
            initial="rest"
            animate={saved ? "popped" : "rest"}
            className="grid place-items-center"
          >
            <Heart
              className={cn("size-4", saved && "fill-current")}
              aria-hidden="true"
            />
          </m.span>
        </button>

        {/* Quick Add — always available on touch, revealed on hover for pointer. */}
        <button
          type="button"
          onClick={onQuickAdd}
          className={cn(
            "absolute inset-x-3 bottom-3 z-10 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg",
            "bg-gradient-to-r from-[#0b4d36] via-[#167a50] to-[#0b4d36] px-4 text-body-sm font-semibold text-white",
            "border border-emerald-400/25 shadow-md shadow-[#0b4d36]/30",
            "transition-all duration-base ease-brand hover:brightness-110 hover:shadow-lg active:scale-[0.98]",
            "focus-visible:outline-2 focus-visible:outline-offset-2",
            "pointer-coarse:translate-y-0 pointer-coarse:opacity-100",
            "sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 sm:group-focus-within:translate-y-0 sm:group-focus-within:opacity-100",
          )}
        >
          <ShoppingBag className="size-4" aria-hidden="true" />
          Quick Add
        </button>
      </div>

      <div className="flex flex-1 flex-col pt-3.5">
        <p className="text-caption font-medium uppercase tracking-[0.08em] text-ink-faint">
          {product.brand.name}
        </p>

        <h3 className="mt-1.5 line-clamp-2 text-body-md font-medium text-ink">
          {/* Stretched link: the whole card is the target, the title is the label. */}
          <Link
            href={href}
            className="after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none"
          >
            {product.name}
          </Link>
        </h3>

        <div className="mt-auto pt-3">
        {product.rating ? (
          <p className="flex items-center gap-1.5 text-caption text-ink-soft">
            <Star
              className="size-3.5 fill-gold text-gold"
              aria-hidden="true"
            />
            <span className="tabular-nums font-medium text-ink">
              {formatRating(product.rating.value)}
            </span>
            <span className="tabular-nums">
              ({formatReviewCount(product.rating.count)})
            </span>
            <span className="sr-only">
              out of 5, from {product.rating.count} ratings
            </span>
          </p>
        ) : null}

        <p className="mt-1.5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-body-md font-semibold tabular-nums text-ink">
            {formatPrice(product.priceInr)}
          </span>
          {discount != null && product.mrpInr != null ? (
            <>
              <span className="text-caption tabular-nums text-ink-faint line-through">
                {formatPrice(product.mrpInr)}
              </span>
              <span className="text-caption font-semibold text-success">
                {discount}% off
              </span>
            </>
          ) : null}
        </p>

        {lowStock ? (
          <p className="mt-1.5 text-caption text-warning">Low stock</p>
        ) : null}
        </div>
      </div>
    </article>
  );
}

/** Loading shape for the grid — same proportions, so nothing shifts. */
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton variant="media" className="aspect-4/5" />
      <Skeleton className="h-3 w-1/3" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/4" />
    </div>
  );
}
