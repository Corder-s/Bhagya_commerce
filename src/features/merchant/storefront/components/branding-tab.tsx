"use client";

import { Check, Sparkles } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/lib/toast";
import type { StorefrontConfiguration } from "@/services/storefront.service";

interface BrandingTabProps {
  config: StorefrontConfiguration;
  onUpdate: (data: Partial<StorefrontConfiguration>) => Promise<void>;
}

const PRESET_PALETTES = [
  {
    name: "Varanasi Forest & Amber",
    primary: "#2D5A43",
    secondary: "#4A7C59",
    accent: "#D97706",
  },
  {
    name: "Jaipur Terracotta & Sage",
    primary: "#9E4733",
    secondary: "#6F8B74",
    accent: "#E29578",
  },
  {
    name: "Kashmir Walnut & Saffron",
    primary: "#3D312A",
    secondary: "#8C6D58",
    accent: "#E08D3C",
  },
  {
    name: "Chettinad Indigo & Brass",
    primary: "#1F3A52",
    secondary: "#476C8A",
    accent: "#D4AF37",
  },
];

const TYPOGRAPHY_OPTIONS = [
  { name: "Outfit", desc: "Clean geometric sans-serif with contemporary artisan warmth" },
  { name: "Plus Jakarta Sans", desc: "Modern neo-grotesque font engineered for high readability" },
  { name: "Cinzel Decorative", desc: "Regal classic serif evoking ancient temple inscriptions" },
  { name: "Playfair Display", desc: "High-contrast editorial serif for luxury handloom ateliers" },
  { name: "Inter", desc: "Precision utilitarian typeface for seamless commerce scanning" },
];

