"use client";

import { Check, Globe, Image as ImageIcon, Loader2, UploadCloud } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/lib/toast";
import { objectStorageService } from "@/services/object-storage.service";
import type { StorefrontConfiguration } from "@/services/storefront.service";

interface IdentityTabProps {
  config: StorefrontConfiguration;
  onUpdate: (data: Partial<StorefrontConfiguration>) => Promise<void>;
}

export function IdentityTab({ config, onUpdate }: IdentityTabProps) {
  const [storeName, setStoreName] = React.useState(config.storeName);
  const [tagline, setTagline] = React.useState(config.tagline || "");
  const [description, setDescription] = React.useState(config.description || "");
  const [contactEmail, setContactEmail] = React.useState(config.contactEmail || "");
  const [contactPhone, setContactPhone] = React.useState(config.contactPhone || "");
  const [logoUrl, setLogoUrl] = React.useState(config.logoUrl || "");
  const [faviconUrl, setFaviconUrl] = React.useState(config.faviconUrl || "");

  const [instagram, setInstagram] = React.useState(config.socialLinks?.instagram || "");
  const [facebook, setFacebook] = React.useState(config.socialLinks?.facebook || "");
  const [youtube, setYoutube] = React.useState(config.socialLinks?.youtube || "");

  const [uploadingLogo, setUploadingLogo] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    try {
      const res = await objectStorageService.uploadAsset(file, { folder: "logos" });
      setLogoUrl(res.url);
      toast.success("Logo Uploaded", "Storefront logo uploaded to Cloudflare R2.");
    } catch (err: any) {
      toast.error("Upload Failed", err.message || "Could not upload image to R2 vault.");
    } finally {
      setUploadingLogo(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await onUpdate({
        storeName,
        tagline,
        description,
        contactEmail,
        contactPhone,
        logoUrl,
        faviconUrl,
        socialLinks: {
          instagram,
          facebook,
          youtube,
        },
      });
      toast.success("Identity Saved", "Storefront identity and contact details saved in draft.");
    } catch (err: any) {
      toast.error("Save Failed", err.message || "Could not save identity changes.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <h2 className="font-display text-xl font-bold text-ink">Storefront Identity & Media</h2>
          <p className="text-body-sm text-ink-soft">
            Manage your store's public name, tagline, artisan story, logo, and verified contact links.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          type="submit"
          disabled={saving}
          className="bg-primary text-white hover:bg-primary/90 shadow-sm"
        >
          {saving ? "Saving..." : "Save Identity"}
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left Col: Basic Identity */}
        <div className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-caption font-bold uppercase tracking-wider text-ink">Store Name</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              required
              className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-body text-ink focus:border-primary focus:outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-caption font-bold uppercase tracking-wider text-ink">Tagline</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Pure Mulberry Handloom Silks Woven on Centuries-Old Pit Looms"
              className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-body text-ink focus:border-primary focus:outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-caption font-bold uppercase tracking-wider text-ink">Artisan Story / Bio</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell customers about your ancestral craft, weaving traditions, and workshop location..."
              className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-body text-ink focus:border-primary focus:outline-hidden resize-none"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-caption font-bold uppercase tracking-wider text-ink">Contact Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-body text-ink focus:border-primary focus:outline-hidden"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-caption font-bold uppercase tracking-wider text-ink">Contact Phone</label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-body text-ink focus:border-primary focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Right Col: Media & Socials */}
        <div className="space-y-6">
          {/* Logo Upload via Cloudflare R2 */}
          <div className="space-y-2">
            <label className="text-caption font-bold uppercase tracking-wider text-ink">Store Logo (R2 Vault)</label>
            <div className="flex items-center gap-4 p-4 rounded-xl border border-dashed border-line bg-surface-muted/50">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt="Store Logo"
                  className="size-16 rounded-xl object-cover border border-line shadow-xs shrink-0"
                />
              ) : (
                <div className="size-16 rounded-xl bg-canvas-deep flex items-center justify-center text-ink-muted border border-line shrink-0">
                  <ImageIcon className="size-6" />
                </div>
              )}

              <div className="space-y-2">
                <p className="text-caption text-ink-soft">
                  Upload a high-resolution SVG, PNG, or JPG mark for your storefront header.
                </p>
                <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-line bg-surface text-caption font-semibold text-ink hover:bg-surface-raised cursor-pointer">
                  {uploadingLogo ? (
                    <Loader2 className="size-4 animate-spin text-primary" />
                  ) : (
                    <UploadCloud className="size-4 text-primary" />
                  )}
                  <span>{uploadingLogo ? "Uploading..." : "Browse R2 File"}</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-3 pt-2">
            <span className="text-caption font-bold uppercase tracking-wider text-ink-muted">Social Channels</span>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-24 text-caption font-medium text-ink-soft">Instagram</span>
                <input
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="@varanasi.silks"
                  className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-body-sm text-ink focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="w-24 text-caption font-medium text-ink-soft">Facebook</span>
                <input
                  type="text"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  placeholder="varanasiheritagesilks"
                  className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-body-sm text-ink focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="w-24 text-caption font-medium text-ink-soft">YouTube</span>
                <input
                  type="text"
                  value={youtube}
                  onChange={(e) => setYoutube(e.target.value)}
                  placeholder="VaranasiWeavers"
                  className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-body-sm text-ink focus:border-primary focus:outline-hidden"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
