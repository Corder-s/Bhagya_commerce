"use client";

import {
  AlertTriangle,
  ArrowRight,
  ArrowUp,
  Bot,
  Boxes,
  Check,
  CheckCircle2,
  Copy,
  Cpu,
  FileText,
  HelpCircle,
  Layers,
  Lightbulb,
  Loader2,
  Lock,
  MessageSquare,
  Package,
  Radio,
  ReceiptIndianRupee,
  RefreshCw,
  RotateCcw,
  Send,
  Share2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Truck,
  Wand2,
  Zap,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { AIActionConfirmation } from "@/features/ai/components/ai-action-confirmation";
import { AIProductCard } from "@/features/ai/components/ai-product-card";
import { aiService } from "@/features/ai/services/ai.service";
import type {
  AIConversation,
  AIMessage,
  MerchantAIContext,
} from "@/features/ai/types/ai.types";
import { formatPrice } from "@/lib/format";

// Quick action definitions with micro-visual details
const MERCHANT_QUICK_ACTIONS = [
  {
    id: "sales",
    title: "Summarize today's sales",
    prompt: "How are my store sales, gross vs net revenue, and orders tracking today?",
    badge: "Live Revenue",
    detail: "Real-time revenue, order volume & growth vs yesterday",
    visualType: "sales-trend",
  },
  {
    id: "inventory",
    title: "Check low stock alerts",
    prompt: "Which products are below safety threshold and need urgent restocking?",
    badge: "Stock Health",
    detail: "Inventory reorder triggers & depleted SKU counts",
    visualType: "stock-health",
  },
  {
    id: "copywriting",
    title: "Draft a product listing",
    prompt: "Write a high-converting artisan product description for a Kanjivaram pure silk saree with care tips and SEO keywords.",
    badge: "AI Copywriter",
    detail: "Storytelling description, craft heritage & care notes",
    visualType: "listing-draft",
  },
  {
    id: "broadcast",
    title: "WhatsApp campaign copy",
    prompt: "Draft an engaging WhatsApp broadcast message for our weekend festive flash sale with coupon code FESTIVE20.",
    badge: "Broadcast Studio",
    detail: "High-conversion broadcast copy with instant CTA",
    visualType: "broadcast-wave",
  },
];

export function MerchantAiCopilotView() {
  const { user } = useAuth();
  const [conversation, setConversation] = React.useState<AIConversation | null>(null);
  const [isThinking, setIsThinking] = React.useState(false);
  const [streamingText, setStreamingText] = React.useState<string | null>(null);
  const [activeToolName, setActiveToolName] = React.useState<string | null>(null);
  const [inputValue, setInputValue] = React.useState("");
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

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
      setIsThinking(true);
      const conv = await aiService.startConversation("merchant", { merchantContext });
      setConversation(conv);
    } catch {
      // Fallback local conversation
      setConversation({
        id: `conv_${Date.now()}`,
        mode: "merchant",
        title: "Merchant AI Copilot",
        messages: [
          {
            id: `msg_init_${Date.now()}`,
            role: "assistant",
            content: "Namaste! I am your Bhagya AI Commerce Copilot. I have access to your live store sales, inventory thresholds, customer trends, and marketing copy tools. What would you like to review or automate today?",
            createdAt: new Date().toISOString(),
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } finally {
      setIsThinking(false);
      setStreamingText(null);
      setActiveToolName(null);
    }
  }, [merchantContext]);

  React.useEffect(() => {
    initConversation();
  }, [initConversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages, streamingText, isThinking]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isThinking || !conversation) return;

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
        content: "Bhagya AI encountered a momentary connection timeout with your store telemetry. Please retry your inquiry.",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isThinking) return;
    const q = inputValue;
    setInputValue("");
    handleSendMessage(q);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* =========================================================================
          BHAGYA AI HERO BANNER & COMMERCE INTELLIGENCE VISUAL
          ========================================================================= */}
      <div className="relative overflow-hidden rounded-2xl border border-[#444139] bg-gradient-to-r from-[#24231F] via-[#2B2A25] to-[#24231F] p-6 sm:p-8 shadow-lg">
        {/* Ambient Gold Radial Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 h-full w-full sm:w-2/3 bg-[radial-gradient(circle_at_75%_35%,rgba(196,154,69,0.18),rgba(196,154,69,0.05)_45%,transparent_70%)]"
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left Column: Brand & Context */}
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-pill bg-[#35332C] border border-[#5A4725] text-[11px] font-bold text-[#DDBB72] tracking-wider uppercase">
                <Sparkles className="size-3 text-[#C49A45]" />
                Store Copilot
              </span>
              <span className="text-[#9E988C]">·</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-pill bg-[#294C38] text-[11px] font-semibold text-[#73D393] border border-[#294C38]">
                <span className="size-1.5 rounded-full bg-[#43A66A] animate-pulse" />
                Safe Tool Boundaries Active
              </span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#F5F1E8] tracking-tight flex items-center gap-2.5">
              Bhagya AI Copilot
            </h1>

            <p className="text-sm sm:text-base text-[#C8C1B4] leading-relaxed">
              Your intelligent commerce partner. Query store sales, diagnose inventory bottlenecks, generate SEO-ready product copy, and execute broadcast marketing with deterministic safety.
            </p>

            <div className="pt-1 flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={initConversation}
                disabled={isThinking}
                className="bg-[#2B2A25] border-[#444139] text-[#F5F1E8] hover:bg-[#34322B] hover:border-[#C49A45] hover:text-[#DDBB72] transition-colors gap-2"
              >
                <RotateCcw className="size-3.5 text-[#C49A45]" />
                <span>New Session</span>
              </Button>

              <div className="text-xs text-[#9E988C] flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-[#43A66A]" />
                <span>Store telemetry: <strong className="text-[#F5F1E8]">{merchantContext.storeName}</strong></span>
              </div>
            </div>
          </div>

          {/* Right Column: Abstract Commerce Intelligence Visual Element */}
          <div className="shrink-0 flex items-center justify-center lg:justify-end">
            <div className="relative size-44 sm:size-52 rounded-2xl border border-[#444139]/60 bg-[#1C1B18]/80 p-4 shadow-inner flex items-center justify-center overflow-hidden">
              {/* Commerce Sacred Geometry & Orbit Rings */}
              <svg
                viewBox="0 0 200 200"
                className="size-full"
                aria-hidden="true"
              >
                {/* Background Grid Pattern */}
                <defs>
                  <radialGradient id="aiCoreGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#DDBB72" stopOpacity="0.3" />
                    <stop offset="50%" stopColor="#C49A45" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#24231F" stopOpacity="0" />
                  </radialGradient>
                  <linearGradient id="orbitLine" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#C49A45" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#9E988C" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#43A66A" stopOpacity="0.6" />
                  </linearGradient>
                </defs>

                {/* Central Soft Glow Aura */}
                <circle cx="100" cy="100" r="70" fill="url(#aiCoreGlow)" />

                {/* Orbit Ring 1 (Outer) */}
                <circle
                  cx="100"
                  cy="100"
                  r="78"
                  fill="none"
                  stroke="#444139"
                  strokeWidth="1"
                  strokeDasharray="4 6"
                />

                {/* Orbit Ring 2 (Middle with Gold Path) */}
                <circle
                  cx="100"
                  cy="100"
                  r="58"
                  fill="none"
                  stroke="url(#orbitLine)"
                  strokeWidth="1.5"
                  strokeDasharray="18 10"
                  className="animate-[spin_24s_linear_infinite]"
                  style={{ transformOrigin: "center" }}
                />

                {/* Orbit Ring 3 (Inner Sacred Geometry) */}
                <circle
                  cx="100"
                  cy="100"
                  r="38"
                  fill="none"
                  stroke="#5A4725"
                  strokeWidth="1.2"
                />

                {/* Diagonal Connection Vectors */}
                <line x1="45" y1="45" x2="155" y2="155" stroke="#3A3831" strokeWidth="0.8" />
                <line x1="155" y1="45" x2="45" y2="155" stroke="#3A3831" strokeWidth="0.8" />

                {/* Commerce Node 1: Sales Spark (Top Left) */}
                <circle cx="45" cy="60" r="5" fill="#2B2A25" stroke="#C49A45" strokeWidth="1.5" />
                <circle cx="45" cy="60" r="2" fill="#DDBB72" />

                {/* Commerce Node 2: Stock Health (Top Right) */}
                <circle cx="155" cy="60" r="5" fill="#2B2A25" stroke="#43A66A" strokeWidth="1.5" />
                <circle cx="155" cy="60" r="2" fill="#43A66A" />

                {/* Commerce Node 3: Catalog Sync (Bottom Right) */}
                <circle cx="150" cy="145" r="5" fill="#2B2A25" stroke="#C49A45" strokeWidth="1.5" />
                <circle cx="150" cy="145" r="2" fill="#DDBB72" />

                {/* Commerce Node 4: Broadcast (Bottom Left) */}
                <circle cx="50" cy="145" r="5" fill="#2B2A25" stroke="#DDBB72" strokeWidth="1.5" />
                <circle cx="50" cy="145" r="2" fill="#F5F1E8" />

                {/* Central Bhagya Core Intelligence Orb */}
                <circle cx="100" cy="100" r="16" fill="#24231F" stroke="#C49A45" strokeWidth="2" />
                <circle cx="100" cy="100" r="10" fill="#C49A45" className="opacity-90 animate-pulse" />
                <circle cx="100" cy="100" r="4" fill="#F5F1E8" />
              </svg>

              {/* Floating Intelligence Badge */}
              <div className="absolute bottom-2.5 inset-x-3 text-center">
                <span className="text-[10px] font-mono tracking-widest text-[#DDBB72] uppercase bg-[#1C1B18]/90 px-2 py-0.5 rounded border border-[#5A4725]">
                  AI TELEMETRY • READY
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SUGGESTED QUICK ACTION CARDS (Fresh session state)
          ========================================================================= */}
      {conversation && conversation.messages.length <= 1 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#9E988C] flex items-center gap-2">
              <Lightbulb className="size-3.5 text-[#C49A45]" />
              Recommended Quick Actions
            </h3>
            <span className="text-[11px] text-[#9E988C]">Click any card to analyze immediately</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {MERCHANT_QUICK_ACTIONS.map((action) => (
              <button
                key={action.id}
                type="button"
                onClick={() => handleSendMessage(action.prompt)}
                disabled={isThinking}
                className="group relative flex flex-col justify-between p-4 rounded-2xl border border-[#444139] bg-[#2B2A25] hover:bg-[#302F29] hover:border-[#5B533F] text-left transition-all duration-200 hover:-translate-y-0.5 shadow-sm disabled:opacity-50"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#35332C] text-[#DDBB72] border border-[#5A4725]">
                      {action.badge}
                    </span>
                    <span className="text-xs font-semibold text-[#9E988C] group-hover:text-[#DDBB72] group-hover:translate-x-0.5 transition-all">
                      Run →
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-[#F5F1E8] group-hover:text-[#DDBB72] transition-colors leading-snug">
                    {action.title}
                  </h4>

                  <p className="text-xs text-[#C8C1B4] line-clamp-2 mt-1.5 leading-relaxed">
                    {action.detail}
                  </p>
                </div>

                {/* Micro-Visual representation */}
                <div className="mt-4 pt-3 border-t border-[#3A3831] flex items-center justify-between">
                  {action.visualType === "sales-trend" && (
                    <div className="w-full flex items-center justify-between text-[11px] text-[#9E988C]">
                      <span className="text-[#43A66A] font-semibold flex items-center gap-1">
                        <TrendingUp className="size-3" /> +14.2% trajectory
                      </span>
                      {/* Mini Sparkline Vector */}
                      <svg className="w-16 h-5" viewBox="0 0 64 20" fill="none">
                        <path
                          d="M2 16 L16 14 L30 8 L44 11 L62 3"
                          stroke="#C49A45"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}

                  {action.visualType === "stock-health" && (
                    <div className="w-full flex items-center justify-between text-[11px] text-[#9E988C]">
                      <span className="text-[#DDBB72]">Inventory check</span>
                      {/* Mini Stock Segments */}
                      <div className="flex gap-1">
                        <div className="w-4 h-2 rounded bg-[#43A66A]" title="Healthy Stock" />
                        <div className="w-3 h-2 rounded bg-[#C79338]" title="Low Threshold" />
                        <div className="w-2 h-2 rounded bg-[#D05A4A]" title="Depleted" />
                      </div>
                    </div>
                  )}

                  {action.visualType === "listing-draft" && (
                    <div className="w-full flex items-center justify-between text-[11px] text-[#9E988C]">
                      <span className="text-[#C8C1B4]">Silk Saree Copy</span>
                      <div className="flex items-center gap-1 text-[#DDBB72]">
                        <Wand2 className="size-3.5" />
                        <span className="text-[10px]">SEO ready</span>
                      </div>
                    </div>
                  )}

                  {action.visualType === "broadcast-wave" && (
                    <div className="w-full flex items-center justify-between text-[11px] text-[#9E988C]">
                      <span className="text-[#43A66A]">WhatsApp</span>
                      <div className="flex items-center gap-1 text-[#43A66A]">
                        <Radio className="size-3 animate-pulse" />
                        <span className="text-[10px]">Broadcast</span>
                      </div>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          MAIN CHAT WORKSPACE WINDOW
          ========================================================================= */}
      <Card
        variant="surface"
        padding="none"
        radius="xl"
        className="border-[#444139] bg-[#2B2A25] shadow-lg overflow-hidden flex flex-col h-[620px]"
      >
        {/* Workspace Top Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#3A3831] bg-[#1C1B18]/90">
          <div className="flex items-center gap-2.5">
            <div className="size-7 rounded-lg bg-[#35332C] border border-[#5A4725] grid place-items-center">
              <Bot className="size-4 text-[#C49A45]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#F5F1E8]">Copilot Active Session</span>
                <span className="size-1.5 rounded-full bg-[#43A66A]" />
              </div>
              <p className="text-[11px] text-[#9E988C]">
                Connected to store inventory, orders, analytics & promotion engines
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={initConversation}
              disabled={isThinking}
              title="Reset session"
              className="h-8 px-2.5 text-xs text-[#C8C1B4] hover:text-[#F5F1E8] hover:bg-[#35332C]"
            >
              <RotateCcw className="size-3.5 text-[#C49A45]" />
              <span className="hidden sm:inline">Reset</span>
            </Button>
          </div>
        </div>

        {/* Message Stream Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#24231F]/50">
          {conversation?.messages.map((msg) => (
            <div key={msg.id} className="space-y-2">
              {msg.role === "user" ? (
                /* User Prompt Bubble */
                <div className="flex justify-end">
                  <div className="max-w-[85%] sm:max-w-[75%] rounded-2xl rounded-tr-xs bg-[#C49A45] px-4 py-2.5 text-sm font-medium text-[#151515] shadow-sm">
                    {msg.content}
                  </div>
                </div>
              ) : (
                /* Assistant Bubble */
                <div className="flex flex-col gap-2 max-w-[92%] sm:max-w-[85%]">
                  {/* Tool Execution Status Badge */}
                  {msg.toolCall && (
                    <div className="inline-flex items-center gap-1.5 self-start px-2.5 py-1 rounded-pill bg-[#1C1B18] border border-[#444139] text-xs text-[#C8C1B4] shadow-xs">
                      {msg.toolCall.status === "running" ? (
                        <>
                          <Loader2 className="size-3 animate-spin text-[#C49A45]" />
                          <span className="font-mono text-[11px] text-[#DDBB72]">
                            Executing: {msg.toolCall.name}…
                          </span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="size-3 text-[#43A66A]" />
                          <span className="font-mono text-[11px] text-[#C8C1B4]">
                            Verified tool: {msg.toolCall.name}
                          </span>
                        </>
                      )}
                    </div>
                  )}

                  {/* Message Content Container */}
                  <div className="rounded-2xl rounded-tl-xs border border-[#444139] bg-[#2B2A25] p-4 sm:p-5 text-sm text-[#F5F1E8] shadow-sm space-y-3.5">
                    <div className="prose prose-sm dark:prose-invert max-w-none text-[#F5F1E8] leading-relaxed whitespace-pre-line">
                      {msg.content}
                    </div>

                    {/* Structured Data: Merchant Sales Summary */}
                    {msg.structuredData?.type === "merchant_sales_summary" && (
                      <div className="p-4 rounded-xl border border-[#444139] bg-[#24231F] space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-[#DDBB72]">
                            Live Sales Performance
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#43A66A]">
                            <TrendingUp className="size-3.5" />
                            +{msg.structuredData.data.salesChangePercent}% vs yesterday
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-center">
                          <div className="p-2.5 rounded-lg bg-[#2B2A25] border border-[#444139]">
                            <span className="text-[11px] text-[#9E988C] block">Gross Revenue</span>
                            <span className="font-display text-base font-bold text-[#F5F1E8]">
                              {formatPrice(msg.structuredData.data.todaySales)}
                            </span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-[#2B2A25] border border-[#444139]">
                            <span className="text-[11px] text-[#9E988C] block">Total Orders</span>
                            <span className="font-display text-base font-bold text-[#F5F1E8]">
                              {msg.structuredData.data.todayOrders}
                            </span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-[#2B2A25] border border-[#444139]">
                            <span className="text-[11px] text-[#9E988C] block">Pending Dispatch</span>
                            <span className="font-display text-base font-bold text-[#DDBB72]">
                              {msg.structuredData.data.pendingOrdersCount}
                            </span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-[#2B2A25] border border-[#444139]">
                            <span className="text-[11px] text-[#9E988C] block">Low Stock Alert</span>
                            <span className="font-display text-base font-bold text-[#D05A4A]">
                              {msg.structuredData.data.lowStockCount} items
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Structured Data: Product Recommendations */}
                    {msg.structuredData?.type === "product_recommendations" && (
                      <div className="space-y-2.5 pt-2 border-t border-[#3A3831]">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#DDBB72] block">
                          Curated Artisan Products ({msg.structuredData.data.length})
                        </span>
                        <div className="grid grid-cols-1 gap-2.5">
                          {msg.structuredData.data.map((product) => (
                            <AIProductCard key={product.productId} product={product} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Structured Data: Action Confirmation */}
                    {msg.structuredData?.type === "write_action_confirmation" && (
                      <div className="pt-2 border-t border-[#3A3831]">
                        <AIActionConfirmation
                          messageId={msg.id}
                          action={msg.structuredData.data}
                          onConfirm={handleConfirmAction}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Live Streaming Message Display */}
          {streamingText && (
            <div className="flex flex-col gap-2 max-w-[85%]">
              <div className="rounded-2xl rounded-tl-xs border border-[#444139] bg-[#2B2A25] p-4 text-sm text-[#F5F1E8] shadow-sm">
                <div className="whitespace-pre-line leading-relaxed">{streamingText}</div>
              </div>
            </div>
          )}

          {/* Active Thinking / Tool Calling State */}
          {isThinking && !streamingText && (
            <div className="flex items-center gap-2.5 text-xs text-[#C8C1B4] bg-[#1C1B18] p-3 rounded-xl border border-[#444139] w-fit shadow-sm">
              <Loader2 className="size-3.5 animate-spin text-[#C49A45]" />
              {activeToolName ? (
                <span>
                  Querying store service: <strong className="font-mono text-[#DDBB72]">{activeToolName}</strong>…
                </span>
              ) : (
                <span>Bhagya AI is analyzing store telemetry…</span>
              )}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar & Safe Boundary Notice */}
        <div className="p-3.5 sm:p-4 border-t border-[#3A3831] bg-[#1C1B18]">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask anything: 'Summarize today's sales', 'Which SKUs are low stock?', 'Draft WhatsApp copy'…"
              disabled={isThinking}
              className="flex-1 rounded-xl border border-[#444139] bg-[#24231F] px-4 py-2.5 text-sm text-[#F5F1E8] placeholder:text-[#9E988C] focus:border-[#C49A45] focus:outline-none transition-colors"
            />

            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={!inputValue.trim() || isThinking}
              className="size-10 p-0 rounded-xl shrink-0 bg-[#C49A45] hover:bg-[#DDBB72] text-[#151515] disabled:opacity-50"
            >
              {isThinking ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
            </Button>
          </form>

          <div className="flex items-center justify-between text-[11px] text-[#9E988C] mt-2 px-1">
            <span className="flex items-center gap-1">
              <Lock className="size-3 text-[#43A66A]" />
              Safe read/write operational boundaries
            </span>
            <span className="hidden sm:inline">Press Enter to send</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
