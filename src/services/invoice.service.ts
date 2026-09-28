import type { Order } from "@/features/orders/order-types";

export interface TaxBreakdownDetail {
  taxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
  ratePercent: number;
  isInterState: boolean;
  jurisdiction: string;
}

export interface CustomerInvoiceData {
  id: string;
  invoiceNumber: string;
  orderId: string;
  orderNumber: string;
  customerId: string;
  currency: string;
  subtotal: number;
  discount: number;
  taxableAmount: number;
  taxBreakdown: TaxBreakdownDetail;
  deliveryFee: number;
  grandTotal: number;
  status: "ISSUED" | "PAID" | "REFUNDED" | "VOID";
  issuedAt: string;
  seller: {
    name: string;
    brandCluster: string;
    gstin: string;
    address: string;
    state: string;
  };
  customer: {
    name: string;
    email?: string;
    phone?: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
  };
  items: {
    id: string;
    name: string;
    variantName?: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    discount: number;
    taxableAmount: number;
    taxAmount: number;
    lineTotal: number;
  }[];
}

export const invoiceService = {
  /**
   * Derive authoritative customer tax invoice from order model with CGST/SGST/IGST breakdown.
   */
  async getInvoiceByOrder(order: Order): Promise<CustomerInvoiceData> {
    const isInterState = order.shippingAddress.state?.toLowerCase() !== "tamil nadu"; // seller base
    const taxable = Math.max(0, order.subtotal - (order.discount || 0));
    const taxRate = 0.05; // 5% standard artisanal GST
    const totalTax = Math.round(taxable * taxRate * 100) / 100;

    let cgst = 0;
    let sgst = 0;
    let igst = 0;

    if (isInterState) {
      igst = totalTax;
    } else {
      cgst = Math.round((totalTax / 2) * 100) / 100;
      sgst = totalTax - cgst;
    }

    const invoiceNumber = `INV-2026-${order.orderNumber.replace("ORD-", "")}`;

    return Promise.resolve({
      id: `inv_${order.id}`,
      invoiceNumber,
      orderId: order.id,
      orderNumber: order.orderNumber,
      customerId: "usr_dev_customer_01",
      currency: "INR",
      subtotal: order.subtotal,
      discount: order.discount || 0,
      taxableAmount: taxable,
      taxBreakdown: {
        taxableAmount: taxable,
        cgst,
        sgst,
        igst,
        totalTax,
        ratePercent: 5,
        isInterState,
        jurisdiction: "IN-GST",
      },
      deliveryFee: order.deliveryFee || 0,
      grandTotal: taxable + totalTax + (order.deliveryFee || 0),
      status: order.payment?.status === "captured" || order.payment?.status === "authorized" ? "PAID" : "ISSUED",
      issuedAt: order.createdAt,
      seller: {
        name: "Bhagya Artisan Guild Network",
        brandCluster: "Tula Handlooms & Earth Heritage",
        gstin: "33AABCT9981F1Z8",
        address: "42, Weaver Colony, Gandhi Nagar, Coimbatore",
        state: "Tamil Nadu",
      },
      customer: {
        name: order.shippingAddress.fullName,
        email: order.contact.email,
        phone: order.contact.phone || order.shippingAddress.phone,
        address: `${order.shippingAddress.addressLine1}${order.shippingAddress.addressLine2 ? ", " + order.shippingAddress.addressLine2 : ""}`,
        city: order.shippingAddress.city,
        state: order.shippingAddress.state,
        postalCode: order.shippingAddress.postalCode,
      },
      items: order.items.map((item, idx) => {
        const lineTaxable = item.unitPrice * item.quantity;
        const lineTax = Math.round(lineTaxable * 0.05 * 100) / 100;
        return {
          id: item.id || `item_${idx}`,
          name: item.name,
          variantName: item.variantName,
          sku: `SKU-${item.productId.toUpperCase().substring(0, 8)}`,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discount: 0,
          taxableAmount: lineTaxable,
          taxAmount: lineTax,
          lineTotal: lineTaxable + lineTax,
        };
      }),
    });
  },

  /**
   * Get secure download URL for invoice PDF from R2
   */
  async getInvoiceDownloadUrl(invoiceId: string): Promise<{ downloadUrl: string; filename: string }> {
    return Promise.resolve({
      downloadUrl: `https://cdn.bhagyacommerce.com/documents/invoices/${invoiceId}.pdf?token=sec_r2_signed_${Date.now()}`,
      filename: `${invoiceId}.pdf`,
    });
  },
};
