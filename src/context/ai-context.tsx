"use client";

import { usePathname } from "next/navigation";
import * as React from "react";

import { aiService } from "@/features/ai/services/ai.service";
import type {
  AIConversation,
  AIMessage,
  AIMode,
  CustomerAIContext,
  MerchantAIContext,
} from "@/features/ai/types/ai.types";

interface AIContextType {
  isOpen: boolean;
  mode: AIMode;
  conversation: AIConversation | null;
  messages: AIMessage[];
  isThinking: boolean;
  streamingText: string | null;
  activeToolName: string | null;
  customerContext: CustomerAIContext | null;
  merchantContext: MerchantAIContext | null;
  openAI: (mode?: AIMode) => void;
  closeAI: () => void;
  toggleAI: (mode?: AIMode) => void;
  openWithContext: (context: CustomerAIContext, initialPrompt?: string) => void;
  sendMessage: (text: string) => Promise<void>;
  confirmAction: (messageId: string, confirmed: boolean) => Promise<void>;
  clearConversation: () => void;
}

const AIContext = React.createContext<AIContextType | null>(null);

export function AIProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);
  const [mode, setMode] = React.useState<AIMode>("customer");
  const [conversation, setConversation] = React.useState<AIConversation | null>(null);
  const [isThinking, setIsThinking] = React.useState(false);
  const [streamingText, setStreamingText] = React.useState<string | null>(null);
  const [activeToolName, setActiveToolName] = React.useState<string | null>(null);
  const [customerContext, setCustomerContext] = React.useState<CustomerAIContext | null>(null);
  const [merchantContext, setMerchantContext] = React.useState<MerchantAIContext | null>(null);

  // Auto-detect mode based on path
  React.useEffect(() => {
    if (pathname.startsWith("/merchant")) {
      setMode("merchant");
    } else {
      setMode("customer");
    }
  }, [pathname]);

  const initConversation = React.useCallback(
    async (targetMode: AIMode, ctx?: CustomerAIContext) => {
      try {
        const conv = await aiService.startConversation(targetMode, {
          customerContext: ctx || customerContext || { currentRoute: pathname },
          merchantContext: merchantContext || { currentRoute: pathname },
        });
        setConversation(conv);
      } catch {
        // Fallback
      }
    },
    [customerContext, merchantContext, pathname],
  );

  const openAI = React.useCallback(
    (targetMode?: AIMode) => {
      const activeMode = targetMode || mode;
      setMode(activeMode);
      setIsOpen(true);
      if (!conversation || conversation.mode !== activeMode) {
        initConversation(activeMode);
      }
    },
    [conversation, initConversation, mode],
  );

  const closeAI = React.useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleAI = React.useCallback(
    (targetMode?: AIMode) => {
      if (isOpen) {
        closeAI();
      } else {
        openAI(targetMode);
      }
    },
    [closeAI, isOpen, openAI],
  );

  const sendMessage = React.useCallback(
    async (text: string) => {
      if (!text.trim() || isThinking) return;

      let convId = conversation?.id;
      if (!convId) {
        const newConv = await aiService.startConversation(mode, {
          customerContext: customerContext || undefined,
          merchantContext: merchantContext || undefined,
        });
        setConversation(newConv);
        convId = newConv.id;
      }

      // Add user message locally
      const tempUserMsg: AIMessage = {
        id: `msg_local_${Date.now()}`,
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
          convId,
          text,
          {
            customerContext: customerContext || undefined,
            merchantContext: merchantContext || undefined,
          },
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
        // Error state
        const errorMsg: AIMessage = {
          id: `msg_err_${Date.now()}`,
          role: "assistant",
          content: "Bhagya AI is temporarily unavailable. Please try again in a moment.",
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
    },
    [conversation?.id, customerContext, isThinking, merchantContext, mode],
  );

  const openWithContext = React.useCallback(
    (ctx: CustomerAIContext, initialPrompt?: string) => {
      setCustomerContext(ctx);
      setMode("customer");
      setIsOpen(true);
      initConversation("customer", ctx).then(() => {
        if (initialPrompt) {
          sendMessage(initialPrompt);
        }
      });
    },
    [initConversation, sendMessage],
  );

  const confirmAction = React.useCallback(
    async (messageId: string, confirmed: boolean) => {
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
    },
    [conversation],
  );

  const clearConversation = React.useCallback(() => {
    initConversation(mode);
  }, [initConversation, mode]);

  return (
    <AIContext.Provider
      value={{
        isOpen,
        mode,
        conversation,
        messages: conversation?.messages || [],
        isThinking,
        streamingText,
        activeToolName,
        customerContext,
        merchantContext,
        openAI,
        closeAI,
        toggleAI,
        openWithContext,
        sendMessage,
        confirmAction,
        clearConversation,
      }}
    >
      {children}
    </AIContext.Provider>
  );
}

export function useAI() {
  const context = React.useContext(AIContext);
  if (!context) {
    throw new Error("useAI must be used within an AIProvider");
  }
  return context;
}
