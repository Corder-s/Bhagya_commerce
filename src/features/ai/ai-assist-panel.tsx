import { Sparkles, Wand2 } from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

/**
 * AiAssistPanel — the Bhagya AI surface, presented as an assistive tool.
 *
 * Positioning matters more than the widget: this panel says plainly that drafts
 * are suggestions the seller edits and approves. There is no generate button that
 * pretends to work — the prompt box is disabled in Phase 1, with copy explaining
 * what the model will and will not do. Server-side calls, cost controls and the
 * human-approval flow all land in Phase 4.
 */
export function AiAssistPanel({
  tasks = [
    { title: "Write a product description", detail: "From your title, materials and photos." },
    { title: "Improve listing SEO", detail: "Keywords and concise metadata for search." },
    { title: "Draft a campaign", detail: "Festive email and social copy in your voice." },
    { title: "Explain a sales dip", detail: "Plain-language read on recent numbers." },
  ],
}: {
  tasks?: readonly { title: string; detail: string }[];
}) {
  return (
    <div className="flex flex-col gap-6">
      <Card variant="botanical" padding="lg" radius="lg">
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span
              aria-hidden="true"
              className="grid size-10 place-items-center rounded-md bg-surface text-primary"
            >
              <Sparkles className="size-4" />
            </span>
            <h2 className="text-heading-lg text-ink">Bhagya AI</h2>
            <Badge tone="gold" size="md">
              Draft only — you approve
            </Badge>
          </div>

          <p className="max-w-2xl text-body-sm text-ink-soft">
            AI here is a drafting assistant, not an autopilot. It prepares text you
            can edit, and nothing reaches your live store without your approval.
            Your catalogue data is never used to train third-party models.
          </p>

          <div className="flex flex-col gap-2">
            <label htmlFor="ai-prompt" className="text-body-sm font-medium text-ink">
              What should Bhagya AI draft?
            </label>
            <Textarea
              id="ai-prompt"
              rows={3}
              disabled
              placeholder="Describe a product, ask for a campaign outline, or paste a listing to improve…"
              aria-describedby="ai-prompt-note"
            />
            <p id="ai-prompt-note" className="text-caption text-ink-soft">
              The model connection is Phase 4 work. This panel defines the
              interaction, states and copy.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary" size="md" disabled>
              <Wand2 aria-hidden="true" />
              Draft with AI
            </Button>
            <Button variant="ghost" size="md" disabled>
              See an example draft
            </Button>
          </div>
        </CardContent>
      </Card>

      <ul className="grid gap-4 sm:grid-cols-2">
        {tasks.map((task) => (
          <li key={task.title}>
            <Card variant="surface" padding="md" className="h-full">
              <CardContent className="flex flex-col gap-1.5">
                <h3 className="text-heading-md text-ink">{task.title}</h3>
                <p className="text-body-sm text-ink-soft">{task.detail}</p>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
