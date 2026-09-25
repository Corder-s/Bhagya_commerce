/**
 * Bhagya Commerce — Mock AI Provider (Step 10)
 *
 * Simulates an intelligent agent orchestrator executing safe tools
 * and streaming structured responses.
 *
 * Clearly isolated so it can be swapped for Spring Boot / Python Agent API later.
 */

import { SEED_MERCHANT_PRODUCTS, SEED_OVERVIEW_METRICS } from "@/data/merchant-dashboard";
import type {
  AIMessage,
  AIProductRecommendation,
  AIRequestContext,
  AIStructuredData,
  AIToolCall,
} from "@/features/ai/types/ai.types";

const CATALOG_RECOMMENDATIONS: AIProductRecommendation[] = [
  {
    productId: "p1",
    name: "Handloom Chanderi Silk Saree",
    slug: "handloom-cotton-throw-indigo",
    category: "Handloom & Textiles",
    price: 3850,
    mrp: 4500,
    imageSrc: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80",
    reason: "Woven with pure zari by master weavers in Madhya Pradesh; lightweight and breathable.",
    rating: 4.9,
    inStock: true,
  },
  {
    productId: "p2",
    name: "Moradabad Brass Pooja Diya",
    slug: "unpolished-millet-grain-blend",
    category: "Brassware & Metalcraft",
    price: 1250,
    mrp: 1600,
    imageSrc: "https://images.unsplash.com/photo-1606293926075-69a00dbfde81?w=600&auto=format&fit=crop&q=80",
    reason: "Hand-cast heavy virgin brass with antique lacquer finish for daily pooja rituals.",
    rating: 4.8,
    inStock: true,
  },
  {
    productId: "p3",
    name: "Pure Mysore Sandalwood Dhoop",
    slug: "ashwagandha-churna",
    category: "Ayurveda & Wellness",
    price: 450,
    mrp: 550,
    imageSrc: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&auto=format&fit=crop&q=80",
    reason: "100% natural, charcoal-free temple grade dhoop handcrafted by Karnataka women artisans.",
    rating: 5.0,
    inStock: true,
  },
];

