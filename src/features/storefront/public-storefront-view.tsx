"use client";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  Globe,
  Heart,
  Mail,
  MapPin,
  Phone,
  Send,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { products } from "@/data/products";
import { ProductCard } from "@/features/products/product-card";
import { trackEvent } from "@/lib/analytics/tracker";
import { toast } from "@/lib/toast";
import type {
  PublicStorefrontData,
  StorefrontSection,
} from "@/services/storefront.service";

interface PublicStorefrontViewProps {
  data: PublicStorefrontData;
}

export function PublicStorefrontView({ data }: PublicStorefrontViewProps) {
  const { configuration: cfg, sections, isPreview, storeSlug } = data;
  const [newsletterEmail, setNewsletterEmail] = React.useState("");
  const [subscribed, setSubscribed] = React.useState(false);

  React.useEffect(() => {
    trackEvent(isPreview ? "STOREFRONT_PREVIEW_VIEW" : "STOREFRONT_VIEW", {
      storeId: data.storeId,
      properties: {
        storeSlug: data.storeSlug,
        version: data.version,
        canonicalUrl: data.canonicalUrl,
      },
    });
  }, [data, isPreview]);

  function handleNewsletterSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribed(true);
    toast.success("Subscribed", "You have joined the weaver guild dispatch list.");
    trackEvent("STOREFRONT_NEWSLETTER_SUBSCRIBE", {
      storeId: data.storeId,
      properties: { email: newsletterEmail },
    });
  }

  // Filter curated products for this store's showcase
  const displayProducts = products.slice(0, 4);

  return (
    <div
      className="min-h-screen flex flex-col bg-background text-ink antialiased"
      style={
        {
          "--store-primary": cfg.primaryColor,
          "--store-secondary": cfg.secondaryColor,
          "--store-accent": cfg.accentColor,
          fontFamily: cfg.typography || "Outfit, sans-serif",
        } as React.CSSProperties
      }
    >
      {/* ── Sticky Draft Preview Banner ─────────────────────────────── */}
      {isPreview && (
        <aside
          aria-label="Draft preview notification"
          className="sticky top-0 z-50 border-b border-warning/30 bg-warning/90 px-4 py-2 text-charcoal backdrop-blur-md shadow-sm"
        >
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-caption font-semibold">
            <div className="flex items-center gap-2">
              <span className="inline-flex size-2 rounded-full bg-charcoal animate-pulse" />
              <span>DRAFT PREVIEW</span>
              <span className="hidden sm:inline text-charcoal/80 font-normal">
                — You are viewing draft version {cfg.publishedVersion + 1}. Changes are not visible to customers until published.
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Button asChild variant="ghost" size="sm" className="h-7 text-xs text-charcoal hover:bg-black/10 gap-1">
                <Link href="/merchant/storefront">
                  <ArrowLeft className="size-3" />
                  <span>Return to Builder</span>
                </Link>
              </Button>
            </div>
          </div>
        </aside>
      )}

      {/* ── Storefront Header ───────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur-md">
        <Container width="wide" className="flex items-center justify-between py-3.5 sm:py-4">
          {/* Logo / Store Name */}
          <Link href={`/store/${storeSlug}`} className="flex items-center gap-3 group">
            {cfg.logoUrl ? (
              <img
                src={cfg.logoUrl}
                alt={cfg.storeName}
                className="size-10 rounded-xl object-cover border border-line shadow-xs group-hover:scale-105 transition-transform"
              />
            ) : (
              <div
                className="size-10 rounded-xl flex items-center justify-center font-bold text-white shadow-xs"
                style={{ backgroundColor: cfg.primaryColor }}
              >
                {cfg.storeName.substring(0, 2).toUpperCase()}
              </div>
            )}
            <div className="space-y-0.5">
              <span className="font-display text-lg font-bold text-ink group-hover:text-primary transition-colors">
                {cfg.storeName}
              </span>
              <span className="hidden sm:block text-xs text-ink-muted">
                {cfg.tagline || data.craftCategory}
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            {(cfg.navigationItems || []).map((nav, i) => (
              <Link
                key={i}
                href={nav.url as any}
                className="text-body-sm font-medium text-ink-soft hover:text-ink transition-colors"
                onClick={() =>
                  trackEvent("STOREFRONT_NAV_CLICK", {
                    storeId: data.storeId,
                    properties: { label: nav.label, url: nav.url },
                  })
                }
              >
                {nav.label}
              </Link>
            ))}
          </nav>

          {/* Header Utilities */}
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm" className="size-9 p-0 text-ink-soft hover:text-ink">
              <Link href="/account/wishlist" aria-label="Wishlist">
                <Heart className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="gap-2 border-line">
              <Link href="/cart">
                <ShoppingBag className="size-4" />
                <span className="hidden sm:inline">Cart</span>
              </Link>
            </Button>
          </div>
        </Container>
      </header>

      {/* ── Main Storefront Content ─────────────────────────────────── */}
      <main className="flex-1 space-y-16 sm:space-y-24 pb-20">
        {sections.map((section) => (
          <section key={section.id} id={section.sectionType.toLowerCase()} className="scroll-mt-20">
            {/* HERO SECTION */}
            {section.sectionType === "HERO" && (
              <div className="relative overflow-hidden bg-canvas-deep border-b border-line py-16 sm:py-24 lg:py-32">
                <div
                  className="absolute inset-0 opacity-15 bg-cover bg-center pointer-events-none"
                  style={{
                    backgroundImage: `url(${
                      section.contentConfig?.backgroundImageUrl ||
                      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=80"
                    })`,
                  }}
                />
                <Container width="content" className="relative z-10 text-center space-y-6 max-w-3xl mx-auto">
                  <div className="inline-flex items-center gap-1.5 rounded-pill px-3 py-1 text-caption font-bold uppercase tracking-wider text-white shadow-xs"
                    style={{ backgroundColor: cfg.accentColor }}
                  >
                    <Sparkles className="size-3.5" />
                    <span>{section.contentConfig?.badge || "GI Certified Origin • 100% Handloom"}</span>
                  </div>

                  <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-ink leading-tight">
                    {section.title}
                  </h1>

                  {section.subtitle && (
                    <p className="text-body sm:text-body-lg text-ink-soft leading-relaxed max-w-2xl mx-auto">
                      {section.subtitle}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                    <Button
                      asChild
                      size="lg"
                      className="px-6 font-bold text-white shadow-md hover:scale-102 transition-transform"
                      style={{ backgroundColor: cfg.primaryColor }}
                    >
                      <Link href={(section.contentConfig?.ctaPrimaryUrl || "/shop") as any}>
                        <span>{section.contentConfig?.ctaPrimaryText || "Explore Masterpieces"}</span>
                        <ArrowRight className="size-4 ml-1.5" />
                      </Link>
                    </Button>

                    <Button asChild variant="outline" size="lg" className="border-line bg-surface hover:bg-surface-raised">
                      <Link href={(section.contentConfig?.ctaSecondaryUrl || "#brand_story") as any}>
                        <span>{section.contentConfig?.ctaSecondaryText || "The Weaver's Tale"}</span>
                      </Link>
                    </Button>
                  </div>
                </Container>
              </div>
            )}

            {/* FEATURED PRODUCTS */}
            {section.sectionType === "FEATURED_PRODUCTS" && (
              <Container width="wide" className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-line pb-4">
                  <div className="space-y-1">
                    <span className="text-caption font-bold uppercase tracking-wider text-ink-muted">
                      {section.contentConfig?.tag || "Loom Editions"}
                    </span>
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink">{section.title}</h2>
                    {section.subtitle && <p className="text-body-sm text-ink-soft">{section.subtitle}</p>}
                  </div>
                  <Button asChild variant="ghost" size="sm" className="gap-1.5 text-primary hover:text-primary-dark">
                    <Link href="/shop">
                      <span>View Full Catalogue</span>
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                  {displayProducts.map((p) => (
                    <ProductCard key={p.id} product={p} href={`/products/${p.slug}` as any} />
                  ))}
                </div>
              </Container>
            )}

            {/* BRAND STORY */}
            {section.sectionType === "BRAND_STORY" && (
              <div className="bg-surface-raised border-y border-line py-16 sm:py-20">
                <Container width="wide" className="grid gap-12 lg:grid-cols-2 items-center">
                  <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 text-caption font-bold uppercase tracking-wider text-primary">
                      <MapPin className="size-3.5" />
                      <span>{section.contentConfig?.location || "Varanasi, Uttar Pradesh, India"}</span>
                    </div>

                    <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink leading-tight">
                      {section.title}
                    </h2>

                    <blockquote className="border-l-2 pl-4 italic text-body-lg text-ink-soft" style={{ borderColor: cfg.accentColor }}>
                      "{section.contentConfig?.quote || "Every warp thread is aligned by eye; every shuttle throw carries a rhythm perfected over a century of weaver devotion."}"
                    </blockquote>

                    {section.subtitle && (
                      <p className="text-body text-ink-soft leading-relaxed">{section.subtitle}</p>
                    )}

                    <div className="pt-2 flex items-center gap-3">
                      <span className="size-3 rounded-full" style={{ backgroundColor: cfg.primaryColor }} />
                      <span className="font-bold text-body-sm text-ink">
                        {section.contentConfig?.artisanName || "Master Artisan Cooperative"}
                      </span>
                    </div>
                  </div>

                  <div className="relative rounded-2xl overflow-hidden border border-line shadow-card aspect-4/3">
                    <img
                      src={
                        section.contentConfig?.imageUrl ||
                        "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80"
                      }
                      alt="Artisan at Loom"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Container>
              </div>
            )}

            {/* COLLECTIONS */}
            {section.sectionType === "COLLECTIONS" && (
              <Container width="wide" className="space-y-8">
                <div className="text-center space-y-2 max-w-xl mx-auto">
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink">{section.title}</h2>
                  {section.subtitle && <p className="text-body-sm text-ink-soft">{section.subtitle}</p>}
                </div>

                <div className="grid gap-6 sm:grid-cols-3">
                  {[
                    {
                      name: "Bridal Banarasi Heirlooms",
                      desc: "Pure mulberry silk with real gold & silver electroplated zari",
                      img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
                    },
                    {
                      name: "Handwoven Kadhwa Brocades",
                      desc: "Individually hand-locked jacquard patterns taking 40 days per saree",
                      img: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=600&q=80",
                    },
                    {
                      name: "Contemporary Khadi Twills",
                      desc: "Featherlight organic cottons spun on amber charkhas",
                      img: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=600&q=80",
                    },
                  ].map((col, idx) => (
                    <Card
                      key={idx}
                      variant="surface"
                      padding="none"
                      radius="lg"
                      className="overflow-hidden group border-line shadow-xs hover:shadow-card transition-shadow"
                    >
                      <div className="h-52 overflow-hidden relative">
                        <img
                          src={col.img}
                          alt={col.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <span className="absolute bottom-3 left-4 font-display text-lg font-bold text-white">
                          {col.name}
                        </span>
                      </div>
                      <div className="p-5 space-y-3">
                        <p className="text-caption text-ink-soft">{col.desc}</p>
                        <Button asChild variant="outline" size="sm" className="w-full border-line">
                          <Link href="/shop">Explore Collection</Link>
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </Container>
            )}

            {/* TESTIMONIALS */}
            {section.sectionType === "TESTIMONIALS" && (
              <Container width="wide" className="space-y-8">
                <div className="text-center space-y-2 max-w-xl mx-auto">
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink">{section.title}</h2>
                  {section.subtitle && <p className="text-body-sm text-ink-soft">{section.subtitle}</p>}
                </div>

                <div className="grid gap-6 sm:grid-cols-3">
                  {[
                    {
                      author: "Devika Ramanathan",
                      role: "Textile Historian, Chennai",
                      text: "The drape and pure mulberry sheen of this Banarasi silk are incomparable. You can immediately feel the weight of authentic pit-loom craftsmanship.",
                    },
                    {
                      author: "Ananya Sen",
                      role: "Connoisseur, Kolkata",
                      text: "Direct artisan transparency is what sets this store apart. Knowing the weaver family's name and GI origin makes this an heirloom for my daughter.",
                    },
                    {
                      author: "Rohit & Meera Kapoor",
                      role: "Bridal Patron, Mumbai",
                      text: "Commissioned custom wedding sarees with bespoke motifs. The master weavers delivered exceptional quality right on schedule.",
                    },
                  ].map((t, idx) => (
                    <Card key={idx} variant="surface" padding="md" radius="lg" className="border-line space-y-3 bg-surface">
                      <div className="flex items-center gap-1 text-warning">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="size-4 fill-warning" />
                        ))}
                      </div>
                      <p className="text-body-sm text-ink-soft italic leading-relaxed">"{t.text}"</p>
                      <div className="pt-2 border-t border-line">
                        <p className="font-bold text-body-sm text-ink">{t.author}</p>
                        <span className="text-caption text-ink-muted">{t.role}</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </Container>
            )}

            {/* CTA */}
            {section.sectionType === "CTA" && (
              <Container width="content">
                <Card
                  variant="surface"
                  padding="lg"
                  radius="lg"
                  className="border-line shadow-card text-center space-y-6 bg-surface-raised"
                >
                  <span
                    className="inline-block px-3 py-1 text-caption font-bold uppercase tracking-wider text-white rounded-pill mx-auto"
                    style={{ backgroundColor: cfg.accentColor }}
                  >
                    {section.contentConfig?.badge || "Bespoke Craft Commissions"}
                  </span>
                  <h2 className="font-display text-3xl font-bold text-ink">{section.title}</h2>
                  {section.subtitle && (
                    <p className="text-body text-ink-soft max-w-xl mx-auto">{section.subtitle}</p>
                  )}
                  <Button
                    asChild
                    size="lg"
                    className="px-8 font-bold text-white shadow-sm"
                    style={{ backgroundColor: cfg.primaryColor }}
                  >
                    <Link href={(section.contentConfig?.buttonUrl || "/contact") as any}>
                      {section.contentConfig?.buttonText || "Schedule Consultation"}
                    </Link>
                  </Button>
                </Card>
              </Container>
            )}

            {/* NEWSLETTER */}
            {section.sectionType === "NEWSLETTER" && (
              <div className="bg-canvas-deep border-y border-line py-16">
                <Container width="content" className="text-center space-y-6 max-w-xl mx-auto">
                  <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto">
                    <Mail className="size-6" />
                  </div>
                  <h2 className="font-display text-3xl font-bold text-ink">{section.title}</h2>
                  {section.subtitle && <p className="text-body text-ink-soft">{section.subtitle}</p>}

                  {subscribed ? (
                    <div className="rounded-xl border border-success/30 bg-success/10 p-4 flex items-center justify-center gap-2 text-success font-bold text-body-sm">
                      <CheckCircle2 className="size-4" />
                      <span>Thank you! You are now subscribed to artisan dispatches.</span>
                    </div>
                  ) : (
                    <form onSubmit={handleNewsletterSubmit} className="flex gap-2 max-w-md mx-auto">
                      <input
                        type="email"
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        placeholder="Enter your email for loom updates"
                        required
                        className="flex-1 rounded-xl border border-line bg-surface px-4 py-2.5 text-body-sm text-ink focus:border-primary focus:outline-hidden"
                      />
                      <Button
                        type="submit"
                        className="font-bold text-white shrink-0"
                        style={{ backgroundColor: cfg.primaryColor }}
                      >
                        Subscribe
                      </Button>
                    </form>
                  )}
                </Container>
              </div>
            )}
          </section>
        ))}
      </main>

      {/* ── Storefront Footer ───────────────────────────────────────── */}
      <footer className="border-t border-line bg-surface pt-12 pb-8">
        <Container width="wide" className="space-y-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-3">
              <span className="font-display text-xl font-bold text-ink">{cfg.storeName}</span>
              <p className="text-caption text-ink-soft leading-relaxed">{cfg.description}</p>
              <div className="flex items-center gap-1.5 text-caption font-semibold text-success">
                <ShieldCheck className="size-4" />
                <span>Verified Bhagya Artisan Guild Member</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-caption font-bold uppercase tracking-wider text-ink">Navigation</span>
              <ul className="space-y-1.5 text-caption text-ink-soft">
                {(cfg.navigationItems || []).map((n, i) => (
                  <li key={i}>
                    <Link href={n.url as any} className="hover:text-ink">
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <span className="text-caption font-bold uppercase tracking-wider text-ink">Artisan Contact</span>
              <ul className="space-y-2 text-caption text-ink-soft">
                {cfg.contactEmail && (
                  <li className="flex items-center gap-2">
                    <Mail className="size-3.5 text-primary" />
                    <span>{cfg.contactEmail}</span>
                  </li>
                )}
                {cfg.contactPhone && (
                  <li className="flex items-center gap-2">
                    <Phone className="size-3.5 text-primary" />
                    <span>{cfg.contactPhone}</span>
                  </li>
                )}
              </ul>
            </div>

            <div className="space-y-2">
              <span className="text-caption font-bold uppercase tracking-wider text-ink">Platform Guarantee</span>
              <p className="text-caption text-ink-muted leading-relaxed">
                All purchases directly benefit generational artisan guilds across India. Secured by Bhagya Commerce.
              </p>
            </div>
          </div>

          <div className="border-t border-line pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-caption text-ink-muted">
            <p>© {new Date().getFullYear()} {cfg.storeName}. All rights reserved.</p>
            <p className="inline-flex items-center gap-1">
              <span>Powered by</span>
              <span className="font-bold text-ink">Bhagya Commerce</span>
            </p>
          </div>
        </Container>
      </footer>
    </div>
  );
}
