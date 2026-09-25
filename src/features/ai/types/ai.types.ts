/**
 * Bhagya Commerce — AI Platform Domain Types (Step 10)
 *
 * Core abstractions for Customer AI Shopping Assistant and Merchant AI Copilot.
 * Shared tool-based architecture preparing for future Spring Boot / Python Agent Orchestrator.
 */

export type AIMode = "customer" | "merchant";

export type AIMessageRole = "user" | "assistant" | "system" | "tool";

export type AIToolStatus = "pending" | "running" | "completed" | "failed";

export interface AIToolCall {
  id: string;
  name: string;
  status: AIToolStatus;
  input?: Record<string, unknown>;
  output?: Record<string, unknown>;
}

export interface AIProductRecommendation {
  productId: string;
  name: string;
  slug: string;
  category?: string;
  price: number;
  mrp?: number;
  imageSrc: string;
  reason: string;
  rating?: number;
  inStock?: boolean;
}

export interface AIOrderLookupData {
  orderNumber: string;
  status: string;
  total: number;
  itemCount: number;
  carrier?: string;
  trackingNumber?: string;
  eta?: string;
  currentStepIndex: number;
  statusDescription: string;
  shippingCity: string;
}

export interface AIMerchantSalesSummary {
  todaySales: number;
  todayOrders: number;
  salesChangePercent: number;
  activeProducts: number;
  pendingOrdersCount: number;
  lowStockCount: number;
  topSellingProduct: string;
}

export interface AIInventoryWarningData {
  items: Array<{
    productId: string;
    productName: string;
    sku: string;
    currentStock: number;
    status: "low_stock" | "out_of_stock";
  }>;
}

export interface AIWriteActionData {
  actionType: "update_stock" | "cancel_order" | "update_store";
  promptMessage: string;
  details: Record<string, unknown>;
  status: "pending_confirmation" | "confirmed" | "cancelled" | "executed";
}

export type AIStructuredData =
  | { type: "product_recommendations"; data: AIProductRecommendation[] }
  | { type: "order_lookup"; data: AIOrderLookupData }
  | { type: "merchant_sales_summary"; data: AIMerchantSalesSummary }
  | { type: "inventory_warning"; data: AIInventoryWarningData }
  | { type: "write_action_confirmation"; data: AIWriteActionData };

export interface AIMessage {
  id: string;
  role: AIMessageRole;
  content: string;
  createdAt: string;
  toolCall?: AIToolCall;
  structuredData?: AIStructuredData;
  isStreaming?: boolean;
}

export interface CustomerAIContext {
  userId?: string;
  userName?: string;
  currentRoute?: string;
  productId?: string;
  productName?: string;
  cartItemCount?: number;
  currentOrderId?: string;
  recentOrderIds?: string[];
}

export interface MerchantAIContext {
  userId?: string;
  storeId?: string;
  storeName?: string;
  currentRoute?: string;
  selectedProductId?: string;
}

export interface AIRequestContext {
  mode: AIMode;
  conversationId: string;
  message: string;
  customerContext?: CustomerAIContext;
  merchantContext?: MerchantAIContext;
}

export interface AIConversation {
  id: string;
  title: string;
  mode: AIMode;
  messages: AIMessage[];
  createdAt: string;
  updatedAt: string;
}

export type AIToolCategory = "read" | "write";

export interface AIToolDefinition {
  name: string;
  description: string;
  category: AIToolCategory;
  requiresConfirmation: boolean;
  parameters: Record<string, { type: string; description: string; required?: boolean }>;
}

export interface AISuggestedPrompt {
  id: string;
  label: string;
  prompt: string;
  category?: "shopping" | "orders" | "sales" | "inventory" | "content";
}
