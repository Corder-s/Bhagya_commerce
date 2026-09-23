"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupOption } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/lib/toast";

/**
 * PreferencesForm — the settings surface, with real controls and local state.
 *
 * Every control here is genuinely interactive (keyboard, focus, disabled states
 * all exercised) but nothing is persisted: submitting explains that the profile
 * service arrives in Phase 2. Grouping into fieldsets with legends keeps the
 * relationships explicit for screen readers and for anyone skimming the form.
 */
export function PreferencesForm() {
  const [marketing, setMarketing] = React.useState(true);
  const [orderUpdates, setOrderUpdates] = React.useState(true);
  const [whatsapp, setWhatsapp] = React.useState(false);
  const [language, setLanguage] = React.useState("en-IN");
  const [interests, setInterests] = React.useState<string[]>(["home-living"]);

  function toggleInterest(id: string, checked: boolean) {
    setInterests((current) =>
      checked ? [...current, id] : current.filter((item) => item !== id),
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Card variant="surface" padding="md" radius="lg">
        <CardContent className="flex flex-col gap-5">
          <fieldset className="flex flex-col gap-4">
            <legend className="text-heading-md text-ink">Notifications</legend>

            <div className="flex items-start justify-between gap-6">
              <label htmlFor="pref-order-updates" className="flex flex-col gap-1">
                <span className="text-body-sm font-medium text-ink">
                  Order and delivery updates
                </span>
                <span className="text-caption text-ink-soft">
                  Shipment status, delays and delivery confirmations.
                </span>
              </label>
              <Switch
                id="pref-order-updates"
                checked={orderUpdates}
                onCheckedChange={setOrderUpdates}
              />
            </div>

            <div className="flex items-start justify-between gap-6">
              <label htmlFor="pref-marketing" className="flex flex-col gap-1">
                <span className="text-body-sm font-medium text-ink">
                  Journal and offers
                </span>
                <span className="text-caption text-ink-soft">
                  One considered email a month. Unsubscribe any time.
                </span>
              </label>
              <Switch
                id="pref-marketing"
                checked={marketing}
                onCheckedChange={setMarketing}
              />
            </div>

            <div className="flex items-start justify-between gap-6">
              <label htmlFor="pref-whatsapp" className="flex flex-col gap-1">
                <span className="text-body-sm font-medium text-ink">
                  WhatsApp updates
                </span>
                <span className="text-caption text-ink-soft">
                  Requires the messaging service — Phase 3.
                </span>
              </label>
              <Switch
                id="pref-whatsapp"
                checked={whatsapp}
                onCheckedChange={setWhatsapp}
                disabled
              />
            </div>
          </fieldset>

          <div className="h-px bg-line" />

          <fieldset className="flex flex-col gap-3">
            <legend className="mb-1 text-heading-md text-ink">Language</legend>
            <RadioGroup value={language} onValueChange={setLanguage}>
              <RadioGroupOption
                id="lang-en"
                value="en-IN"
                label="English (India)"
                description="Default for this account"
              />
              <RadioGroupOption
                id="lang-hi"
                value="hi-IN"
                label="हिन्दी"
                description="Interface translation arrives in a later phase"
              />
            </RadioGroup>
          </fieldset>

          <div className="h-px bg-line" />

          <fieldset className="flex flex-col gap-3">
            <legend className="mb-1 text-heading-md text-ink">
              What are you interested in?
            </legend>
            <p className="text-caption text-ink-soft">
              Used to shape your Discover feed. Choose as many as you like.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { id: "home-living", label: "Home & Living" },
                { id: "textiles", label: "Textiles" },
                { id: "wellness", label: "Wellness" },
                { id: "food", label: "Food & Pantry" },
              ].map((interest) => (
                <label
                  key={interest.id}
                  className="flex cursor-pointer items-center gap-3 rounded-md border border-line px-3.5 py-3 text-body-sm text-ink transition-colors duration-fast hover:border-soft-green-strong hover:bg-soft-green/50"
                >
                  <Checkbox
                    checked={interests.includes(interest.id)}
                    onCheckedChange={(checked) =>
                      toggleInterest(interest.id, checked === true)
                    }
                  />
                  {interest.label}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="flex flex-wrap items-center gap-3 border-t border-line pt-4">
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={() =>
                toast.info(
                  "Preferences are not saved yet",
                  "The profile service arrives in Phase 2 — nothing was stored.",
                )
              }
            >
              Save preferences
            </Button>
            <p className="text-caption text-ink-soft">
              Stored against your account once profiles exist.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
