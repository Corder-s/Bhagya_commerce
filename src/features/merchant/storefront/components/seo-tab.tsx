"use client";

import { Globe, Search, Share2, UploadCloud } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/lib/toast";
import { objectStorageService } from "@/services/object-storage.service";
import type { StorefrontConfiguration } from "@/services/storefront.service";

interface SeoTabProps {
  config: StorefrontConfiguration;
  onUpdate: (data: Partial<StorefrontConfiguration>) => Promise<void>;
}

export function SeoTab({ config, onUpdate }: SeoTabProps) {
  const [seoTitle, setSeoTitle] = React.useState(config.seoTitle || "");
  const [seoDescription, setSeoDescription] = React.useState(config.seoDescription || "");
  const [seoKeywords, setSeoKeywords] = React.useState(config.seoKeywords || "");
  const [ogTitle, setOgTitle] = React.useState(config.ogTitle || "");
  const [ogDescription, setOgDescription] = React.useState(config.ogDescription || "");
  const [ogImageUrl, setOgImageUrl] = React.useState(config.ogImageUrl || "");
  const [uploadingOg, setUploadingOg] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  async function handleOgUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingOg(true);
    try {
      const res = await objectStorageService.uploadAsset(file, { folder: "banners" });
      setOgImageUrl(res.url);
      toast.success("Social Image Uploaded", "Saved to Cloudflare R2 object vault.");
    } catch (err: any) {
      toast.error("Upload Failed", err.message || "Could not upload image.");
    } finally {
      setUploadingOg(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await onUpdate({
        seoTitle,
        seoDescription,
        seoKeywords,
        ogTitle: ogTitle || seoTitle,
        ogDescription: ogDescription || seoDescription,
        ogImageUrl,
      });
      toast.success("SEO Saved", "Search engine & social sharing metadata saved in draft.");
    } catch (err: any) {
      toast.error("Save Failed", err.message || "Could not save metadata.");
    } finally {
      setSaving(false);
    }
  }

  const previewTitle = seoTitle || `${config.storeName} | Authentic Artisan Craft`;
  const previewDesc = seoDescription || config.description || "Discover verified handloom textiles and generational Indian artisan heritage.";

  return (
    <form onSubmit={handleSave} className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <h2 className="font-display text-xl font-bold text-ink">Search Engine Optimization & Social Sharing</h2>
          <p className="text-body-sm text-ink-soft">
            Control how your artisan storefront appears on Google, WhatsApp, Instagram, and X search results.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          type="submit"
          disabled={saving}
          className="bg-primary text-white hover:bg-primary/90 shadow-sm"
        >
          {saving ? "Saving..." : "Save SEO Metadata"}
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Form Inputs */}
        <div className="space-y-6">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-caption font-bold uppercase tracking-wider text-ink">Meta Title Tag</label>
              <span className={`text-caption ${previewTitle.length > 60 ? "text-warning" : "text-ink-muted"}`}>
                {previewTitle.length}/60 chars
              </span>
            </div>
            <input
              type="text"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              placeholder="e.g. Varanasi Heritage Silks | Authentic Handloom Mulberry Silk"
              className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-body text-ink focus:border-primary focus:outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-caption font-bold uppercase tracking-wider text-ink">Meta Description</label>
              <span className={`text-caption ${previewDesc.length > 160 ? "text-warning" : "text-ink-muted"}`}>
                {previewDesc.length}/160 chars
              </span>
            </div>
            <textarea
              rows={3}
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              placeholder="Shop handwoven pure Banarasi silk sarees and traditional weaves crafted by generational artisan families..."
              className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-body text-ink focus:border-primary focus:outline-hidden resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-caption font-bold uppercase tracking-wider text-ink">Keywords (Comma Separated)</label>
            <input
              type="text"
              value={seoKeywords}
              onChange={(e) => setSeoKeywords(e.target.value)}
              placeholder="Banarasi silk, Mulberry silk, handloom saree, Varanasi weavers"
              className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-body text-ink focus:border-primary focus:outline-hidden"
            />
          </div>

          {/* Social Share Image */}
          <div className="space-y-2 pt-2">
            <label className="text-caption font-bold uppercase tracking-wider text-ink">
              Open Graph Image (1200 x 630 px)
            </label>
            <div className="flex items-center gap-4 p-4 rounded-xl border border-dashed border-line bg-surface-muted/50">
              {ogImageUrl ? (
                <img
                  src={ogImageUrl}
                  alt="OG Preview"
                  className="w-24 h-14 rounded-lg object-cover border border-line shrink-0"
                />
              ) : (
                <div className="w-24 h-14 rounded-lg bg-canvas-deep flex items-center justify-center text-ink-muted border border-line shrink-0">
                  <Share2 className="size-5" />
                </div>
              )}
              <div className="space-y-1">
                <p className="text-caption text-ink-soft">Shared on WhatsApp, iMessage, LinkedIn, and Facebook.</p>
                <label className="inline-flex items-center gap-2 px-3 py-1 rounded-lg border border-line bg-surface text-caption font-semibold text-ink hover:bg-surface-raised cursor-pointer">
                  <UploadCloud className="size-3.5 text-primary" />
                  <span>{uploadingOg ? "Uploading..." : "Upload R2 Social Banner"}</span>
                  <input type="file" accept="image/*" onChange={handleOgUpload} className="hidden" />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Live Previews */}
        <div className="space-y-6">
          {/* Google Search Snippet Preview */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-caption font-bold uppercase tracking-wider text-ink-muted">
              <Search className="size-4 text-primary" />
              <span>Google Search Snippet Preview</span>
            </div>
            <div className="rounded-2xl border border-line bg-surface p-5 space-y-1.5 shadow-xs">
              <div className="flex items-center gap-2 text-caption font-mono text-ink-muted">
                <Globe className="size-3 text-success" />
                <span>https://bhagya.in › store › {config.storeName.toLowerCase().replace(/\s+/g, "-")}</span>
              </div>
              <h4 className="text-body font-semibold text-primary hover:underline cursor-pointer">
                {previewTitle}
              </h4>
              <p className="text-caption text-ink-soft leading-relaxed line-clamp-2">
                {previewDesc}
              </p>
            </div>
          </div>

          {/* Social Share Card Preview */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-caption font-bold uppercase tracking-wider text-ink-muted">
              <Share2 className="size-4 text-primary" />
              <span>Social Share Card Preview (Open Graph)</span>
            </div>
            <div className="rounded-2xl border border-line overflow-hidden shadow-xs bg-surface">
              {ogImageUrl ? (
                <img src={ogImageUrl} alt="Social Card" className="w-full h-36 object-cover" />
              ) : (
                <div className="w-full h-36 bg-canvas-deep flex items-center justify-center text-ink-muted">
                  <span className="text-caption">No custom banner uploaded (default fallback)</span>
                </div>
              )}
              <div className="p-4 space-y-1 border-t border-line">
                <span className="text-caption font-mono uppercase text-ink-muted">BHAGYA.IN</span>
                <p className="font-bold text-body-sm text-ink truncate">{ogTitle || previewTitle}</p>
                <p className="text-caption text-ink-soft line-clamp-1">{ogDescription || previewDesc}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
