import type { ConversationTurn } from "@/types/catalogue";

/**
 * Demo content for the Bhagya AI preview.
 *
 * This is a *copy deck*, not a transcript — there is no assistant behind it yet.
 * The home page renders it with an explicit "preview" label so nobody mistakes
 * it for a working conversation, and Phase 2 replaces this file with a real
 * stream from the assistant service, keeping the same turn shape.
 */
export const aiConversation: readonly ConversationTurn[] = [
  {
    id: "turn-1",
    role: "customer",
    text: "I want something natural for my morning routine.",
  },
  {
    id: "turn-2",
    role: "assistant",
    text: "Here are a few options based on your preferences — both from small-batch makers.",
  },
] as const;

/** Products the preview recommends; slugs resolve against `@/data/products`. */
export const aiRecommendationSlugs: readonly string[] = [
  "unpolished-millet-grain-blend",
  "ashwagandha-churna",
] as const;

/** What the assistant is being built to do — stated as intent, not shipped fact. */
export const aiCapabilities: readonly string[] = [
  "Understands plain-language requests",
  "Weighs brand story, ingredients and budget together",
  "Shows its reasoning on every recommendation",
] as const;

/** Opening prompts shown as inert suggestions in the preview. */
export const aiStarterPrompts: readonly string[] = [
  "A gentle cleanser for humid weather",
  "Millets for a family of four",
  "Gifting under ₹1,500",
] as const;