export function BrandingTab({ config, onUpdate }: BrandingTabProps) {
  const [primary, setPrimary] = React.useState(config.primaryColor);
  const [secondary, setSecondary] = React.useState(config.secondaryColor);
  const [accent, setAccent] = React.useState(config.accentColor);
  const [typography, setTypography] = React.useState(config.typography);
  const [buttonStyle, setButtonStyle] = React.useState(config.buttonStyle);
  const [cardStyle, setCardStyle] = React.useState(config.cardStyle);
  const [borderRadius, setBorderRadius] = React.useState(config.borderRadius);
  const [saving, setSaving] = React.useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await onUpdate({
        primaryColor: primary,
        secondaryColor: secondary,
        accentColor: accent,
        typography,
        buttonStyle,
        cardStyle,
        borderRadius,
      });
      toast.success("Branding Saved", "Design tokens and theme settings updated in draft.");
    } catch (e: any) {
      toast.error("Save Failed", e.message || "Could not update branding.");
    } finally {
      setSaving(false);
    }
  }

  function applyPreset(p: (typeof PRESET_PALETTES)[0]) {
    setPrimary(p.primary);
    setSecondary(p.secondary);
    setAccent(p.accent);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <h2 className="font-display text-xl font-bold text-ink">Storefront Branding & Design System</h2>
          <p className="text-body-sm text-ink-soft">
            Control your digital storefront's palette, typography, button shapes, and card aesthetics.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleSave}
          disabled={saving}
          className="bg-primary text-white hover:bg-primary/90 shadow-sm"
        >
          {saving ? "Saving..." : "Save Branding"}
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left 2 Cols: Form Controls */}
        <div className="lg:col-span-2 space-y-8">
          {/* Preset Palettes */}
          <div className="space-y-3">
            <span className="text-caption font-bold uppercase tracking-wider text-ink-muted">
              Curated Artisan Palettes
            </span>
            <div className="grid gap-3 sm:grid-cols-2">
              {PRESET_PALETTES.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-line bg-surface hover:border-primary transition-all text-left group"
                >
                  <span className="font-medium text-body-sm text-ink group-hover:text-primary">{preset.name}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="size-4 rounded-full border border-black/10" style={{ backgroundColor: preset.primary }} />
                    <span className="size-4 rounded-full border border-black/10" style={{ backgroundColor: preset.secondary }} />
                    <span className="size-4 rounded-full border border-black/10" style={{ backgroundColor: preset.accent }} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Color Pickers */}
          <div className="space-y-4">
            <span className="text-caption font-bold uppercase tracking-wider text-ink-muted">Custom Hex Codes</span>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <label className="text-caption font-semibold text-ink">Primary Color</label>
                <div className="flex items-center gap-2 rounded-xl border border-line bg-surface p-1.5">
                  <input
                    type="color"
                    value={primary}
                    onChange={(e) => setPrimary(e.target.value)}
                    className="size-8 rounded-lg border-0 cursor-pointer p-0"
                  />
                  <input
                    type="text"
                    value={primary}
                    onChange={(e) => setPrimary(e.target.value)}
                    className="font-mono text-body-sm uppercase text-ink w-full bg-transparent focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-caption font-semibold text-ink">Secondary Color</label>
                <div className="flex items-center gap-2 rounded-xl border border-line bg-surface p-1.5">
                  <input
                    type="color"
                    value={secondary}
                    onChange={(e) => setSecondary(e.target.value)}
                    className="size-8 rounded-lg border-0 cursor-pointer p-0"
                  />
                  <input
                    type="text"
                    value={secondary}
                    onChange={(e) => setSecondary(e.target.value)}
                    className="font-mono text-body-sm uppercase text-ink w-full bg-transparent focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-caption font-semibold text-ink">Accent Color</label>
                <div className="flex items-center gap-2 rounded-xl border border-line bg-surface p-1.5">
                  <input
                    type="color"
                    value={accent}
                    onChange={(e) => setAccent(e.target.value)}
                    className="size-8 rounded-lg border-0 cursor-pointer p-0"
                  />
                  <input
                    type="text"
                    value={accent}
                    onChange={(e) => setAccent(e.target.value)}
                    className="font-mono text-body-sm uppercase text-ink w-full bg-transparent focus:outline-hidden"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Typography */}
          <div className="space-y-3">
            <span className="text-caption font-bold uppercase tracking-wider text-ink-muted">Typography Selection</span>
            <div className="space-y-2">
              {TYPOGRAPHY_OPTIONS.map((font) => (
                <label
                  key={font.name}
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    typography === font.name
                      ? "border-primary bg-primary/5 shadow-xs"
                      : "border-line bg-surface hover:bg-surface-raised"
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="font-display text-body font-bold text-ink">{font.name}</span>
                    <p className="text-caption text-ink-muted">{font.desc}</p>
                  </div>
                  <input
                    type="radio"
                    name="typography"
                    value={font.name}
                    checked={typography === font.name}
                    onChange={(e) => setTypography(e.target.value)}
                    className="size-4 text-primary focus:ring-primary"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Component Styles */}
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="space-y-2">
              <label className="text-caption font-bold uppercase tracking-wider text-ink-muted">Button Style</label>
              <select
                value={buttonStyle}
                onChange={(e) => setButtonStyle(e.target.value as any)}
                className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-body-sm text-ink focus:border-primary focus:outline-hidden"
              >
                <option value="rounded">Rounded Corners (8px)</option>
                <option value="pill">Pill Shape (Full Rounded)</option>
                <option value="square">Architectural Square (0px)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-caption font-bold uppercase tracking-wider text-ink-muted">Card Surface</label>
              <select
                value={cardStyle}
                onChange={(e) => setCardStyle(e.target.value as any)}
                className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-body-sm text-ink focus:border-primary focus:outline-hidden"
              >
                <option value="surface">Surface with Soft Border</option>
                <option value="raised">Raised with Elevation</option>
                <option value="flat">Minimal Flat</option>
                <option value="bordered">Crisp High-Contrast Border</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-caption font-bold uppercase tracking-wider text-ink-muted">Border Radius</label>
              <select
                value={borderRadius}
                onChange={(e) => setBorderRadius(e.target.value as any)}
                className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-body-sm text-ink focus:border-primary focus:outline-hidden"
              >
                <option value="none">None (0px)</option>
                <option value="sm">Small (6px)</option>
                <option value="md">Medium (12px)</option>
                <option value="lg">Large (16px)</option>
                <option value="full">Maximum Full</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Live Interactive Style Preview */}
        <div className="space-y-4">
          <span className="text-caption font-bold uppercase tracking-wider text-ink-muted">Live Component Preview</span>
          <div
            className="rounded-2xl border border-line p-6 space-y-6 shadow-sm sticky top-6 bg-surface"
            style={{
              fontFamily: typography,
            }}
          >
            <div className="space-y-2">
              <span
                className="inline-block px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white"
                style={{
                  backgroundColor: accent,
                  borderRadius: borderRadius === "full" ? "9999px" : borderRadius === "none" ? "0px" : "8px",
                }}
              >
                GI Certified Origin
              </span>
              <h3 className="text-xl font-bold text-ink" style={{ color: primary }}>
                Pure Banarasi Kadhwa Silk
              </h3>
              <p className="text-caption text-ink-soft">
                Preview how your primary, secondary, and accent colors harmonize across customer storefront surfaces.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="px-4 py-2 font-bold text-sm text-white shadow-xs"
                style={{
                  backgroundColor: primary,
                  borderRadius: buttonStyle === "pill" ? "9999px" : buttonStyle === "square" ? "0px" : "8px",
                }}
              >
                Add to Cart • ₹12,500
              </button>

              <button
                type="button"
                className="px-4 py-2 font-semibold text-sm border"
                style={{
                  borderColor: secondary,
                  color: secondary,
                  borderRadius: buttonStyle === "pill" ? "9999px" : buttonStyle === "square" ? "0px" : "8px",
                }}
              >
                View Details
              </button>
            </div>

            <div
              className="p-4 border rounded-xl space-y-2"
              style={{
                backgroundColor: cardStyle === "flat" ? "transparent" : undefined,
                borderColor: secondary + "33",
              }}
            >
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full" style={{ backgroundColor: accent }} />
                <span className="text-xs font-bold text-ink">Weaver Artisan Guarantee</span>
              </div>
              <p className="text-xs text-ink-muted leading-relaxed">
                Direct bank payout to master craftsperson. 100% natural mulberry silk authenticated by Silk Mark.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
