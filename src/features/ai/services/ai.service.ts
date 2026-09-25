/**
 * Bhagya Commerce — AI Domain Service Layer (Step 10)
 *
 * Provider-neutral service abstraction consumed by React components.
 * Bridges UI state with the agent orchestrator (currently MockAIProvider,
 * prepared for Spring Boot / Python Agent API).
 *
 * Future Endpoints:
 *   POST   /api/v1/ai/chat
 *   POST   /api/v1/ai/stream
 *   POST   /api/v1/ai/conversations
 *   GET    /api/v1/ai/conversations
 *   GET    /api/v1/ai/conversations/{id}
 *   DELETE /api/v1/ai/conversations/{id}
 */

import { mockAiProvider } from "@/features/ai/services/mock-ai-provider";
import type {
  AIConversation,
  AIMessage,
  AIMode,
  AIRequestContext,
  AISuggestedPrompt,
  AIToolCall,
  CustomerAIContext,
  MerchantAIContext,
} from "@/features/ai/types/ai.types";

const CUSTOMER_SUGGESTIONS: AISuggestedPrompt[] = [
  { id: "c1", label: "Track my order", prompt: "Where is my recent order?", category: "orders" },
  { id: "c2", label: "Recommend silk sarees", prompt: "Recommend handcrafted silk sarees under ₹4,000", category: "shopping" },
  { id: "c3", label: "Daily pooja essentials", prompt: "What are the best brass items for daily pooja?", category: "shopping" },
  { id: "c4", label: "Return & delivery policy", prompt: "What is the return and delivery policy?", category: "orders" },
];

const MERCHANT_SUGGESTIONS: AISuggestedPrompt[] = [
  { id: "m1", label: "Today's sales summary", prompt: "How are my store sales tracking today?", category: "sales" },
  { id: "m2", label: "Low stock alert", prompt: "Which products are low in stock?", category: "inventory" },
  { id: "m3", label: "Draft product listing", prompt: "Write a high-converting product description for a handloom saree", category: "content" },
  { id: "m4", label: "WhatsApp campaign copy", prompt: "Draft a WhatsApp broadcast for our new festive collection", category: "content" },
  { id: "m5", label: "Update inventory", prompt: "Help me update stock for my sandalwood incense", category: "inventory" },
];

class AIService {
  private conversations: Map<string, AIConversation> = new Map();

  /**
   * Start or initialize an AI conversation
   */
  async startConversation(
    mode: AIMode,
    initialContext?: { customerContext?: CustomerAIContext; merchantContext?: MerchantAIContext },
  ): Promise<AIConversation> {
    const id = `conv_${mode}_${Date.now()}`;
    const initialGreeting =
      mode === "customer"
        ? "Namaste! I am your Bhagya Shopping Assistant. How can I help you find authentic handcrafted products or track your orders today?"
        : "Hello! I am your Bhagya Merchant Copilot. How can I assist with your store sales, inventory alerts, or listing descriptions today?";

    const conversation: AIConversation = {
      id,
      title: mode === "customer" ? "Shopping Assistant" : "Store Copilot",
      mode,
      messages: [
        {
          id: `msg_init_${Date.now()}`,
          role: "assistant",
          content: initialGreeting,
          createdAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.conversations.set(id, conversation);
    return conversation;
  }

  /**
   * Send a user message and receive an AI response (supports streaming callback)
   */
  async sendMessage(
    conversationId: string,
    text: string,
    context?: { customerContext?: CustomerAIContext; merchantContext?: MerchantAIContext },
    onChunk?: (partialText: string) => void,
    onToolCall?: (tool: AIToolCall) => void,
  ): Promise<AIMessage> {
    let conversation = this.conversations.get(conversationId);
    if (!conversation) {
      conversation = await this.startConversation("customer", context);
      conversationId = conversation.id;
    }

    // 1. Add user message
    const userMessage: AIMessage = {
      id: `msg_u_${Date.now()}`,
      role: "user",
      content: text.trim(),
      createdAt: new Date().toISOString(),
    };
    conversation.messages.push(userMessage);

    // 2. Prepare request context
    const requestContext: AIRequestContext = {
      mode: conversation.mode,
      conversationId,
      message: text,
      customerContext: context?.customerContext,
      merchantContext: context?.merchantContext,
    };

    // 3. Process via provider
    const assistantMessage = await mockAiProvider.processRequest(
      requestContext,
      onChunk,
      onToolCall,
    );

    // 4. Save to conversation
    conversation.messages.push(assistantMessage);
    conversation.updatedAt = new Date().toISOString();
    this.conversations.set(conversationId, conversation);

    return assistantMessage;
  }

  /**
   * Execute or reject a write action confirmation (e.g. updating stock)
   */
  async confirmWriteAction(
    conversationId: string,
    messageId: string,
    confirmed: boolean,
  ): Promise<AIMessage> {
    const conversation = this.conversations.get(conversationId);
    if (!conversation) throw new Error("Conversation not found");

    const targetMsg = conversation.messages.find((m) => m.id === messageId);
    if (!targetMsg || targetMsg.structuredData?.type !== "write_action_confirmation") {
      throw new Error("Invalid write action confirmation target");
    }

    targetMsg.structuredData.data.status = confirmed ? "executed" : "cancelled";

    const feedbackMessage: AIMessage = {
      id: `msg_fb_${Date.now()}`,
      role: "assistant",
      content: confirmed
        ? "✅ **Action Executed:** Inventory stock for 'Mysore Sandalwood Incense Cones' has been successfully updated to **25 units** in your live store catalogue."
        : "❌ **Action Cancelled:** Inventory stock adjustment was cancelled. No changes were made to your catalogue.",
      createdAt: new Date().toISOString(),
    };

    conversation.messages.push(feedbackMessage);
    conversation.updatedAt = new Date().toISOString();
    this.conversations.set(conversationId, conversation);

    return feedbackMessage;
  }

  /**
   * Retrieve a conversation by ID
   */
  async getConversation(id: string): Promise<AIConversation | null> {
    return this.conversations.get(id) || null;
  }

  /**
   * List conversations by mode
   */
  async listConversations(mode: AIMode): Promise<AIConversation[]> {
    return Array.from(this.conversations.values())
      .filter((c) => c.mode === mode)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  /**
   * Delete a conversation
   */
  async deleteConversation(id: string): Promise<boolean> {
    return this.conversations.delete(id);
  }

  /**
   * Get contextual prompt suggestions
   */
  getSuggestedPrompts(
    mode: AIMode,
    context?: { customerContext?: CustomerAIContext; merchantContext?: MerchantAIContext },
  ): AISuggestedPrompt[] {
    if (mode === "customer") {
      if (context?.customerContext?.productName) {
        return [
          {
            id: "p_mat",
            label: "What is this made of?",
            prompt: `What materials and craft techniques are used in ${context.customerContext.productName}?`,
          },
          {
            id: "p_care",
            label: "How do I care for it?",
            prompt: `What are the care instructions for ${context.customerContext.productName}?`,
          },
          {
            id: "p_ship",
            label: "Delivery & Returns",
            prompt: `What is the estimated delivery time and return policy for this product?`,
          },
        ];
      }
      return CUSTOMER_SUGGESTIONS;
    }
    return MERCHANT_SUGGESTIONS;
  }
}

export const aiService = new AIService();
