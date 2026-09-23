"use client";

import { motion as m } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Check,
  ChevronLeft,
  Heart,
  HelpCircle,
  RotateCcw,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QuantitySelector } from "@/components/ui/quantity-selector";
import { marketingRoutes } from "@/config/routes";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { ProductAiAssistant } from "@/features/products/product-ai-assistant";
import { calculateDiscountPercentage, formatPrice } from "@/lib/format";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import type { ProductDetail } from "@/types/catalogue";

export interface ProductDetailClientProps {
  product: ProductDetail;
}

const pop = {
  rest: { scale: 1 },
  popped: {
    scale: [1, 1.25, 0.92, 1],
    transition: { duration: 0.35, times: [0, 0.4, 0.7, 1] },
  },
};

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const router = useRouter();
  const { addItem, openCartDrawer } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [activeImage, setActiveImage] = React.useState(0);
  const [qty, setQty] = React.useState(1);
  const [activeTab, setActiveTab] = React.useState<"details" | "specs" | "shipping" | "reviews">("details");
  const [isAiOpen, setIsAiOpen] = React.useState(false);

  // Variant support: Generate demo variant options if not provided
  const variants = React.useMemo(() => {
    return [
      { id: "v_standard", name: "Standard Pack", priceInr: product.priceInr, mrpInr: product.mrpInr, inStock: true },
      { id: "v_duo", name: "Set of 2 (Save 10%)", priceInr: Math.round(product.priceInr * 1.9), mrpInr: Math.round((product.mrpInr || product.priceInr) * 2), inStock: true },
      { id: "v_artisan_deluxe", name: "Artisan Gift Box", priceInr: Math.round(product.priceInr * 2.6), mrpInr: Math.round((product.mrpInr || product.priceInr) * 2.8), inStock: true },
    ];
  }, [product.priceInr, product.mrpInr]);

  const [selectedVariant, setSelectedVariant] = React.useState(variants[0]);

  const currentPrice = selectedVariant.priceInr;
  const currentMrp = selectedVariant.mrpInr;
  const discount = calculateDiscountPercentage(currentPrice, currentMrp);
  const saved = isWishlisted(product.id);

  const gallery = product.gallery && product.gallery.length > 0
    ? product.gallery
    : product.image
    ? [product.image]
    : [];

  const handleAddToCart = () => {
    addItem(product, selectedVariant, qty);
    openCartDrawer();
  };

  const handleBuyNow = () => {
    addItem(product, selectedVariant, qty);
    router.push("/checkout");
  };

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.blurb,
          url: window.location.href,
        });
      } catch {
        // Shared cancelled
      }
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link Copied", "Product link copied to your clipboard.");
    }
  };

  // Review rating calculations
  const ratingValue = product.rating?.value ?? 4.8;
  const reviewCount = product.rating?.count ?? product.reviewsList?.length ?? 12;

  return (
    <div>
      {/* ── Breadcrumbs ─────────────────────────────────────────────────── */}
      <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-body-sm text-ink-faint">
        <Link href="/" className="hover:text-ink transition-colors">Home</Link>
        <span>/</span>
        <Link href={marketingRoutes.shop} className="hover:text-ink transition-colors">Shop</Link>
        <span>/</span>
        <Link
          href={`/shop?category=${product.categorySlug}`}
          className="hover:text-ink transition-colors capitalize"
        >
          {product.categorySlug.replace("-", " ")}
        </Link>
        <span>/</span>
        <span className="text-ink font-medium truncate max-w-[240px] sm:max-w-none">
          {product.name}
        </span>
      </nav>

      {/* ── Main 2-Column Product Layout ─────────────────────────────────── */}
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16 items-start">
        {/* LEFT COLUMN: Gallery Viewport & Thumbnail Rail */}
        <div className="flex flex-col gap-4 sticky top-24">
          {/* Main Large Image */}
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-canvas-deep border border-line shadow-xs group">
            {gallery[activeImage] ? (
              <Image
                src={gallery[activeImage].src}
                alt={gallery[activeImage].alt || product.name}
                width={gallery[activeImage].width || 900}
                height={gallery[activeImage].height || 900}
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority
                className="size-full object-cover transition-transform duration-slow group-hover:scale-105"
              />
            ) : null}

            {product.badge && (
              <span className="absolute left-4 top-4 z-10">
                <Badge tone="botanical" size="md">{product.badge}</Badge>
              </span>
            )}

            {/* Quick action buttons on image */}
            <div className="absolute right-4 top-4 z-10 flex gap-2">
              <button
                type="button"
                onClick={handleShare}
                aria-label="Share product"
                className="grid size-10 place-items-center rounded-pill border-2 border-line bg-surface/90 text-ink-soft shadow-xs backdrop-blur-sm transition-transform hover:text-ink active:scale-90"
              >
                <Share2 className="size-4.5" aria-hidden="true" />
              </button>

              <m.button
                type="button"
                onClick={() => toggleWishlist(product)}
                aria-pressed={saved}
                aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
                variants={pop}
                initial="rest"
                animate={saved ? "popped" : "rest"}
                className={cn(
                  "grid size-10 place-items-center rounded-pill border-2 backdrop-blur-sm shadow-xs transition-colors",
                  saved
                    ? "border-danger/40 bg-danger-surface text-danger"
                    : "border-line bg-surface/90 text-ink-soft hover:text-danger",
                )}
              >
                <Heart className={cn("size-4.5", saved && "fill-current")} aria-hidden="true" />
              </m.button>
            </div>
          </div>

          {/* Thumbnail Rail */}
          {gallery.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
              {gallery.map((img, idx) => (
                <button
                  key={img.src + idx}
                  type="button"
                  onClick={() => setActiveImage(idx)}
                  className={cn(
                    "relative size-20 shrink-0 overflow-hidden rounded-2xl bg-canvas-deep border-2 transition-all",
                    activeImage === idx
                      ? "border-primary ring-2 ring-primary/20 scale-100 shadow-sm"
                      : "border-line opacity-70 hover:opacity-100",
                  )}
                >
                  <Image
                    src={img.src}
                    alt={img.alt || `${product.name} thumbnail ${idx + 1}`}
                    fill
                    sizes="5rem"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Maker Provenance Banner */}
          <div className="mt-2 rounded-2xl border border-line bg-soft-green/50 p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-surface border border-line font-display text-heading-sm font-bold text-primary">
                {product.brand.name.slice(0, 2).toUpperCase()}
              </span>
              <div>
                <p className="text-caption font-semibold text-primary">Authentic Artisan Partner</p>
                <p className="text-body-sm font-medium text-ink">{product.brand.name}</p>
              </div>
            </div>
            <Link
              href={`/brands`}
              className="text-body-sm font-semibold text-primary hover:text-deep transition-colors inline-flex items-center gap-1"
            >
              Meet maker
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* RIGHT COLUMN: Product Header, Pricing, Variants & Purchase Actions */}
        <div className="flex flex-col">
          {/* Brand & Title */}
          <div>
            <Link
              href={`/brands`}
              className="text-caption font-semibold uppercase tracking-[0.1em] text-gold-deep hover:underline"
            >
              {product.brand.name}
            </Link>
            <h1 className="mt-1.5 font-display text-display-md sm:text-display-lg font-medium text-ink">
              {product.name}
            </h1>
          </div>

          {/* Rating & Review Counter */}
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 text-gold">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={cn(
                    "size-4",
                    s <= Math.round(ratingValue) ? "fill-gold text-gold" : "text-line-strong",
                  )}
                  aria-hidden="true"
                />
              ))}
            </div>
            <span className="text-body-sm font-bold text-ink tabular-nums">
              {ratingValue.toFixed(1)}
            </span>
            <span className="text-body-sm text-ink-faint">
              ({reviewCount} customer reviews)
            </span>
          </div>

          {/* Price & Savings */}
          <div className="mt-5 flex flex-wrap items-baseline gap-3">
            <span className="text-display-md font-bold text-ink tabular-nums">
              {formatPrice(currentPrice)}
            </span>
            {currentMrp && currentMrp > currentPrice && (
              <span className="text-body-lg text-ink-faint line-through tabular-nums">
                {formatPrice(currentMrp)}
              </span>
            )}
            {discount && (
              <Badge tone="botanical" size="md">
                {discount}% OFF
              </Badge>
            )}
          </div>

          {/* Availability Status */}
          <div className="mt-2.5 flex items-center gap-2">
            <span className="size-2 rounded-full bg-success animate-pulse" />
            <p className="text-body-sm font-medium text-success">
              In Stock — Handcrafted and ready to ship within 24–48 hours
            </p>
          </div>

          {/* Editorial Blurb */}
          <p className="mt-4 text-body-md text-ink-soft leading-relaxed">
            {product.blurb}
          </p>

          <hr className="my-6 border-line" />

          {/* ── Variant Selector ────────────────────────────────────────── */}
          <div>
            <label className="text-body-sm font-semibold text-ink mb-2.5 block">
              Select Option: <span className="font-normal text-ink-soft">{selectedVariant.name}</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {variants.map((variant) => {
                const isSelected = selectedVariant.id === variant.id;
                return (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setSelectedVariant(variant)}
                    className={cn(
                      "rounded-xl border-2 p-3 text-left transition-all",
                      isSelected
                        ? "border-primary bg-soft-green/60 shadow-xs ring-1 ring-primary"
                        : "border-line bg-surface hover:border-line-strong",
                    )}
                  >
                    <p className="text-body-sm font-semibold text-ink">{variant.name}</p>
                    <p className="mt-1 text-caption font-bold text-primary tabular-nums">
                      {formatPrice(variant.priceInr)}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Quantity + Primary Action Buttons ────────────────────────── */}
          <div className="mt-6 space-y-3.5">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Quantity Selector */}
              <div className="flex items-center gap-2">
                <span className="text-body-sm font-semibold text-ink sm:hidden">Quantity:</span>
                <QuantitySelector
                  size="lg"
                  value={qty}
                  onChange={setQty}
                  label="product quantity"
                />
              </div>

              {/* Add to Bag CTA */}
              <Button
                size="lg"
                variant="primary"
                className="flex-1"
                onClick={handleAddToCart}
              >
                <ShoppingBag className="size-5" aria-hidden="true" />
                Add to Bag • {formatPrice(currentPrice * qty)}
              </Button>
            </div>

            {/* Buy Now Direct Checkout */}
            <Button
              size="lg"
              variant="outline"
              fullWidth
              onClick={handleBuyNow}
              className="border-2"
            >
              <Zap className="size-4.5 text-gold-deep" aria-hidden="true" />
              Buy Now with Express Checkout
            </Button>
          </div>

          {/* ── Ask Bhagya AI Trigger ───────────────────────────────────── */}
          <div className="mt-6">
            <button
              type="button"
              onClick={() => setIsAiOpen(true)}
              className="group w-full flex items-center justify-between rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-soft-green via-surface to-soft-green p-4 transition-all hover:border-primary hover:shadow-sm text-left"
            >
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-r from-primary to-botanical text-white shadow-xs">
                  <Sparkles className="size-4.5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-body-sm font-bold text-ink group-hover:text-primary flex items-center gap-1.5">
                    Have questions about this piece?
                    <Badge tone="gold" size="sm">Ask AI</Badge>
                  </p>
                  <p className="text-caption text-ink-soft">
                    Ask about sizing, materials, artisanal techniques & care
                  </p>
                </div>
              </div>
              <ArrowRight className="size-4 text-primary transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </button>
          </div>

          {/* ── Trust Strip Reassurance ─────────────────────────────────── */}
          <div className="mt-8 grid grid-cols-2 gap-3 border-t border-line pt-6">
            <div className="flex items-start gap-2.5">
              <Truck className="size-4 text-primary mt-0.5 shrink-0" aria-hidden="true" />
              <div>
                <p className="text-body-sm font-semibold text-ink">Free Delivery</p>
                <p className="text-caption text-ink-soft">On all orders above ₹1,499</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="size-4 text-primary mt-0.5 shrink-0" aria-hidden="true" />
              <div>
                <p className="text-body-sm font-semibold text-ink">100% Genuine</p>
                <p className="text-caption text-ink-soft">Handcrafted by certified artisans</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Detailed Tabs / Specifications / Reviews Section ────────────── */}
      <div className="mt-16 sm:mt-20 border-t border-line pt-10">
        <div className="flex border-b border-line gap-4 sm:gap-8 overflow-x-auto pb-px scrollbar-none">
          {[
            { id: "details", label: "Description & Craft" },
            { id: "specs", label: "Specifications" },
            { id: "shipping", label: "Shipping & Returns" },
            { id: "reviews", label: `Reviews (${reviewCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                "pb-3.5 text-body-md font-semibold transition-all whitespace-nowrap relative",
                activeTab === tab.id
                  ? "text-primary border-b-2 border-primary"
                  : "text-ink-soft hover:text-ink",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="py-8">
          {activeTab === "details" && (
            <div className="max-w-3xl space-y-6 text-body-md text-ink-soft leading-relaxed">
              <p>{product.description}</p>

              <h4 className="font-display text-heading-md font-semibold text-ink pt-2">
                Artisanal Heritage & Ethics
              </h4>
              <p>
                Every unit is created in small batches by master craftspeople using regional Indian materials.
                By choosing this product, you directly sustain hereditary artisan families and preserve centuries-old handcraft legacies.
              </p>

              {product.careInstructions && (
                <div className="rounded-2xl border border-line bg-surface p-5">
                  <h5 className="font-bold text-ink text-body-sm mb-1">Care Instructions</h5>
                  <p className="text-body-sm text-ink-soft">{product.careInstructions}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "specs" && (
            <div className="max-w-2xl">
              <dl className="divide-y divide-line rounded-2xl border border-line bg-surface overflow-hidden">
                {product.specifications?.map((spec) => (
                  <div key={spec.label} className="grid grid-cols-2 p-4 text-body-sm">
                    <dt className="font-semibold text-ink-soft">{spec.label}</dt>
                    <dd className="text-ink font-medium">{spec.value}</dd>
                  </div>
                ))}
                <div className="grid grid-cols-2 p-4 text-body-sm">
                  <dt className="font-semibold text-ink-soft">Origin</dt>
                  <dd className="text-ink font-medium">India</dd>
                </div>
              </dl>
            </div>
          )}

          {activeTab === "shipping" && (
            <div className="max-w-2xl space-y-5 text-body-md text-ink-soft">
              <div className="rounded-2xl border border-line bg-surface p-5 space-y-3">
                <div className="flex items-center gap-2 font-bold text-ink">
                  <Truck className="size-5 text-primary" />
                  <span>Dispatch & Delivery</span>
                </div>
                <p className="text-body-sm">{product.shippingInfo || "Dispatches in 24–48 hours from master artisan workshop. Standard delivery takes 3–5 business days across India."}</p>
              </div>

              <div className="rounded-2xl border border-line bg-surface p-5 space-y-3">
                <div className="flex items-center gap-2 font-bold text-ink">
                  <RotateCcw className="size-5 text-primary" />
                  <span>7-Day Easy Returns</span>
                </div>
                <p className="text-body-sm">If your handcrafted product arrives damaged or defective, we provide a 100% no-questions-asked refund or replacement within 7 days of delivery.</p>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-8">
              {/* Rating Summary Bar */}
              <div className="grid sm:grid-cols-[14rem_1fr] gap-8 items-center rounded-2xl border border-line bg-surface p-6">
                <div className="text-center sm:text-left">
                  <p className="text-display-lg font-bold text-ink leading-none tabular-nums">
                    {ratingValue.toFixed(1)}
                  </p>
                  <div className="flex justify-center sm:justify-start gap-1 text-gold my-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="size-4 fill-gold text-gold" />
                    ))}
                  </div>
                  <p className="text-caption text-ink-faint">
                    Based on {reviewCount} verified reviews
                  </p>
                </div>

                {/* Rating bars */}
                <div className="space-y-2 text-caption">
                  {[
                    { stars: 5, pct: 85 },
                    { stars: 4, pct: 12 },
                    { stars: 3, pct: 3 },
                    { stars: 2, pct: 0 },
                    { stars: 1, pct: 0 },
                  ].map((row) => (
                    <div key={row.stars} className="flex items-center gap-3">
                      <span className="w-6 text-ink-soft tabular-nums font-medium">{row.stars} ★</span>
                      <div className="h-2 flex-1 rounded-pill bg-line overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-botanical"
                          style={{ width: `${row.pct}%` }}
                        />
                      </div>
                      <span className="w-8 text-right text-ink-faint tabular-nums">{row.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample Review Cards */}
              <div className="grid gap-4 sm:grid-cols-2">
                {(product.reviewsList && product.reviewsList.length > 0
                  ? product.reviewsList
                  : [
                      {
                        id: "r1",
                        author: "Aarav Sharma",
                        rating: 5,
                        date: "12 September 2026",
                        title: "Outstanding artisanal quality",
                        comment: "The craftsmanship is exceptional. You can feel the natural handmade textures right away.",
                        verified: true,
                      },
                      {
                        id: "r2",
                        author: "Meera Iyer",
                        rating: 5,
                        date: "28 August 2026",
                        title: "Truly authentic Indian craft",
                        comment: "Shipped swiftly with eco-friendly packaging. Delighted to support authentic master makers.",
                        verified: true,
                      },
                    ]
                ).map((review) => (
                  <div key={review.id} className="rounded-2xl border border-line bg-surface p-5 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-gold">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={cn(
                              "size-3.5",
                              s <= review.rating ? "fill-gold text-gold" : "text-line-strong",
                            )}
                          />
                        ))}
                      </div>
                      <span className="text-caption text-ink-faint">{review.date}</span>
                    </div>
                    <h5 className="font-bold text-ink text-body-sm">{review.title}</h5>
                    <p className="text-body-sm text-ink-soft leading-relaxed">{review.comment}</p>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-caption font-semibold text-ink">{review.author}</span>
                      {review.verified && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-success">
                          <Check className="size-3" /> Verified Buyer
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Sticky Mobile Action Bar ────────────────────────────────────── */}
      <div className="fixed inset-x-0 bottom-0 z-sticky lg:hidden border-t border-line bg-surface/95 backdrop-blur-md p-3.5 shadow-xl">
        <div className="flex items-center gap-3 max-w-md mx-auto">
          <div>
            <p className="text-caption text-ink-faint">Total Price</p>
            <p className="text-body-md font-bold text-ink tabular-nums">
              {formatPrice(currentPrice * qty)}
            </p>
          </div>
          <Button
            size="md"
            variant="primary"
            className="flex-1"
            onClick={handleAddToCart}
          >
            <ShoppingBag className="size-4" aria-hidden="true" />
            Add to Bag
          </Button>
        </div>
      </div>

      {/* ── AI Assistant Panel Modal ────────────────────────────────────── */}
      <ProductAiAssistant
        product={product}
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
      />
    </div>
  );
}
