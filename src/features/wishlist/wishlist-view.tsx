"use client";

import { Heart, ShoppingBag, Sparkles, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { calculateDiscountPercentage, formatPrice } from "@/lib/format";

export function WishlistView() {
  const { wishlistProducts, wishlistCount, removeFromWishlist, clearWishlist } = useWishlist();
  const { addItem } = useCart();

  if (wishlistCount === 0 || wishlistProducts.length === 0) {
    return (
      <div className="mx-auto max-w-2xl py-16 text-center sm:py-24">
        <div className="mx-auto grid size-20 place-items-center rounded-3xl bg-soft-green text-primary shadow-inner">
          <Heart className="size-10" aria-hidden="true" />
        </div>

        <h1 className="mt-6 font-display text-display-md sm:text-display-lg font-medium text-ink">
          Your wishlist is empty.
        </h1>

        <p className="mt-3 max-w-md mx-auto text-body-lg text-ink-soft">
          Save handcrafted products you love so you can easily find them later.
        </p>

        <div className="mt-8 flex justify-center">
          <Button asChild size="lg" variant="primary">
            <Link href="/shop">
              <Sparkles className="size-4" aria-hidden="true" />
              Explore Products
            </Link>
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
          <nav aria-label="Breadcrumb" className="mb-2 flex items-center gap-2 text-body-sm text-ink-faint">
            <Link href="/" className="hover:text-ink">Home</Link>
            <span>/</span>
            <span className="text-ink">Wishlist</span>
          </nav>
          <h1 className="font-display text-display-md sm:text-display-lg font-medium text-ink">
            Things worth keeping.
          </h1>
          <p className="mt-1 text-body-md text-ink-soft">
            Save products you want to come back to. ({wishlistCount} {wishlistCount === 1 ? "item" : "items"})
          </p>
        </div>

        <button
          type="button"
          onClick={clearWishlist}
          className="inline-flex items-center gap-1.5 text-body-sm font-medium text-ink-faint hover:text-danger transition-colors"
        >
          <Trash2 className="size-4" aria-hidden="true" />
          Clear wishlist
        </button>
      </div>

      {/* Wishlist Product Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {wishlistProducts.map((product) => {
          const discount = calculateDiscountPercentage(product.priceInr, product.mrpInr);

          return (
            <div
              key={product.id}
              className="group relative flex flex-col rounded-2xl border border-line bg-surface p-4 transition-all duration-base hover:shadow-md hover:border-primary/30"
            >
              {/* Product Thumbnail & Wishlist Remove Heart */}
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-canvas-deep">
                {product.image ? (
                  <Image
                    src={product.image.src}
                    alt={product.image.alt}
                    fill
                    sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-base group-hover:scale-105"
                  />
                ) : null}

                {product.badge && (
                  <span className="absolute left-3 top-3 z-10">
                    <Badge tone="botanical" size="sm">{product.badge}</Badge>
                  </span>
                )}

                {/* Remove from Wishlist button */}
                <button
                  type="button"
                  onClick={() => removeFromWishlist(product.id)}
                  aria-label={`Remove ${product.name} from wishlist`}
                  className="absolute right-3 top-3 z-10 grid size-10 place-items-center rounded-pill border-2 border-danger/40 bg-danger-surface text-danger shadow-xs transition-transform active:scale-90 hover:bg-danger-surface/80 focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  <Heart className="size-4.5 fill-current" aria-hidden="true" />
                </button>
              </div>

              {/* Product Info */}
              <div className="flex flex-1 flex-col pt-3.5">
                <p className="text-caption font-medium uppercase tracking-[0.08em] text-ink-faint">
                  {product.brand.name}
                </p>

                <h3 className="mt-1 line-clamp-2 text-body-md font-semibold text-ink hover:text-primary">
                  <Link href={`/products/${product.slug}`}>{product.name}</Link>
                </h3>

                {/* Price & MRP */}
                <div className="mt-auto pt-3 flex items-baseline gap-2">
                  <span className="text-body-md font-bold text-ink tabular-nums">
                    {formatPrice(product.priceInr)}
                  </span>
                  {product.mrpInr && (
                    <span className="text-caption text-ink-faint line-through tabular-nums">
                      {formatPrice(product.mrpInr)}
                    </span>
                  )}
                  {discount && (
                    <span className="text-caption font-semibold text-success">
                      {discount}% off
                    </span>
                  )}
                </div>

                {/* Add to Cart CTA */}
                <div className="mt-4 pt-3 border-t border-line">
                  <Button
                    size="md"
                    variant="primary"
                    fullWidth
                    onClick={() => addItem(product, undefined, 1)}
                  >
                    <ShoppingBag className="size-4" aria-hidden="true" />
                    Add to Bag
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