export class MockAIProvider {
  /**
   * Process a customer or merchant message and return an AI response with potential tool calls & structured data.
   */
  async processRequest(
    request: AIRequestContext,
    onChunk?: (partialText: string) => void,
    onToolCall?: (tool: AIToolCall) => void,
  ): Promise<AIMessage> {
    const query = request.message.trim().toLowerCase();
    const isCustomer = request.mode === "customer";

    let responseContent = "";
    let toolCall: AIToolCall | undefined;
    let structuredData: AIStructuredData | undefined;

    if (isCustomer) {
      // 1. Customer: Order Tracking & Status
      if (query.includes("track") || query.includes("where is my order") || query.includes("order status") || query.includes("ord-")) {
        toolCall = {
          id: `tc_${Date.now()}`,
          name: "getOrderTracking",
          status: "running",
          input: { orderId: "ORD-2026-9812" },
        };
        onToolCall?.(toolCall);
        await new Promise((r) => setTimeout(r, 450));
        toolCall.status = "completed";
        onToolCall?.(toolCall);

        responseContent =
          "I looked up your active order **ORD-2026-9812**. It is currently **Out for Delivery** with Delhivery Express in Bengaluru. The courier executive is scheduled to deliver it today before 6:00 PM.";

        structuredData = {
          type: "order_lookup",
          data: {
            orderNumber: "ORD-2026-9812",
            status: "out_for_delivery",
            total: 3850,
            itemCount: 2,
            carrier: "Delhivery Express",
            trackingNumber: "DLH-99281745",
            eta: "Today by 6:00 PM",
            currentStepIndex: 3,
            statusDescription: "Out for delivery with courier agent Rajesh K.",
            shippingCity: "Bengaluru, Karnataka",
          },
        };
      }
      // 2. Customer: Product Contextual Questions (when product context is passed)
      else if (request.customerContext?.productName && (query.includes("material") || query.includes("care") || query.includes("made") || query.includes("this product"))) {
        const pName = request.customerContext.productName;
        responseContent = `Here are the authentic artisan craft details for **${pName}**:\n\n- **Craft Heritage:** Handcrafted in India by certified master artisan clusters.\n- **Materials:** 100% natural, ethically sourced and chemical-free.\n- **Care Instructions:** Dry clean or gentle handwash with mild organic detergent. Avoid direct harsh sunlight when drying.\n- **Delivery & Returns:** Dispatched within 24-48 hours with 7-day hassle-free doorstep returns.`;
      }
      // 3. Customer: Product Recommendations (pooja, saree, gifts, natural, silk)
      else if (
        query.includes("recommend") ||
        query.includes("buy") ||
        query.includes("pooja") ||
        query.includes("saree") ||
        query.includes("gift") ||
        query.includes("skincare") ||
        query.includes("search")
      ) {
        toolCall = {
          id: `tc_${Date.now()}`,
          name: "searchProducts",
          status: "running",
          input: { query: request.message },
        };
        onToolCall?.(toolCall);
        await new Promise((r) => setTimeout(r, 400));
        toolCall.status = "completed";
        onToolCall?.(toolCall);

        responseContent =
          "I found these authentic handcrafted products matching your request. Each piece is verified for artisan provenance and certified craftsmanship:";

        structuredData = {
          type: "product_recommendations",
          data: CATALOG_RECOMMENDATIONS,
        };
      }
      // 4. Customer: Policies (shipping, returns)
      else if (query.includes("return") || query.includes("policy") || query.includes("shipping") || query.includes("refund")) {
        toolCall = {
          id: `tc_${Date.now()}`,
          name: "getPolicyInfo",
          status: "running",
          input: { topic: "returns" },
        };
        onToolCall?.(toolCall);
        await new Promise((r) => setTimeout(r, 300));
        toolCall.status = "completed";
        onToolCall?.(toolCall);

        responseContent =
          "**Bhagya Assurance & Policies:**\n\n- **7-Day Doorstep Returns:** You can return any eligible handcrafted item within 7 days of delivery.\n- **Free Shipping:** Free standard delivery applies on all orders above ₹1,499 across India.\n- **Artisan Direct:** Every piece is sourced directly from certified clusters, guaranteeing genuine handmade authenticity.\n- **Secure Payments:** 256-bit encrypted UPI, Cards, NetBanking, and Cash on Delivery.";
      }
      // 5. Customer: General Assistant
      else {
        responseContent =
          "Namaste! I am your Bhagya Shopping Assistant. I can help you find authentic handcrafted sarees, brassware, wellness items, track existing orders, or explain craft techniques. What would you like to explore?";
      }
    } else {
      // MERCHANT AI
      // 1. Merchant: Sales & Revenue Overview
      if (query.includes("sale") || query.includes("revenue") || query.includes("today") || query.includes("how is my store")) {
        toolCall = {
          id: `tc_${Date.now()}`,
          name: "getDashboardOverview",
          status: "running",
          input: { storeId: request.merchantContext?.storeId || "store_varanasi_silk" },
        };
        onToolCall?.(toolCall);
        await new Promise((r) => setTimeout(r, 450));
        toolCall.status = "completed";
        onToolCall?.(toolCall);

        responseContent =
          "Here is your live store performance summary for today. Your sales are tracking **+12.4% higher** compared to yesterday with steady demand for silk sarees and temple brassware:";

        structuredData = {
          type: "merchant_sales_summary",
          data: {
            todaySales: SEED_OVERVIEW_METRICS.todaySales,
            todayOrders: SEED_OVERVIEW_METRICS.todayOrders,
            salesChangePercent: SEED_OVERVIEW_METRICS.salesChangePercent ?? 12.4,
            activeProducts: SEED_MERCHANT_PRODUCTS.length,
            pendingOrdersCount: 3,
            lowStockCount: 2,
            topSellingProduct: "Handloom Chanderi Silk Saree",
          },
        };
      }
      // 2. Merchant: Low Stock & Inventory Alerts
      else if (query.includes("stock") || query.includes("inventory") || query.includes("low")) {
        toolCall = {
          id: `tc_${Date.now()}`,
          name: "getInventoryAlerts",
          status: "running",
          input: { storeId: request.merchantContext?.storeId || "store_varanasi_silk" },
        };
        onToolCall?.(toolCall);
        await new Promise((r) => setTimeout(r, 400));
        toolCall.status = "completed";
        onToolCall?.(toolCall);

        responseContent =
          "I identified **2 products** that have reached or fallen below your minimum safety stock threshold. Consider updating inventory to avoid missed orders:";

        structuredData = {
          type: "inventory_warning",
          data: {
            items: [
              {
                productId: "prod_03",
                productName: "Mysore Sandalwood Incense Cones",
                sku: "BNR-INC-03",
                currentStock: 3,
                status: "low_stock",
              },
              {
                productId: "prod_04",
                productName: "Jaipur Blue Pottery Ceramic Vase",
                sku: "BNR-POT-04",
                currentStock: 0,
                status: "out_of_stock",
              },
            ],
          },
        };
      }
      // 3. Merchant: Write Stock Action (Requires Confirmation)
      else if (query.includes("update stock") || query.includes("set stock") || query.includes("restock")) {
        responseContent =
          "I have prepared an inventory update for your catalogue. Because this modifies live store data, please review and confirm the action below:";

        structuredData = {
          type: "write_action_confirmation",
          data: {
            actionType: "update_stock",
            promptMessage: "You are about to increase available stock for 'Mysore Sandalwood Incense Cones' from 3 to 25 units.",
            details: {
              productName: "Mysore Sandalwood Incense Cones",
              productId: "prod_03",
              currentStock: 3,
              newStock: 25,
            },
            status: "pending_confirmation",
          },
        };
      }
      // 4. Merchant: Copywriting (Product Description)
      else if (query.includes("description") || query.includes("write a product") || query.includes("listing")) {
        toolCall = {
          id: `tc_${Date.now()}`,
          name: "generateProductDescription",
          status: "running",
          input: { topic: "Handcrafted Artisan Product" },
        };
        onToolCall?.(toolCall);
        await new Promise((r) => setTimeout(r, 450));
        toolCall.status = "completed";
        onToolCall?.(toolCall);

        responseContent =
          "Here is a curated, high-converting product listing draft tailored for Bhagya discerning buyers:\n\n**Title:** Pure Kanjivaram Mulberry Silk Saree with Real Zari Border\n\n**Story & Craftsmanship:**\n*Hand-woven over three weeks by fourth-generation weavers in Tamil Nadu, this heirloom Kanjivaram saree combines pure mulberry silk with intricate temple korvai borders. Each motif reflects ancient Dravidian architectural motifs.*\n\n**Key Highlights:**\n- 100% Silk Mark certified natural mulberry silk\n- Authentic handloom weaving with contrasting pallu\n- Includes unstitched matching blouse fabric (80cm)\n- Certified eco-friendly natural dye extracts";
      }
      // 5. Merchant: WhatsApp / Marketing Copy
      else if (query.includes("whatsapp") || query.includes("marketing") || query.includes("campaign") || query.includes("social")) {
        responseContent =
          "Here is a ready-to-broadcast WhatsApp campaign template for your festive collection:\n\n✨ *Namaste from [Your Store Name]!* ✨\n\nWe have just refreshed our heirloom handloom collection with 12 exclusive new pieces woven by our master artisans.\n\n🎁 *Festive Offer:* Enjoy **15% off** on your next handcrafted order with code **HERITAGE15**.\n\n👉 *Explore Collection:* https://bhagya.in/stores/varanasi-heritage-silks\n\n_100% authentic craftsmanship delivered directly to your doorstep with 7-day returns._";
      }
      // 6. Merchant: General Overview
      else {
        responseContent =
          "Hello! I am your Bhagya Merchant Copilot. I can analyze today's sales, flag low-stock products, draft artisan product descriptions, write WhatsApp marketing copy, or summarize order dispatches. How can I help your store right now?";
      }
    }

    // Simulate streaming delivery
    if (onChunk) {
      const words = responseContent.split(" ");
      let current = "";
      for (let i = 0; i < words.length; i++) {
        current += (i === 0 ? "" : " ") + words[i];
        if (i % 3 === 0 || i === words.length - 1) {
          onChunk(current);
          await new Promise((r) => setTimeout(r, 25));
        }
      }
    }

    return {
      id: `msg_${Date.now()}`,
      role: "assistant",
      content: responseContent,
      createdAt: new Date().toISOString(),
      toolCall,
      structuredData,
    };
  }
}

export const mockAiProvider = new MockAIProvider();
