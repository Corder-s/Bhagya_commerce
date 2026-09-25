"use client";

import { AnimatePresence, m } from "framer-motion";
import { Bot, MessageSquare, Minimize2, Sparkles, X } from "lucide-react";
import { usePathname } from "next/navigation";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { useAI } from "@/context/ai-context";
import { AIChatView } from "@/features/ai/components/ai-chat-view";

export function CustomerAIFloatingWidget() {
  const pathname = usePathname();
  const {
    isOpen,
    mode,
    messages,
    isThinking,
    streamingText,
    activeToolName,
    customerContext,
    openAI,
    closeAI,
    toggleAI,
    sendMessage,
    confirmAction,
    clearConversation,
  } = useAI();

  // Hide the floating widget on checkout, payment, and merchant routes to prevent interference
  if (
    pathname.startsWith("/merchant") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/payment")
  ) {
    return null;
  }

  return (
    <>
      {/* Floating Trigger Button (Bottom-Right) */}
      <aside aria-label="Bhagya AI Assistant" className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-modal">
        <button
          type="button"
          onClick={() => toggleAI("customer")}
          aria-label={isOpen ? "Close Bhagya AI Assistant" : "Open Bhagya AI Assistant"}
          className="group relative flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#151515] to-[#262624] dark:from-[#262624] dark:to-[#151515] p-3 sm:px-4 sm:py-3 text-white shadow-xl border border-[#C49A45]/40 transition-all duration-base hover:scale-105 hover:border-[#C49A45] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C49A45]"
        >
          <span className="relative grid size-7 place-items-center rounded-full bg-[#C49A45] text-[#151515] shadow-xs">
            <Sparkles className="size-4 animate-pulse" />
          </span>
          <span className="hidden sm:inline text-body-sm font-semibold tracking-wide text-white">
            Ask Bhagya AI
          </span>
          <span className="hidden sm:inline-block size-2 rounded-full bg-emerald-400" />
        </button>
      </aside>

      {/* Expandable Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop on mobile */}
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeAI}
              className="fixed inset-0 z-modal bg-ink/30 backdrop-blur-xs sm:hidden"
              aria-hidden="true"
            />

            {/* Panel Window */}
            <m.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              role="dialog"
              aria-modal="true"
              aria-label="Bhagya AI Shopping Assistant"
              className="fixed inset-x-3 bottom-3 top-20 sm:inset-auto sm:right-6 sm:bottom-20 z-modal flex flex-col w-auto sm:w-[440px] sm:h-[620px] max-h-[88dvh] rounded-3xl border border-line bg-surface shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-line bg-[#151515] px-4 py-3.5 text-white">
                <div className="flex items-center gap-2.5">
                  <span className="grid size-8 place-items-center rounded-full bg-[#C49A45] text-[#151515]">
                    <Sparkles className="size-4" />
                  </span>
                  <div>
                    <h3 className="text-body-sm font-bold text-white flex items-center gap-1.5">
                      Bhagya AI
                      <Badge tone="gold" size="sm" className="bg-[#C49A45]/20 text-[#C49A45] border-[#C49A45]/40 text-[10px]">
                        Assistant
                      </Badge>
                    </h3>
                    <p className="text-[11px] text-white/70">
                      Handcrafted shopping & order tracking
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={closeAI}
                    aria-label="Close assistant"
                    className="grid size-8 place-items-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <X className="size-4.5" />
                  </button>
                </div>
              </div>

              {/* Chat View Body */}
              <div className="flex-1 min-h-0 overflow-hidden">
                <AIChatView
                  mode="customer"
                  messages={messages}
                  isThinking={isThinking}
                  streamingText={streamingText}
                  activeToolName={activeToolName}
                  customerContext={customerContext}
                  onSendMessage={sendMessage}
                  onConfirmAction={confirmAction}
                  onClear={clearConversation}
                  onClose={closeAI}
                  placeholder="Ask about sarees, brassware, or order tracking…"
                />
              </div>
            </m.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
