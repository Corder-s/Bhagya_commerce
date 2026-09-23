"use client";

import { m } from "framer-motion";
import {
  ChevronLeft,
  Heart,
  Minus,
  Package,
  Plus,
  RotateCcw,
  ShoppingBag,
  Star,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { marketingRoutes } from "@/config/routes";
import { discountPercent, formatRating } from "@/lib/catalogue";
import { formatPrice } from "@/lib/format";
import { pop } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { ProductDetail } from "@/types/catalogue";

/* ─────────────────────────────────────────────────────────────────────────── */

function StarRow({ value, count }: { value: number; count: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={cn(
              "size-4",
              i <= Math.round(value) ? "fill-gold text-gold" : "fill-canvas-deep text-line",
            )}
          />
        ))}
      </div>
      <span className="text-body-sm font-semibold text-ink">{value.toFixed(1)}</span>
      <span className="text-body-sm text-ink-faint">({count} reviews)</span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */

export function ProductDetailClient({ product }: { product: ProductDetail }) {
  const [activeImage, setActiveImage] = React.useState(0);
  const [qty, setQty] = React.useState(1);
  const [activeTab, setActiveTab] = React.useState<"details" | "specs" | "reviews">("details");

  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const saved = isWishlisted(product.id);
  const discount = discountPercent(product);

  function handleAddToCart() {
    addToCart(product, qty);
  }

  const tabs = [
    { value: "details", label: "Description" },
    { value: "specs", label: "Specifications" },
    { value: "reviews", label: `Reviews (${product.reviewsList.length})` },
  ] as const;

  return (
    <div>
      {/* ── Breadcrumb ─────────────────────────────────────────────────── */}
      <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-1.5 text-body-sm text-ink-faint">
        <Link href={marketingRoutes.shop} className="flex items-center gap-1 hover:text-ink">
          <ChevronLeft className="size-3.5" aria-hidden="true" />
          Back to shop
        </Link>
      </nav>

      {/* ── Main layout ────────────────────────────────────────────────── */}
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Left — Gallery */}
        <div className="flex flex-col gap-4">
          {/* Main image */}
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-canvas-deep">
            {product.gallery[activeImage] ? (
              <Image
                src={product.gallery[activeImage].src}
                alt={product.gallery[activeImage].alt}
                width={product.gallery[activeImage].width}
                height={product.gallery[activeImage].height}
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority
                className="size-full object-cover"
              />
            ) : product.image ? (
              <Image
                src={product.image.src}
                alt={product.image.alt}
                width={product.image.width}
                height={product.image.height}
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority
                className="size-full object-cover"
              />
            ) : null}

            {product.badge && (
              <span className="absolute left-4 top-4">
                <Badge tone="botanical" size="sm">{product.badge}</Badge>
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.gallery.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
              {product.gallery.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  aria-label={`View image ${i + 1}`}
                  className={cn(
                    "relative size-20 shrink-0 overflow-hidden rounded-lg border-2 transition-colors",
                    activeImage === i ? "border-primary" : "border-transparent",
                  )}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={160}
                    height={160}
                    className="size-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right — Info */}
        <div className="flex flex-col">
          {/* Brand */}
          <Link
            href={`/brands/${product.brand.slug}` as import("next").Route}
            className="text-caption font-medium uppercase tracking-widest text-primary hover:underline"
          >
            {product.brand.name}
          </Link>

          <h1 className="mt-2 text-display-xs font-bold text-ink sm:text-display-sm">
            {product.name}
          </h1>

          {/* Rating */}
          {product.rating && (
            <div className="mt-3">
              <StarRow value={product.rating.value} count={product.rating.count} />
            </div>
          )}

          {/* Price */}
          <div className="mt-5 flex flex-wrap items-baseline gap-3">
            <span className="text-display-xs font-bold text-ink">
              {formatPrice(product.priceInr)}
            </span>
            {product.mrpInr && (
              <span className="text-body-lg text-ink-faint line-through">
                {formatPrice(product.mrpInr)}
              </span>
            )}
            {discount != null && (
              <Badge tone="botanical" size="sm">{discount}% off</Badge>
            )}
          </div>

          {/* Availability */}
          <div className="mt-3">
            {product.availability === "in-stock" && (
              <p className="text-body-sm font-medium text-success">In stock — ships in 48h</p>
            )}
            {product.availability === "low-stock" && (
              <p className="text-body-sm font-medium text-warning">Low stock — order soon</p>
            )}
            {product.availability === "made-to-order" && (
              <p className="text-body-sm font-medium text-ink-soft">Made to order — allow 5–7 days</p>
            )}
          </div>

          {/* Blurb */}
          <p className="mt-5 text-body-md leading-relaxed text-ink-soft">
            {product.blurb}
          </p>

          <hr className="my-6 border-line" />

          {/* Qty + Add to cart */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* Quantity selector */}
            <div className="flex items-center gap-1 rounded-xl border border-line bg-surface p-1">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty <= 1}
                aria-label="Decrease quantity"
                className="grid size-10 place-items-center rounded-lg text-ink-soft transition-colors hover:bg-canvas-deep hover:text-ink disabled:opacity-40"
              >
                <Minus className="size-4" />
              </button>
              <span className="w-10 text-center text-body-md font-semibold tabular-nums text-ink">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                aria-label="Increase quantity"
                className="grid size-10 place-items-center rounded-lg text-ink-soft transition-colors hover:bg-canvas-deep hover:text-ink"
              >
                <Plus className="size-4" />
              </button>
            </div>

            {/* Add to cart */}
            <button
              type="button"
              onClick={handleAddToCart}
              className={cn(
                "flex-1 inline-flex min-h-12 items-center justify-center gap-2.5 rounded-xl",
                "bg-gradient-to-r from-[#0b4d36] via-[#167a50] to-[#0b4d36] px-6 text-body-md font-semibold text-white",
                "border border-emerald-400/25 shadow-md shadow-[#0b4d36]/25",
                "transition-all duration-base hover:from-[#0d5c41] hover:via-[#1e8f5e] hover:to-[#0d5c41] hover:shadow-lg hover:shadow-[#0b4d36]/35 hover:brightness-105 active:scale-[0.98]",
                "focus-visible:outline-2 focus-visible:outline-offset-2",
              )}
            >
              <ShoppingBag className="size-5" aria-hidden="true" />
              Add to bag
            </button>

            {/* Wishlist */}
            <m.button
              type="button"
              onClick={() => toggleWishlist(product)}
              aria-pressed={saved}
              aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
              variants={pop}
              initial="rest"
              animate={saved ? "popped" : "rest"}
              className={cn(
                "grid size-12 shrink-0 place-items-center rounded-xl border-2 transition-all shadow-xs active:scale-95",
                saved
                  ? "border-danger/40 bg-danger-surface text-danger shadow-danger/10"
                  : "border-line-strong bg-surface text-ink-soft hover:border-danger hover:text-danger hover:bg-danger-surface/40",
              )}
            >
              <Heart className={cn("size-5", saved && "fill-current")} aria-hidden="true" />
            </m.button>
          </div>

          {/* Shipping info */}
          <div className="mt-6 space-y-2.5 rounded-xl border border-line bg-surface p-4">
            <div className="flex items-start gap-3">
              <Truck className="mt-0.5 size-4 shrink-0 text-ink-faint" aria-hidden="true" />
              <p className="text-body-sm text-ink-soft">{product.shippingInfo}</p>
            </div>
            {product.careInstructions && (
              <div className="flex items-start gap-3">
                <RotateCcw className="mt-0.5 size-4 shrink-0 text-ink-faint" aria-hidden="true" />
                <p className="text-body-sm text-ink-soft">{product.careInstructions}</p>
              </div>
            )}
            <div className="flex items-start gap-3">
              <Package className="mt-0.5 size-4 shrink-0 text-ink-faint" aria-hidden="true" />
              <p className="text-body-sm text-ink-soft">Ships in plastic-free, recycled packaging.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Detail tabs ─────────────────────────────────────────────────── */}
      <div className="mt-16">
        {/* Tab bar */}
        <div className="flex border-b border-line">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                "px-5 pb-3.5 pt-2 text-body-sm font-medium transition-colors",
                activeTab === tab.value
                  ? "border-b-2 border-primary text-primary"
                  : "text-ink-faint hover:text-ink",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="py-8">
          {activeTab === "details" && (
            <div className="max-w-2xl">
              <p className="text-body-md leading-relaxed text-ink-soft">
                {product.description}
              </p>
            </div>
          )}

          {activeTab === "specs" && (
            <div className="max-w-lg">
              <dl className="divide-y divide-line">
                {product.specifications.map((spec) => (
                  <div key={spec.label} className="flex gap-4 py-3.5">
                    <dt className="w-36 shrink-0 text-body-sm font-medium text-ink">
                      {spec.label}
                    </dt>
                    <dd className="text-body-sm text-ink-soft">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="max-w-2xl space-y-6">
              {product.reviewsList.length === 0 ? (
                <p className="text-body-sm text-ink-faint">No reviews yet.</p>
              ) : (
                product.reviewsList.map((review) => (
                  <div key={review.id} className="rounded-xl border border-line bg-surface p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-body-sm font-semibold text-ink">{review.author}</p>
                        <div className="mt-1 flex items-center gap-1.5">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star
                              key={i}
                              className={cn(
                                "size-3",
                                i <= review.rating
                                  ? "fill-gold text-gold"
                                  : "fill-canvas-deep text-line",
                              )}
                              aria-hidden="true"
                            />
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-caption text-ink-faint">{review.date}</p>
                        {review.verified && (
                          <Badge tone="outline" size="sm" className="mt-1">
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="mt-2 text-body-sm font-medium text-ink">{review.title}</p>
                    <p className="mt-1 text-body-sm leading-relaxed text-ink-soft">
                      {review.comment}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
