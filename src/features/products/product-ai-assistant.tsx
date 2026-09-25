"use client";

import { AnimatePresence, m } from "framer-motion";
import { Bot, Send, Sparkles, X } from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ProductDetail } from "@/types/catalogue";

export interface ProductAiAssistantProps {
  product: ProductDetail;
  isOpen: boolean;
  onClose: () => void;
}

const STARTER_PROMPTS = [
  "What is this product made of?",
  "How do I care for and use it?",
  "Tell me about the artisan maker",
  "Is there free shipping on this item?",
];

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
}

export function ProductAiAssistant({
  product,
  isOpen,
  onClose,
}: ProductAiAssistantProps) {
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: "m_init",
      sender: "ai",
      text: `Namaste! I am Bhagya AI. I know all about "${product.name}" crafted by ${product.brand.name}. Ask me anything about materials, sizing, usage, or maker provenance!`,
    },
  ]);
  const [inputValue, setInputValue] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);

  const handleAsk = (query: string) => {
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      sender: "user",
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // Simulate intelligent context-aware response based on product data
    setTimeout(() => {
      let reply = `This handcrafted ${product.name} is made by ${product.brand.name}. `;
      const lower = query.toLowerCase();

      if (lower.includes("made") || lower.includes("material") || lower.includes("ingredient")) {
        const spec = product.specifications.find((s) => s.label.toLowerCase().includes("material"))?.value;
        reply = spec
          ? `It is made from ${spec}. Master artisans use time-honored authentic techniques.`
          : product.description;
      } else if (lower.includes("use") || lower.includes("care")) {
        reply = product.careInstructions
          ? `Care instructions: ${product.careInstructions}`
          : `Usage details: Handle with care and store in a clean, dry place to preserve natural handmade textures.`;
      } else if (lower.includes("shipping") || lower.includes("delivery")) {
        reply = `${product.shippingInfo}. Free delivery applies on orders over ₹1,499!`;
      } else if (lower.includes("maker") || lower.includes("artisan") || lower.includes("brand")) {
        reply = `${product.brand.name} is a verified Indian artisan atelier committed to sustainable indigenous craft.`;
      } else {
        reply = `${product.description} You can also check the specifications tab below for precise dimensions.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `ai_${Date.now()}`,
          sender: "ai",
          text: reply,
        },
      ]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-modal bg-ink/40 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Assistant Modal / Bottom Sheet */}
          <m.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="ai-assistant-title"
            className="fixed inset-x-4 bottom-4 top-auto sm:inset-auto sm:right-6 sm:bottom-6 z-modal flex max-h-[85vh] w-auto sm:w-[440px] flex-col rounded-3xl border border-line bg-surface shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-line bg-gold-surface px-5 py-4">
              <div className="flex items-center gap-2.5">
                <span className="grid size-8 place-items-center rounded-pill bg-gradient-btn-gold text-[#151515] shadow-xs">
                  <Sparkles className="size-4" aria-hidden="true" />
                </span>
                <div>
                  <h3 id="ai-assistant-title" className="text-body-md font-bold text-ink flex items-center gap-1.5">
                    Ask Bhagya AI
                    <Badge tone="gold" size="sm">Preview</Badge>
                  </h3>
                  <p className="text-caption text-ink-soft truncate max-w-[220px]">
                    {product.name}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close assistant"
                className="grid size-8 place-items-center rounded-lg text-ink-soft hover:bg-canvas-deep hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <X className="size-4.5" aria-hidden="true" />
              </button>
            </div>

            {/* Chat conversation area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 max-h-[380px] bg-canvas/60">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-body-sm leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-primary text-[#151515] font-medium rounded-br-xs shadow-xs"
                        : "bg-surface border border-line text-ink rounded-bl-xs shadow-xs"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1.5 rounded-2xl border border-line bg-surface px-4 py-2.5 text-caption text-ink-soft">
                    <span className="size-1.5 animate-bounce rounded-full bg-primary" />
                    <span className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:0.15s]" />
                    <span className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:0.3s]" />
                    <span className="ml-1 text-caption font-medium">Bhagya AI is answering…</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Prompt Pills */}
            <div className="border-t border-line bg-surface p-3">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
                Suggested questions:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {STARTER_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handleAsk(prompt)}
                    className="rounded-pill border border-line bg-gold-soft px-2.5 py-1 text-caption text-gold-dark dark:text-gold hover:border-primary/50 transition-colors text-left"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAsk(inputValue);
              }}
              className="flex items-center gap-2 border-t border-line bg-surface p-3"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about materials, care, or craft…"
                className="flex-1 rounded-xl border border-line bg-canvas px-3.5 py-2 text-body-sm text-ink placeholder:text-ink-faint focus-visible:outline-2 focus-visible:outline-primary"
              />
              <Button type="submit" size="sm" variant="primary" disabled={!inputValue.trim()}>
                <Send className="size-3.5" aria-hidden="true" />
              </Button>
            </form>
          </m.div>
        </>
      )}
    </AnimatePresence>
  );
}
