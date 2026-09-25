"use client";

import { ExternalLink, Plus, ShoppingBag, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import type { AIProductRecommendation } from "@/features/ai/types/ai.types";
import { formatPrice } from "@/lib/format";
import { toast } from "@/lib/toast";

export function AIProductCard({ product }: { product: AIProductRecommendation }) {
  const { addItem, openCartDrawer } = useCart();
  const [isAdding, setIsAdding] = React.useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);

    addItem({
      id: product.productId,
      slug: product.slug,
      name: product.name,
      blurb: product.reason,
      brand: { slug: "artisan", name: "Artisan Direct" },
      categorySlug: product.category || "handcrafted",
      priceInr: product.price,
      mrpInr: product.mrp || null,
      rating: product.rating ? { value: product.rating, count: 18 } : null,
      image: {
        src: product.imageSrc,
        alt: product.name,
        width: 400,
        height: 500,
      },
      availability: "in-stock",
      buckets: ["trending"],
    });

    toast.success("Added to Cart", `1 × ${product.name} added to your bag.`);
    setIsAdding(false);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 p-3 rounded-2xl border border-line bg-surface shadow-xs transition-colors hover:border-[#C49A45]/40 group">
      {/* Product Image */}
      <div className="relative size-20 sm:size-24 shrink-0 rounded-xl overflow-hidden bg-surface-subtle border border-line">
        <Image
          src={product.imageSrc}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-base"
          sizes="96px"
        />
      </div>

      {/* Info & Reasoning */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-body-sm font-bold text-ink leading-snug line-clamp-1 group-hover:text-[#9A6A20] dark:group-hover:text-[#C49A45] transition-colors">
              {product.name}
            </h4>
            {product.rating && (
              <span className="inline-flex items-center gap-0.5 text-caption font-semibold text-ink bg-surface-subtle px-1.5 py-0.5 rounded-md border border-line shrink-0">
                <Star className="size-3 fill-[#C49A45] text-[#C49A45]" />
                {product.rating}
              </span>
            )}
          </div>

          <p className="text-[11px] text-ink-soft line-clamp-2 mt-1 italic">
            "{product.reason}"
          </p>
        </div>

        {/* Pricing & CTA */}
        <div className="flex items-center justify-between gap-2 pt-2 mt-1 border-t border-line/50">
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-body-md font-bold text-ink">
              {formatPrice(product.price)}
            </span>
            {product.mrp && product.mrp > product.price && (
              <span className="text-caption text-ink-faint line-through">
                {formatPrice(product.mrp)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddToCart}
              disabled={isAdding}
              className="h-7 px-2 text-xs"
            >
              <Plus className="size-3" />
              <span>Bag</span>
            </Button>

            <Button asChild variant="ghost" size="sm" className="h-7 px-2 text-xs text-ink-soft hover:text-ink">
              <Link href={`/products/${product.slug}`}>
                <ExternalLink className="size-3" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
