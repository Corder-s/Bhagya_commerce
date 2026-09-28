"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/lib/toast";
import type {
  StorefrontConfiguration,
  StorefrontNavItem,
} from "@/services/storefront.service";

interface NavigationTabProps {
  config: StorefrontConfiguration;
  onUpdate: (data: Partial<StorefrontConfiguration>) => Promise<void>;
}

export function NavigationTab({ config, onUpdate }: NavigationTabProps) {
  const [items, setItems] = React.useState<StorefrontNavItem[]>(config.navigationItems || []);
  const [saving, setSaving] = React.useState(false);

  function handleAdd() {
    const newItem: StorefrontNavItem = {
      label: "New Link",
      targetType: "CUSTOM",
      url: "/shop",
      position: items.length,
      enabled: true,
    };
    setItems([...items, newItem]);
  }

  function handleMove(idx: number, dir: "up" | "down") {
    const targetIdx = dir === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= items.length) return;
    const copy = [...items];
    const [moved] = copy.splice(idx, 1);
    copy.splice(targetIdx, 0, moved);
    copy.forEach((item, i) => (item.position = i));
    setItems(copy);
  }

  function handleDelete(idx: number) {
    const copy = items.filter((_, i) => i !== idx);
    copy.forEach((item, i) => (item.position = i));
    setItems(copy);
  }

  function handleChange(idx: number, field: keyof StorefrontNavItem, val: any) {
    const copy = [...items];
    copy[idx] = { ...copy[idx], [field]: val };
    setItems(copy);
  }

  async function handleSave() {
    setSaving(true);
    try {
      // Validate URLs to prevent javascript/data schemes
      for (const item of items) {
        if (item.url.startsWith("javascript:") || item.url.startsWith("data:")) {
          throw new Error("Unsafe script or data URLs are prohibited in navigation.");
        }
      }
      await onUpdate({ navigationItems: items });
      toast.success("Navigation Saved", "Storefront header menu links updated in draft.");
    } catch (err: any) {
      toast.error("Save Failed", err.message || "Could not save navigation items.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <h2 className="font-display text-xl font-bold text-ink">Storefront Navigation Menu</h2>
          <p className="text-body-sm text-ink-soft">
            Configure header links guiding visitors to your curated collections, categories, and heritage story.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="md" onClick={handleAdd} className="gap-2 border-line">
            <Plus className="size-4" />
            <span>Add Link</span>
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={handleSave}
            disabled={saving}
            className="bg-primary text-white hover:bg-primary/90 shadow-sm"
          >
            {saving ? "Saving..." : "Save Navigation"}
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item, idx) => (
          <Card
            key={idx}
            variant="surface"
            padding="sm"
            radius="lg"
            className="border-line flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface"
          >
            <div className="grid gap-3 sm:grid-cols-3 flex-1">
              <div>
                <label className="text-caption font-semibold text-ink-muted">Label</label>
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => handleChange(idx, "label", e.target.value)}
                  className="w-full rounded-lg border border-line bg-surface px-3 py-1.5 text-body-sm text-ink focus:border-primary focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-caption font-semibold text-ink-muted">Destination Type</label>
                <select
                  value={item.targetType}
                  onChange={(e) => handleChange(idx, "targetType", e.target.value)}
                  className="w-full rounded-lg border border-line bg-surface px-3 py-1.5 text-body-sm text-ink focus:border-primary focus:outline-hidden"
                >
                  <option value="HOME">Store Homepage</option>
                  <option value="COLLECTION">Artisan Collection</option>
                  <option value="CATEGORY">Craft Category</option>
                  <option value="STORY">Weaver Heritage Story</option>
                  <option value="CUSTOM">Custom Relative Path</option>
                </select>
              </div>

              <div>
                <label className="text-caption font-semibold text-ink-muted">Destination URL / Path</label>
                <input
                  type="text"
                  value={item.url}
                  onChange={(e) => handleChange(idx, "url", e.target.value)}
                  className="w-full rounded-lg border border-line bg-surface px-3 py-1.5 text-body-sm text-ink focus:border-primary focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
              <Button
                variant="ghost"
                size="sm"
                disabled={idx === 0}
                onClick={() => handleMove(idx, "up")}
                className="size-8 p-0 text-ink-soft hover:text-ink"
              >
                <ArrowUp className="size-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                disabled={idx === items.length - 1}
                onClick={() => handleMove(idx, "down")}
                className="size-8 p-0 text-ink-soft hover:text-ink"
              >
                <ArrowDown className="size-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(idx)}
                className="size-8 p-0 text-danger hover:bg-danger/10"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
