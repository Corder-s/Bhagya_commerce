"use client";

import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Eye,
  Globe,
  Layers,
  Palette,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type {
  StoreDomain,
  StorefrontConfiguration,
  StorefrontSection,
} from "@/services/storefront.service";

interface OverviewTabProps {
  config: StorefrontConfiguration;
  sections: StorefrontSection[];
  domains: StoreDomain[];
  onPreview: () => void;
  onPublish: () => void;
  publishing: boolean;
  onNavigateTab: (tabId: string) => void;
}

export function OverviewTab({
  config,
  sections,
  domains,
  onPreview,
  onPublish,
  publishing,
  onNavigateTab,
}: OverviewTabProps) {
  const primaryDomain = domains.find((d) => d.isPrimary && d.status === "ACTIVE")?.domain || "varanasi-silks.bhagya.in";
  const activeSectionsCount = sections.filter((s) => s.enabled).length;

  return (
    <div className="space-y-8">
      {/* ── Top Hero Status Card ────────────────────────────────────── */}
      <Card variant="surface" padding="none" radius="lg" className="border-line shadow-card overflow-hidden">
        <div className="border-b border-line bg-surface-raised p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-display text-2xl font-bold text-ink">{config.storeName}</span>
              <span className="inline-flex items-center gap-1 rounded-pill bg-success/15 px-3 py-1 text-caption font-bold text-success">
                <CheckCircle2 className="size-3.5" />
                Live Version {config.publishedVersion}
              </span>
            </div>
            <p className="text-body-sm text-ink-soft max-w-xl">
              {config.tagline || "Artisanal direct-from-weaver storefront powered by Bhagya Commerce"}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-caption text-ink-muted pt-1">
              <span className="inline-flex items-center gap-1.5 font-mono text-ink">
                <Globe className="size-3.5 text-primary" />
                https://{primaryDomain}
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <Layers className="size-3.5 text-ink-soft" />
                {activeSectionsCount} Active Homepage Sections
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="md"
              onClick={onPreview}
              className="gap-2 border-line bg-surface hover:bg-surface-raised"
            >
              <Eye className="size-4 text-ink-soft" />
              <span>Preview Draft</span>
            </Button>

            <Button
              variant="primary"
              size="md"
              onClick={onPublish}
              disabled={publishing}
              className="gap-2 bg-primary text-white hover:bg-primary/90 shadow-sm"
            >
              <Send className="size-4" />
              <span>{publishing ? "Publishing..." : "Publish to Live"}</span>
            </Button>
          </div>
        </div>

        {/* Storefront metrics summary bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-line bg-surface">
          <div className="p-5 space-y-1">
            <span className="text-caption font-semibold uppercase tracking-wider text-ink-muted">Active Domain</span>
            <div className="flex items-center justify-between">
              <p className="font-mono text-body-sm font-semibold text-ink truncate">{primaryDomain}</p>
              <Link
                href={`/store/varanasi-heritage-silks`}
                target="_blank"
                className="text-primary hover:text-primary-dark"
                title="Open Live Storefront"
              >
                <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </div>

          <div className="p-5 space-y-1">
            <span className="text-caption font-semibold uppercase tracking-wider text-ink-muted">Typography</span>
            <p className="font-display text-body font-semibold text-ink">{config.typography}</p>
          </div>

          <div className="p-5 space-y-1">
            <span className="text-caption font-semibold uppercase tracking-wider text-ink-muted">Color Palette</span>
            <div className="flex items-center gap-2 pt-1">
              <span className="size-5 rounded-full border border-line shadow-xs" style={{ backgroundColor: config.primaryColor }} title="Primary" />
              <span className="size-5 rounded-full border border-line shadow-xs" style={{ backgroundColor: config.secondaryColor }} title="Secondary" />
              <span className="size-5 rounded-full border border-line shadow-xs" style={{ backgroundColor: config.accentColor }} title="Accent" />
              <span className="text-caption font-mono text-ink-soft ml-1">{config.primaryColor}</span>
            </div>
          </div>

          <div className="p-5 space-y-1">
            <span className="text-caption font-semibold uppercase tracking-wider text-ink-muted">SSL / Custom Domain</span>
            <div className="flex items-center gap-1.5 text-body-sm font-semibold text-success pt-0.5">
              <ShieldCheck className="size-4" />
              <span>Verified & Secured</span>
            </div>
          </div>
        </div>
      </Card>

      {/* ── Quick Customizer Hub Cards ─────────────────────────────── */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card
          variant="surface"
          padding="md"
          radius="lg"
          interactive
          onClick={() => onNavigateTab("sections")}
          className="space-y-3 cursor-pointer group"
        >
          <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
            <Layers className="size-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-display text-lg font-bold text-ink">Homepage Sections</h3>
            <p className="text-body-sm text-ink-soft">
              Reorder, configure, and curate Hero, Featured Weaves, Artisan Stories, and Testimonials.
            </p>
          </div>
          <div className="pt-2 flex items-center text-caption font-bold text-primary gap-1">
            <span>Manage {sections.length} Sections</span>
            <ArrowUpRight className="size-3.5" />
          </div>
        </Card>

        <Card
          variant="surface"
          padding="md"
          radius="lg"
          interactive
          onClick={() => onNavigateTab("branding")}
          className="space-y-3 cursor-pointer group"
        >
          <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
            <Palette className="size-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-display text-lg font-bold text-ink">Branding & Colors</h3>
            <p className="text-body-sm text-ink-soft">
              Customize artisanal HSL color tokens, typography scales, button shapes, and card aesthetics.
            </p>
          </div>
          <div className="pt-2 flex items-center text-caption font-bold text-primary gap-1">
            <span>Customize Palette</span>
            <ArrowUpRight className="size-3.5" />
          </div>
        </Card>

        <Card
          variant="surface"
          padding="md"
          radius="lg"
          interactive
          onClick={() => onNavigateTab("domains")}
          className="space-y-3 cursor-pointer group"
        >
          <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
            <Globe className="size-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-display text-lg font-bold text-ink">Custom Domains</h3>
            <p className="text-body-sm text-ink-soft">
              Connect your branded domain (e.g. yourbrand.com) with automated DNS challenge verification.
            </p>
          </div>
          <div className="pt-2 flex items-center text-caption font-bold text-primary gap-1">
            <span>{domains.length} Registered Domains</span>
            <ArrowUpRight className="size-3.5" />
          </div>
        </Card>
      </div>
    </div>
  );
}
