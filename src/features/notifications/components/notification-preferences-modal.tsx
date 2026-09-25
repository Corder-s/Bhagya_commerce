"use client";

import * as React from "react";
import { Check, Settings, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { NotificationPreferences } from "@/features/notifications/notification-types";
import { notificationService } from "@/services/notification.service";
import { toast } from "@/lib/toast";

export interface NotificationPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationPreferencesModal({
  isOpen,
  onClose,
}: NotificationPreferencesModalProps) {
  const [prefs, setPrefs] = React.useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (!isOpen) return;
    async function load() {
      const data = await notificationService.getPreferences();
      setPrefs(data);
      setLoading(false);
    }
    load();
  }, [isOpen]);

  if (!isOpen) return null;

  async function handleSave() {
    if (!prefs) return;
    setSaving(true);
    try {
      await notificationService.updatePreferences(prefs);
      toast.success("Preferences Saved", "Notification delivery settings have been updated.");
      onClose();
    } catch {
      toast.error("Error", "Could not save preferences. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function toggleChannel(
    category: "orderUpdates" | "deliveryAlerts" | "marketing",
    channel: "email" | "sms" | "whatsapp" | "push",
  ) {
    if (!prefs) return;
    setPrefs({
      ...prefs,
      [category]: {
        ...prefs[category],
        [channel]: !prefs[category][channel],
      },
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl border border-line bg-surface p-6 sm:p-8 shadow-2xl space-y-6 my-8">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div className="flex items-center gap-2">
            <Settings className="size-5 text-gold-dark dark:text-gold" />
            <h3 className="text-heading-md font-semibold text-ink">
              Notification Preferences
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-ink-soft hover:text-ink hover:bg-surface-raised transition-colors"
            aria-label="Close preferences"
          >
            <X className="size-5" />
          </button>
        </div>

        {loading || !prefs ? (
          <div className="py-8 text-center text-body-sm text-ink-soft">
            Loading preferences…
          </div>
        ) : (
          <div className="space-y-6 text-body-sm">
            {/* Category 1: Order Updates */}
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-ink">Order Updates</h4>
                <p className="text-caption text-ink-soft">
                  Order confirmations, payments and artisan crafting milestones.
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(["email", "sms", "whatsapp", "push"] as const).map((ch) => (
                  <label
                    key={ch}
                    className="flex items-center gap-2 rounded-lg border border-line bg-surface-raised p-2.5 cursor-pointer hover:border-gold/50 transition-colors"
                  >
                    <Checkbox
                      checked={prefs.orderUpdates[ch]}
                      onCheckedChange={() => toggleChannel("orderUpdates", ch)}
                    />
                    <span className="text-caption font-medium uppercase text-ink">
                      {ch}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Category 2: Delivery Alerts */}
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-ink">Delivery Alerts</h4>
                <p className="text-caption text-ink-soft">
                  Courier dispatch, out for delivery, and arrival notifications.
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(["email", "sms", "whatsapp", "push"] as const).map((ch) => (
                  <label
                    key={ch}
                    className="flex items-center gap-2 rounded-lg border border-line bg-surface-raised p-2.5 cursor-pointer hover:border-gold/50 transition-colors"
                  >
                    <Checkbox
                      checked={prefs.deliveryAlerts[ch]}
                      onCheckedChange={() => toggleChannel("deliveryAlerts", ch)}
                    />
                    <span className="text-caption font-medium uppercase text-ink">
                      {ch}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Category 3: Marketing & Discovery */}
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-ink">Artisanal Collections & Journal</h4>
                <p className="text-caption text-ink-soft">
                  New craft drops, maker spotlights, and seasonal celebrations.
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(["email", "sms", "whatsapp", "push"] as const).map((ch) => (
                  <label
                    key={ch}
                    className="flex items-center gap-2 rounded-lg border border-line bg-surface-raised p-2.5 cursor-pointer hover:border-gold/50 transition-colors"
                  >
                    <Checkbox
                      checked={prefs.marketing[ch]}
                      onCheckedChange={() => toggleChannel("marketing", ch)}
                    />
                    <span className="text-caption font-medium uppercase text-ink">
                      {ch}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-line">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={onClose}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={handleSave}
                disabled={saving}
                loading={saving}
                loadingLabel="Saving…"
              >
                Save Preferences
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
