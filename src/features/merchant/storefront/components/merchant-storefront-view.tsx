"use client";

import {
  CheckCircle2,
  Clock,
  Eye,
  Globe,
  Layers,
  LayoutTemplate,
  Loader2,
  Menu,
  Palette,
  Send,
  Sparkles,
  Store,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { BrandingTab } from "@/features/merchant/storefront/components/branding-tab";
import { DomainsTab } from "@/features/merchant/storefront/components/domains-tab";
import { IdentityTab } from "@/features/merchant/storefront/components/identity-tab";
import { NavigationTab } from "@/features/merchant/storefront/components/navigation-tab";
import { OverviewTab } from "@/features/merchant/storefront/components/overview-tab";
import { SectionsTab } from "@/features/merchant/storefront/components/sections-tab";
import { SeoTab } from "@/features/merchant/storefront/components/seo-tab";
import { trackEvent } from "@/lib/analytics/tracker";
import { toast } from "@/lib/toast";
import {
  type DomainVerificationResult,
  type StoreDomain,
  type StorefrontConfiguration,
  type StorefrontSection,
  storefrontService,
} from "@/services/storefront.service";

type TabId = "overview" | "sections" | "branding" | "identity" | "navigation" | "seo" | "domains";

export function MerchantStorefrontView() {
  const [activeTab, setActiveTab] = React.useState<TabId>("overview");
  const [config, setConfig] = React.useState<StorefrontConfiguration | null>(null);
  const [sections, setSections] = React.useState<StorefrontSection[]>([]);
  const [domains, setDomains] = React.useState<StoreDomain[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [publishing, setPublishing] = React.useState(false);

  const loadData = React.useCallback(async () => {
    try {
      const [cfg, sec, dom] = await Promise.all([
        storefrontService.getConfiguration(),
        storefrontService.getSections(true),
        storefrontService.getDomains(),
      ]);
      setConfig(cfg);
      setSections(sec);
      setDomains(dom);
    } catch {
      toast.error("Error Loading Storefront", "Failed to retrieve storefront settings.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleUpdateConfig(data: Partial<StorefrontConfiguration>) {
    const updated = await storefrontService.updateConfiguration(data);
    setConfig(updated);
  }

  async function handleAddSection(sec: Omit<StorefrontSection, "id" | "storeId" | "position">) {
    const added = await storefrontService.addSection(sec);
    setSections([...sections, added]);
  }

  async function handleUpdateSection(id: string, data: Partial<StorefrontSection>) {
    const updated = await storefrontService.updateSection(id, data);
    setSections(sections.map((s) => (s.id === id ? updated : s)));
  }

  async function handleDeleteSection(id: string) {
    await storefrontService.deleteSection(id);
    setSections(sections.filter((s) => s.id !== id));
  }

  async function handleReorderSections(orderedIds: string[]) {
    const reordered = await storefrontService.reorderSections(orderedIds);
    setSections(reordered);
  }

  async function handleAddDomain(domain: string) {
    const d = await storefrontService.addDomain(domain);
    setDomains([...domains, d]);
  }

  async function handleVerifyDomain(id: string): Promise<DomainVerificationResult> {
    const res = await storefrontService.verifyDomain(id);
    setDomains(domains.map((d) => (d.id === id ? { ...d, status: res.status, sslStatus: "ACTIVE" } : d)));
    return res;
  }

  async function handleActivateDomain(id: string) {
    const activated = await storefrontService.activateDomain(id);
    setDomains(domains.map((d) => (d.id === id ? activated : d)));
  }

  async function handleSetPrimaryDomain(id: string) {
    const primary = await storefrontService.setPrimaryDomain(id);
    setDomains(domains.map((d) => ({ ...d, isPrimary: d.id === id })));
  }

  async function handleDisableDomain(id: string) {
    const disabled = await storefrontService.disableDomain(id);
    setDomains(domains.map((d) => (d.id === id ? disabled : d)));
  }

  async function handleDeleteDomain(id: string) {
    await storefrontService.deleteDomain(id);
    setDomains(domains.filter((d) => d.id !== id));
  }

  async function handlePublish() {
    setPublishing(true);
    try {
      const res = await storefrontService.publish();
      await trackEvent("STOREFRONT_PUBLISHED", {
        storeId: config?.storeId,
        properties: { version: res.publishedVersion },
      });
      if (config) {
        setConfig({ ...config, publishedVersion: res.publishedVersion });
      }
      toast.success("Storefront Published!", res.message);
    } catch {
      toast.error("Publishing Failed", "Could not publish storefront draft.");
    } finally {
      setPublishing(false);
    }
  }

  function handlePreview() {
    window.open("/store/varanasi-heritage-silks?preview=true", "_blank");
  }

  if (loading || !config) {
    return (
      <div className="flex min-h-[400px] items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-body-sm text-ink-soft">Loading storefront builder...</p>
        </div>
      </div>
    );
  }

  interface TabItem {
    id: TabId;
    label: string;
    icon: any;
    badge?: number;
  }

  const TABS: TabItem[] = [
    { id: "overview", label: "Overview", icon: LayoutTemplate },
    { id: "sections", label: "Homepage Sections", icon: Layers, badge: sections.length },
    { id: "branding", label: "Branding & Colors", icon: Palette },
    { id: "identity", label: "Store Identity", icon: Store },
    { id: "navigation", label: "Navigation Menu", icon: Menu },
    { id: "seo", label: "SEO & Social", icon: Sparkles },
    { id: "domains", label: "Custom Domains", icon: Globe, badge: domains.length },
  ];

  return (
    <div className="space-y-6">
      {/* ── Top Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="font-display text-2xl font-bold text-ink">Storefront Builder</span>
            <span className="inline-flex items-center gap-1 rounded-pill bg-primary/10 px-2.5 py-0.5 text-caption font-bold text-primary">
              Draft v{config.publishedVersion + 1}
            </span>
          </div>
          <p className="text-body-sm text-ink-soft">
            Design, curate, preview, and publish your artisanal brand store with custom domain routing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="md" onClick={handlePreview} className="gap-2 border-line">
            <Eye className="size-4 text-ink-soft" />
            <span>Preview Draft</span>
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={handlePublish}
            disabled={publishing}
            className="gap-2 bg-primary text-white hover:bg-primary/90 shadow-sm"
          >
            {publishing ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            <span>{publishing ? "Publishing..." : "Publish to Live"}</span>
          </Button>
        </div>
      </div>

      {/* ── Tabs Bar ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-line pb-2 scrollbar-none">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as TabId)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-body-sm font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? "bg-primary text-white shadow-xs"
                  : "text-ink-soft hover:text-ink hover:bg-surface-raised"
              }`}
            >
              <Icon className="size-4" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`rounded-full px-1.5 py-0.2 text-xs font-bold ${
                    isActive ? "bg-white/20 text-white" : "bg-canvas-deep text-ink-muted"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Active Tab Panel ─────────────────────────────────────────── */}
      <div className="pt-2">
        {activeTab === "overview" && (
          <OverviewTab
            config={config}
            sections={sections}
            domains={domains}
            onPreview={handlePreview}
            onPublish={handlePublish}
            publishing={publishing}
            onNavigateTab={(tab) => setActiveTab(tab as TabId)}
          />
        )}

        {activeTab === "sections" && (
          <SectionsTab
            sections={sections}
            onAddSection={handleAddSection}
            onUpdateSection={handleUpdateSection}
            onDeleteSection={handleDeleteSection}
            onReorderSections={handleReorderSections}
          />
        )}

        {activeTab === "branding" && (
          <BrandingTab config={config} onUpdate={handleUpdateConfig} />
        )}

        {activeTab === "identity" && (
          <IdentityTab config={config} onUpdate={handleUpdateConfig} />
        )}

        {activeTab === "navigation" && (
          <NavigationTab config={config} onUpdate={handleUpdateConfig} />
        )}

        {activeTab === "seo" && (
          <SeoTab config={config} onUpdate={handleUpdateConfig} />
        )}

        {activeTab === "domains" && (
          <DomainsTab
            domains={domains}
            onAddDomain={handleAddDomain}
            onVerifyDomain={handleVerifyDomain}
            onActivateDomain={handleActivateDomain}
            onSetPrimaryDomain={handleSetPrimaryDomain}
            onDisableDomain={handleDisableDomain}
            onDeleteDomain={handleDeleteDomain}
          />
        )}
      </div>
    </div>
  );
}
