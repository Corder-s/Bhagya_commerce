"use client";

import {
  ArrowDown,
  ArrowUp,
  Check,
  Edit2,
  Eye,
  EyeOff,
  GripVertical,
  Layers,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/lib/toast";
import type {
  SectionType,
  StorefrontSection,
} from "@/services/storefront.service";

const SECTION_TYPE_DETAILS: Record<
  SectionType,
  { label: string; desc: string; icon: string; defaultTitle: string }
> = {
  HERO: {
    label: "Hero Showcase",
    desc: "Large full-width visual banner with headline, artisan badge, and direct call-to-actions",
    icon: "🌟",
    defaultTitle: "Generational Mulberry Silk, Direct from Varanasi Looms",
  },
  FEATURED_PRODUCTS: {
    label: "Featured Products",
    desc: "Highlight curated artisan handlooms and limited pit-loom pieces",
    icon: "🧵",
    defaultTitle: "Curated Masterpiece Weaves",
  },
  FEATURED_CATEGORIES: {
    label: "Featured Categories",
    desc: "Visual category pills and cards guiding customers through product groups",
    icon: "🗂️",
    defaultTitle: "Explore by Traditional Craft",
  },
  COLLECTIONS: {
    label: "Artisan Collections",
    desc: "Grouped thematic collections (e.g. Bridal Heirlooms, Daily Khadi)",
    icon: "🏺",
    defaultTitle: "Curated Artisan Guild Collections",
  },
  PRODUCT_GRID: {
    label: "Comprehensive Product Grid",
    desc: "Display responsive catalog grid with live filters and sorting",
    icon: "📦",
    defaultTitle: "All Artisanal Creations",
  },
  BANNER: {
    label: "Promotional Banner",
    desc: "Full-width accent banner for seasonal drops or festive craft releases",
    icon: "🏷️",
    defaultTitle: "Festive Pit-Loom Brocade Harvest",
  },
  BRAND_STORY: {
    label: "Artisan Story & Heritage",
    desc: "Personal story of the master weaver, origin village, and generational legacy",
    icon: "📖",
    defaultTitle: "Four Generations of Heritage Silk Artistry",
  },
  TESTIMONIALS: {
    label: "Customer Connoisseur Reviews",
    desc: "Verified purchase feedback, star ratings, and community acclaim",
    icon: "💬",
    defaultTitle: "Connoisseur Reviews & Appraisals",
  },
  ANNOUNCEMENT: {
    label: "Announcement Bar",
    desc: "Top notification ribbon for free pan-India shipping or loom updates",
    icon: "📢",
    defaultTitle: "Complimentary Insured Shipping Across India on Orders Above ₹2,999",
  },
  TEXT: {
    label: "Editorial Text Block",
    desc: "Rich statement or cultural manifesto on conscious craft preservation",
    icon: "✍️",
    defaultTitle: "Preserving Ancient Handloom Traditions",
  },
  CTA: {
    label: "Call to Action",
    desc: "High-impact card inviting custom bridal weaving or studio visits",
    icon: "🎯",
    defaultTitle: "Commission a Bespoke Bridal Heirlooms",
  },
  NEWSLETTER: {
    label: "Artisan Guild Newsletter",
    desc: "Email signup form for small-batch harvest drops and loom dispatches",
    icon: "📬",
    defaultTitle: "Dispatches from the Varanasi Looms",
  },
};

interface SectionsTabProps {
  sections: StorefrontSection[];
  onAddSection: (section: Omit<StorefrontSection, "id" | "storeId" | "position">) => Promise<void>;
  onUpdateSection: (id: string, data: Partial<StorefrontSection>) => Promise<void>;
  onDeleteSection: (id: string) => Promise<void>;
  onReorderSections: (orderedIds: string[]) => Promise<void>;
}

export function SectionsTab({
  sections,
  onAddSection,
  onUpdateSection,
  onDeleteSection,
  onReorderSections,
}: SectionsTabProps) {
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [editingSection, setEditingSection] = React.useState<StorefrontSection | null>(null);

  async function handleMove(index: number, direction: "up" | "down") {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const newSections = [...sections];
    const [moved] = newSections.splice(index, 1);
    newSections.splice(targetIndex, 0, moved);

    await onReorderSections(newSections.map((s) => s.id));
    toast.success("Sections Reordered", "Homepage section order updated.");
  }

  async function handleToggle(section: StorefrontSection) {
    await onUpdateSection(section.id, { enabled: !section.enabled });
    toast.success(
      section.enabled ? "Section Hidden" : "Section Enabled",
      `${section.title} is now ${section.enabled ? "hidden from" : "visible on"} your live storefront.`
    );
  }

  async function handleDelete(section: StorefrontSection) {
    if (confirm(`Are you sure you want to remove the "${section.title}" section?`)) {
      await onDeleteSection(section.id);
      toast.success("Section Removed", "Section was deleted from draft layout.");
    }
  }

  return (
    <div className="space-y-6">
      {/* ── Section Header ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <h2 className="font-display text-xl font-bold text-ink">Homepage Layout Builder</h2>
          <p className="text-body-sm text-ink-soft">
            Organize the visual hierarchy of your public storefront with real database-backed sections.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsAddModalOpen(true)}
          className="gap-2 bg-primary text-white hover:bg-primary/90 shadow-sm shrink-0"
        >
          <Plus className="size-4" />
          <span>Add Section</span>
        </Button>
      </div>

      {/* ── Section Reorder List ──────────────────────────────────────── */}
      <div className="space-y-3">
        {sections.map((section, idx) => {
          const meta = SECTION_TYPE_DETAILS[section.sectionType] || {
            label: section.sectionType,
            desc: "",
            icon: "📄",
          };

          return (
            <Card
              key={section.id}
              variant="surface"
              padding="sm"
              radius="lg"
              className={`border-line transition-all flex items-center justify-between gap-4 ${
                !section.enabled ? "opacity-60 bg-surface-muted" : "bg-surface shadow-xs"
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="text-ink-muted cursor-grab" title="Drag position">
                  <GripVertical className="size-5" />
                </div>

                <div className="size-10 rounded-xl bg-canvas-deep flex items-center justify-center text-lg shrink-0">
                  {meta.icon}
                </div>

                <div className="min-w-0 space-y-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-body text-ink truncate">{section.title}</span>
                    <span className="rounded-pill bg-canvas-deep px-2 py-0.5 text-caption font-medium text-ink-soft">
                      {meta.label}
                    </span>
                    {!section.enabled && (
                      <span className="rounded-pill bg-warning/15 px-2 py-0.5 text-caption font-bold text-warning">
                        Hidden
                      </span>
                    )}
                  </div>
                  {section.subtitle && (
                    <p className="text-caption text-ink-muted truncate max-w-lg">{section.subtitle}</p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={idx === 0}
                  onClick={() => handleMove(idx, "up")}
                  className="size-8 p-0 text-ink-soft hover:text-ink"
                  title="Move Up"
                >
                  <ArrowUp className="size-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  disabled={idx === sections.length - 1}
                  onClick={() => handleMove(idx, "down")}
                  className="size-8 p-0 text-ink-soft hover:text-ink"
                  title="Move Down"
                >
                  <ArrowDown className="size-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggle(section)}
                  className={`size-8 p-0 ${section.enabled ? "text-ink-soft hover:text-ink" : "text-warning"}`}
                  title={section.enabled ? "Hide Section" : "Show Section"}
                >
                  {section.enabled ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingSection(section)}
                  className="size-8 p-0 text-ink-soft hover:text-ink"
                  title="Edit Section Details"
                >
                  <Edit2 className="size-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(section)}
                  className="size-8 p-0 text-danger hover:bg-danger/10"
                  title="Delete Section"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </Card>
          );
        })}

        {sections.length === 0 && (
          <div className="rounded-2xl border border-dashed border-line p-12 text-center space-y-4">
            <div className="mx-auto size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Layers className="size-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-display text-lg font-bold text-ink">No Sections Added</h3>
              <p className="text-body-sm text-ink-soft max-w-sm mx-auto">
                Build your homepage layout by adding hero banners, product showcases, and weaver stories.
              </p>
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsAddModalOpen(true)}
              className="gap-2 bg-primary text-white"
            >
              <Plus className="size-4" />
              <span>Add Your First Section</span>
            </Button>
          </div>
        )}
      </div>

      {/* ── Add Section Modal ─────────────────────────────────────────── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-3xl rounded-2xl border border-line bg-surface p-6 shadow-2xl space-y-5 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div>
                <h3 className="font-display text-xl font-bold text-ink">Select Section Type</h3>
                <p className="text-body-sm text-ink-soft">
                  Choose from 12 pre-crafted artisan commerce building blocks
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAddModalOpen(false)}
                className="size-8 p-0 text-ink-soft hover:text-ink"
              >
                <X className="size-4" />
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {(Object.keys(SECTION_TYPE_DETAILS) as SectionType[]).map((type) => {
                const info = SECTION_TYPE_DETAILS[type];
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={async () => {
                      setIsAddModalOpen(false);
                      await onAddSection({
                        sectionType: type,
                        title: info.defaultTitle,
                        subtitle: info.desc,
                        contentConfig: {},
                        enabled: true,
                      });
                      toast.success("Section Added", `Added ${info.label} to your draft layout.`);
                    }}
                    className="flex flex-col text-left p-4 rounded-xl border border-line bg-surface hover:border-primary hover:bg-primary/5 transition-all space-y-2 group"
                  >
                    <span className="text-2xl">{info.icon}</span>
                    <span className="font-bold text-body text-ink group-hover:text-primary transition-colors">
                      {info.label}
                    </span>
                    <span className="text-caption text-ink-muted leading-relaxed">{info.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Section Modal ────────────────────────────────────────── */}
      {editingSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-2xl border border-line bg-surface p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div>
                <h3 className="font-display text-xl font-bold text-ink">Edit Section</h3>
                <p className="text-caption text-ink-soft">
                  Type: {SECTION_TYPE_DETAILS[editingSection.sectionType]?.label}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingSection(null)}
                className="size-8 p-0 text-ink-soft hover:text-ink"
              >
                <X className="size-4" />
              </Button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const title = (form.elements.namedItem("title") as HTMLInputElement).value;
                const subtitle = (form.elements.namedItem("subtitle") as HTMLInputElement).value;

                await onUpdateSection(editingSection.id, {
                  title,
                  subtitle,
                });
                setEditingSection(null);
                toast.success("Section Updated", "Section configuration saved in draft.");
              }}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <label className="text-caption font-bold uppercase tracking-wider text-ink">Section Title</label>
                <input
                  name="title"
                  defaultValue={editingSection.title}
                  required
                  className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-body text-ink focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-caption font-bold uppercase tracking-wider text-ink">Subtitle / Caption</label>
                <input
                  name="subtitle"
                  defaultValue={editingSection.subtitle || ""}
                  className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-body text-ink focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-line">
                <Button variant="outline" type="button" onClick={() => setEditingSection(null)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" className="bg-primary text-white hover:bg-primary/90">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
