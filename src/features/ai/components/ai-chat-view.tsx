"use client";

import {
  ArrowUp,
  Loader2,
  RotateCcw,
  Send,
  Sparkles,
  Wrench,
  X,
} from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AIMessageBubble } from "@/features/ai/components/ai-message-bubble";
import { aiService } from "@/features/ai/services/ai.service";
import type {
  AIMessage,
  AIMode,
  AISuggestedPrompt,
  CustomerAIContext,
  MerchantAIContext,
} from "@/features/ai/types/ai.types";

export function AIChatView({
  mode,
  messages,
  isThinking,
  streamingText,
  activeToolName,
  customerContext,
  merchantContext,
  onSendMessage,
  onConfirmAction,
  onClear,
  onClose,
  placeholder,
  className,
}: {
  mode: AIMode;
  messages: AIMessage[];
  isThinking: boolean;
  streamingText: string | null;
  activeToolName: string | null;
  customerContext?: CustomerAIContext | null;
  merchantContext?: MerchantAIContext | null;
  onSendMessage: (text: string) => Promise<void>;
  onConfirmAction?: (messageId: string, confirmed: boolean) => Promise<void>;
  onClear?: () => void;
  onClose?: () => void;
  placeholder?: string;
  className?: string;
}) {
  const [inputValue, setInputValue] = React.useState("");
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const suggestedPrompts = React.useMemo(() => {
    return aiService.getSuggestedPrompts(mode, {
      customerContext: customerContext || undefined,
      merchantContext: merchantContext || undefined,
    });
  }, [customerContext, merchantContext, mode]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText, isThinking]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isThinking) return;

    const query = inputValue;
    setInputValue("");
    await onSendMessage(query);
  };

  const handlePromptClick = (prompt: string) => {
    onSendMessage(prompt);
  };

  return (
    <div className={`flex flex-col h-full bg-surface ${className || ""}`}>
      {/* Context Bar (if active product or context exists) */}
      {customerContext?.productName && (
        <div className="flex items-center justify-between px-4 py-2 bg-gold-surface border-b border-line text-caption">
          <div className="flex items-center gap-1.5 truncate">
            <span className="text-[#9A6A20] dark:text-[#C49A45] font-semibold">Product Context:</span>
            <span className="text-ink truncate font-medium">{customerContext.productName}</span>
          </div>
          <Badge tone="gold" size="sm">Active</Badge>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {messages.map((msg) => (
          <AIMessageBubble
            key={msg.id}
            message={msg}
            onConfirmAction={onConfirmAction}
          />
        ))}

        {/* Live Streaming Message Display */}
        {streamingText && (
          <div className="flex flex-col gap-2 max-w-[85%]">
            <div className="rounded-2xl rounded-tl-xs border border-line bg-surface p-4 text-body-sm text-ink shadow-xs">
              <div className="whitespace-pre-line leading-relaxed">{streamingText}</div>
            </div>
          </div>
        )}

        {/* Thinking / Tool Calling State */}
        {isThinking && !streamingText && (
          <div className="flex items-center gap-2 text-caption text-ink-soft bg-surface-subtle p-3 rounded-xl border border-line w-fit">
            <Loader2 className="size-3.5 animate-spin text-[#C49A45]" />
            {activeToolName ? (
              <span>Executing safe tool: <strong className="font-mono text-ink">{activeToolName}</strong>…</span>
            ) : (
              <span>Bhagya AI is thinking…</span>
            )}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Pills */}
      {suggestedPrompts.length > 0 && messages.length <= 3 && (
        <div className="p-3 border-t border-line bg-surface-subtle/50">
          <p className="text-[11px] font-bold uppercase tracking-wider text-ink-soft mb-2">
            Suggested questions:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {suggestedPrompts.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => handlePromptClick(s.prompt)}
                disabled={isThinking}
                className="text-left rounded-pill border border-line bg-surface px-3 py-1.5 text-caption font-medium text-ink hover:border-[#C49A45] hover:text-[#9A6A20] dark:hover:text-[#C49A45] transition-colors shadow-2xs disabled:opacity-50"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form Bar */}
      <div className="p-3 sm:p-4 border-t border-line bg-surface">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          {onClear && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClear}
              disabled={isThinking}
              title="Start New Conversation"
              className="size-9 p-0 shrink-0 text-ink-soft hover:text-ink"
            >
              <RotateCcw className="size-4" />
            </Button>
          )}

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder || (mode === "customer" ? "Ask about products, orders, or craft…" : "Ask about sales, stock, or listings…")}
            disabled={isThinking}
            className="flex-1 rounded-xl border border-line bg-canvas px-4 py-2.5 text-body-sm text-ink placeholder:text-ink-faint focus:border-[#C49A45] focus:outline-none transition-colors"
          />

          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={!inputValue.trim() || isThinking}
            className="size-10 p-0 rounded-xl shrink-0"
          >
            {isThinking ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <ArrowUp className="size-4.5" />
            )}
          </Button>
        </form>

        <p className="text-[11px] text-ink-faint text-center mt-2">
          Bhagya AI operates with safe read/write boundaries and never stores payment credentials.
        </p>
      </div>
    </div>
  );
}
