"use client";

import {
  Boxes,
  FileText,
  MessageSquare,
  Package,
  ReceiptIndianRupee,
  RotateCcw,
  Send,
  Share2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { AIChatView } from "@/features/ai/components/ai-chat-view";
import { aiService } from "@/features/ai/services/ai.service";
import type {
  AIConversation,
  AIMessage,
  MerchantAIContext,
} from "@/features/ai/types/ai.types";

const MERCHANT_QUICK_ACTIONS = [
  {
    icon: <TrendingUp className="size-4 text-[#C49A45]" />,
    title: "Summarize today's sales",
    prompt: "How are my store sales and orders tracking today?",
    detail: "Live revenue and performance vs yesterday",
  },
  {
    icon: <Boxes className="size-4 text-warning" />,
    title: "Check low stock alerts",
    prompt: "Which products are low in stock and need restock?",
    detail: "Inventory safety threshold warnings",
  },
  {
    icon: <FileText className="size-4 text-primary" />,
    title: "Draft a product listing",
    prompt: "Write a high-converting product description for a Kanjivaram silk saree",
    detail: "Storytelling copy & care instructions",
  },
  {
    icon: <Share2 className="size-4 text-success" />,
    title: "WhatsApp campaign copy",
    prompt: "Draft a WhatsApp broadcast for our new festive collection",
    detail: "Customer broadcast with discount code",
  },
];

export function MerchantAiCopilotView() {
  const { user } = useAuth();
  const [conversation, setConversation] = React.useState<AIConversation | null>(null);
  const [isThinking, setIsThinking] = React.useState(false);
  const [streamingText, setStreamingText] = React.useState<string | null>(null);
  const [activeToolName, setActiveToolName] = React.useState<string | null>(null);

  const merchantContext: MerchantAIContext = React.useMemo(() => {
    return {
      userId: user?.id,
      storeId: user?.organizationMembership?.storeId || "store_varanasi_silk",
      storeName: user?.organizationMembership?.storeName || "Varanasi Heritage Silks",
      currentRoute: "/merchant/ai",
    };
  }, [user]);

  const initConversation = React.useCallback(async () => {
    try {
      const conv = await aiService.startConversation("merchant", { merchantContext });
      setConversation(conv);
    } catch {
      // Fallback
    }
  }, [merchantContext]);

  React.useEffect(() => {
    initConversation();
  }, [initConversation]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isThinking || !conversation) return;

    // Add user message locally
    const tempUserMsg: AIMessage = {
      id: `msg_u_${Date.now()}`,
      role: "user",
      content: text.trim(),
      createdAt: new Date().toISOString(),
    };

    setConversation((prev) =>
      prev
        ? {
            ...prev,
            messages: [...prev.messages, tempUserMsg],
          }
        : null,
    );

    setIsThinking(true);
    setStreamingText("");
    setActiveToolName(null);

    try {
      const assistantMsg = await aiService.sendMessage(
        conversation.id,
        text,
        { merchantContext },
        (chunk) => {
          setStreamingText(chunk);
        },
        (tool) => {
          if (tool.status === "running") {
            setActiveToolName(tool.name);
          } else {
            setActiveToolName(null);
          }
        },
      );

      setConversation((prev) =>
        prev
          ? {
              ...prev,
              messages: [...prev.messages.filter((m) => m.id !== tempUserMsg.id), tempUserMsg, assistantMsg],
            }
          : null,
      );
    } catch {
      const errorMsg: AIMessage = {
        id: `msg_err_${Date.now()}`,
        role: "assistant",
        content: "AI couldn't retrieve your store data right now. Please try again.",
        createdAt: new Date().toISOString(),
      };
      setConversation((prev) =>
        prev
          ? {
              ...prev,
              messages: [...prev.messages, errorMsg],
            }
          : null,
      );
    } finally {
      setIsThinking(false);
      setStreamingText(null);
      setActiveToolName(null);
    }
  };

  const handleConfirmAction = async (messageId: string, confirmed: boolean) => {
    if (!conversation) return;
    setIsThinking(true);
    try {
      const feedbackMsg = await aiService.confirmWriteAction(
        conversation.id,
        messageId,
        confirmed,
      );
      setConversation((prev) =>
        prev
          ? {
              ...prev,
              messages: [...prev.messages, feedbackMsg],
            }
          : null,
      );
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-line bg-surface shadow-card">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-caption font-semibold text-[#9A6A20] dark:text-[#C49A45] uppercase tracking-wider">
              Store Copilot
            </span>
            <span className="text-ink-soft">·</span>
            <Badge tone="gold" size="sm">
              Safe Tool Guardrails Active
            </Badge>
          </div>

          <h1 className="font-display text-display-sm font-bold text-ink flex items-center gap-2">
            Bhagya AI Copilot
          </h1>

          <p className="text-body-sm text-ink-soft">
            Use your store data and Bhagya tools to make faster operational decisions.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={initConversation}
          disabled={isThinking}
          className="shrink-0"
        >
          <RotateCcw className="size-3.5" />
          <span>New Session</span>
        </Button>
      </div>

      {/* Suggested Quick Prompt Cards (when conversation is fresh) */}
      {conversation && conversation.messages.length <= 1 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {MERCHANT_QUICK_ACTIONS.map((action, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSendMessage(action.prompt)}
              disabled={isThinking}
              className="p-3.5 rounded-2xl border border-line bg-surface hover:border-[#C49A45] text-left transition-all hover:shadow-sm space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="grid size-8 place-items-center rounded-xl bg-surface-subtle border border-line group-hover:scale-105 transition-transform">
                  {action.icon}
                </span>
                <span className="text-caption text-ink-faint group-hover:text-[#9A6A20] dark:group-hover:text-[#C49A45]">
                  Ask →
                </span>
              </div>
              <div>
                <h4 className="text-body-sm font-bold text-ink group-hover:text-[#9A6A20] dark:group-hover:text-[#C49A45] transition-colors">
                  {action.title}
                </h4>
                <p className="text-[11px] text-ink-soft line-clamp-1 mt-0.5">
                  {action.detail}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Main Chat Workspace Window */}
      <Card variant="surface" padding="none" radius="xl" className="border-line shadow-card overflow-hidden h-[580px] flex flex-col">
        <AIChatView
          mode="merchant"
          messages={conversation?.messages || []}
          isThinking={isThinking}
          streamingText={streamingText}
          activeToolName={activeToolName}
          merchantContext={merchantContext}
          onSendMessage={handleSendMessage}
          onConfirmAction={handleConfirmAction}
          onClear={initConversation}
          placeholder="Ask about store revenue, low stock items, or draft product copy…"
          className="h-full"
        />
      </Card>
    </div>
  );
}
