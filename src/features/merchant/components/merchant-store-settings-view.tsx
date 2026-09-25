"use client";

import { Check, ExternalLink, Globe, Loader2, Palette, Sparkles, Store as StoreIcon } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/auth-context";
import { LiveStorePreview } from "@/features/merchant/components/live-store-preview";
import type { Store } from "@/features/merchant/merchant-types";
import { BRAND_ACCENTS, MERCHANT_CATEGORIES } from "@/features/merchant/merchant-utils";
import { toast } from "@/lib/toast";
import { merchantDashboardService } from "@/services/merchant-dashboard.service";
import { merchantService } from "@/services/merchant.service";

export function MerchantStoreSettingsView() {
  const { user, refreshUser } = useAuth();
  const [store, setStore] = React.useState<Store | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);

  // Form fields
  const [name, setName] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [tagline, setTagline] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [categoryId, setCategoryId] = React.useState("heritage-fashion");
  const [brandAccent, setBrandAccent] = React.useState("#C49A45");
  const [status, setStatus] = React.useState<"active" | "draft">("active");

  React.useEffect(() => {
    async function init() {
      setIsLoading(true);
      try {
        if (user?.id) {
          const s = await merchantService.getUserStore(user.id);
          if (s) {
            setStore(s);
            setName(s.name);
            setSlug(s.slug);
            setTagline(s.tagline || "");
            setDescription(s.description || "");
            setCategoryId(s.categoryId || "heritage-fashion");
            setBrandAccent(s.brandAccent || "#C49A45");
            setStatus(s.status === "active" ? "active" : "draft");
          }
        }
      } catch {
        // Fallback
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!store) return;

    setIsSaving(true);
    try {
      const category = MERCHANT_CATEGORIES.find((c) => c.id === categoryId);
      const updated: Store = {
        ...store,
        name: name.trim(),
        slug: slug.trim().toLowerCase(),
        tagline: tagline.trim() || undefined,
        description: description.trim() || undefined,
        categoryId,
        categoryName: category?.name || store.categoryName,
        brandAccent,
        status,
      };

      await merchantDashboardService.updateStoreProfile(updated);
      setStore(updated);
      await refreshUser();
      toast.success("Store Settings Saved", "Your public storefront profile has been updated.");
    } catch {
      toast.error("Save Failed", "Could not save store settings.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center text-body-sm text-ink-soft animate-pulse">
        Loading store settings...
      </div>
    );
  }

  const previewData = {
    storeName: name,
    storeSlug: slug,
    storeTagline: tagline,
    storeDescription: description,
    primaryCategoryId: categoryId,
    brandAccent,
    logoUrl: store?.logoUrl,
    bannerUrl: store?.bannerUrl,
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-display-sm font-bold text-ink">
            Store Profile & Settings
          </h1>
          <p className="text-body-sm text-ink-soft mt-0.5">
            Configure how your artisan brand appears to buyers across Bhagya Commerce.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={"/shop" as any}>
              <ExternalLink className="size-3.5" />
              <span>View Public Store</span>
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Cols: Store Form */}
        <form onSubmit={handleSave} className="lg:col-span-7 space-y-6">
          <Card variant="surface" padding="lg" radius="xl" className="border-line shadow-card space-y-5">
            <CardContent className="space-y-4 p-1">
              <div>
                <label htmlFor="sname" className="block text-body-sm font-medium text-ink mb-1.5">
                  Store Display Name
                </label>
                <Input
                  id="sname"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="sslug" className="block text-body-sm font-medium text-ink mb-1.5">
                  Store URL Handle
                </label>
                <div className="flex rounded-xl border border-line bg-surface overflow-hidden">
                  <span className="inline-flex items-center px-3 bg-surface-subtle border-r border-line text-xs font-mono text-ink-soft">
                    bhagya.in/store/
                  </span>
                  <input
                    id="sslug"
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                    className="flex-1 px-3 py-2 text-body-sm font-mono text-ink focus:outline-none bg-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="stagline" className="block text-body-sm font-medium text-ink mb-1.5">
                  Brand Tagline
                </label>
                <Input
                  id="stagline"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. 4th generation master weavers of pure Banarasi brocade"
                />
              </div>

              <div>
                <label htmlFor="scat" className="block text-body-sm font-medium text-ink mb-1.5">
                  Primary Craft Category
                </label>
                <select
                  id="scat"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-body-sm text-ink focus:border-[#C49A45] focus:outline-none"
                >
                  {MERCHANT_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="sdesc" className="block text-body-sm font-medium text-ink mb-1.5">
                  Store Story & Bio
                </label>
                <Textarea
                  id="sdesc"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell buyers about your heritage, making process, and materials..."
                />
              </div>

              {/* Brand Accent */}
              <div>
                <label className="block text-body-sm font-medium text-ink mb-2">
                  Brand Accent Colour
                </label>
                <div className="flex flex-wrap gap-2">
                  {BRAND_ACCENTS.map((accent) => {
                    const isSelected = brandAccent === accent.hex;
                    return (
                      <button
                        type="button"
                        key={accent.id}
                        onClick={() => setBrandAccent(accent.hex)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                          isSelected
                            ? "border-[#C49A45] bg-[#C49A45]/10 text-ink"
                            : "border-line bg-surface text-ink-soft hover:text-ink"
                        }`}
                      >
                        <span className={`size-3 rounded-full ${accent.bgClass}`} />
                        <span>{accent.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Status Radio */}
              <div className="pt-2 border-t border-line">
                <label className="block text-body-sm font-medium text-ink mb-2">
                  Storefront Visibility
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-body-sm text-ink cursor-pointer">
                    <input
                      type="radio"
                      name="storeStatus"
                      checked={status === "active"}
                      onChange={() => setStatus("active")}
                      className="accent-[#C49A45]"
                    />
                    <span>Active (Public Storefront Live)</span>
                  </label>
                  <label className="flex items-center gap-2 text-body-sm text-ink cursor-pointer">
                    <input
                      type="radio"
                      name="storeStatus"
                      checked={status === "draft"}
                      onChange={() => setStatus("draft")}
                      className="accent-[#C49A45]"
                    />
                    <span>Draft Mode (Hidden from Search)</span>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" variant="primary" size="lg" disabled={isSaving}>
              {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
              Save Changes
            </Button>
          </div>
        </form>

        {/* Right 5 Cols: Live Storefront Preview */}
        <div className="lg:col-span-5 sticky top-24">
          <LiveStorePreview data={previewData} />
        </div>
      </div>
    </div>
  );
}
