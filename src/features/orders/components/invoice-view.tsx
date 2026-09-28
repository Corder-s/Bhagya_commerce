"use client";

import {
  ArrowLeft,
  CheckCircle2,
  Download,
  FileText,
  Loader2,
  Printer,
  ShieldCheck,
  Truck,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Order } from "@/features/orders/order-types";
import { toast } from "@/lib/toast";
import { type CustomerInvoiceData, invoiceService } from "@/services/invoice.service";

export function InvoiceView({ order }: { order: Order }) {
  const [invoice, setInvoice] = React.useState<CustomerInvoiceData | null>(null);
  const [downloading, setDownloading] = React.useState(false);

  React.useEffect(() => {
    if (order) {
      invoiceService.getInvoiceByOrder(order).then(setInvoice);
    }
  }, [order]);

  const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  function handlePrint() {
    window.print();
  }

  async function handleDownloadPdf() {
    if (!invoice) return;
    setDownloading(true);
    try {
      await invoiceService.getInvoiceDownloadUrl(invoice.invoiceNumber);
      await new Promise((r) => setTimeout(r, 600));
      toast.success("Invoice Downloaded", `Saved ${invoice.invoiceNumber}.pdf to your device.`);
    } catch {
      toast.error("Download Failed", "Could not retrieve the document from R2 vault.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Top action bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <Button asChild variant="ghost" size="sm" className="gap-2 text-ink-soft hover:text-ink">
          <Link href={`/orders/${order.id}`}>
            <ArrowLeft className="size-4" />
            <span>Back to Order Details</span>
          </Link>
        </Button>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="md"
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="gap-2"
          >
            {downloading ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
            <span>{downloading ? "Generating PDF…" : "Download PDF"}</span>
          </Button>

          <Button variant="primary" size="md" onClick={handlePrint} className="gap-2">
            <Printer className="size-4" />
            <span>Print Invoice</span>
          </Button>
        </div>
      </div>

      {/* Invoice Card Sheet */}
      <Card variant="surface" padding="none" radius="lg" className="border-line shadow-card overflow-hidden print:border-none print:shadow-none">
        <div className="p-6 sm:p-10 space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-line pb-8">
            <div className="space-y-1.5">
              <h2 className="font-display text-3xl font-bold text-gold-dark dark:text-gold">
                Bhagya Commerce
              </h2>
              <p className="text-body-sm text-ink-soft leading-relaxed">
                <strong>Seller:</strong> {invoice?.seller.name}
                <br />
                <strong>Cluster:</strong> {invoice?.seller.brandCluster}
                <br />
                <strong>GSTIN:</strong> <span className="font-mono text-ink">{invoice?.seller.gstin}</span>
                <br />
                {invoice?.seller.address}
              </p>
            </div>

            <div className="text-left sm:text-right space-y-1 bg-surface-raised sm:bg-transparent p-4 sm:p-0 rounded-2xl border sm:border-none border-line">
              <span className="text-caption font-bold uppercase tracking-wider text-ink-soft">
                TAX INVOICE
              </span>
              <p className="font-mono text-heading-md font-bold text-ink">
                {invoice?.invoiceNumber || order.orderNumber}
              </p>
              <p className="text-caption text-ink-soft">
                Order: <span className="font-mono text-ink">{order.orderNumber}</span>
              </p>
              <p className="text-caption text-ink-soft">
                Date:{" "}
                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Parties & Logistics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-line pb-8">
            <div className="space-y-1.5">
              <p className="text-caption font-bold uppercase tracking-wider text-ink-soft">
                Billed & Shipped To
              </p>
              <p className="text-body-md font-bold text-ink">{order.shippingAddress.fullName}</p>
              <p className="text-caption text-ink-soft leading-relaxed">
                {order.shippingAddress.addressLine1}
                {order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ""}
                <br />
                {order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.postalCode}
                <br />
                Phone: {order.contact.phone || order.shippingAddress.phone}
              </p>
            </div>

            <div className="bg-surface-subtle p-5 rounded-2xl border border-line space-y-2 text-caption">
              <p className="font-bold uppercase tracking-wider text-ink-soft">
                Payment & Fulfillment
              </p>
              <div className="flex justify-between">
                <span className="text-ink-soft">Payment Method:</span>
                <span className="font-bold text-ink uppercase">{order.payment?.method || "UPI"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Txn Reference:</span>
                <span className="font-mono text-ink">{order.payment?.providerPaymentId || "TXN-SECURE"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Logistics Partner:</span>
                <span className="font-semibold text-ink">{order.carrier || "Delhivery"}</span>
              </div>
              {order.trackingNumber && (
                <div className="flex justify-between">
                  <span className="text-ink-soft">AWB Tracking:</span>
                  <span className="font-mono text-ink">{order.trackingNumber}</span>
                </div>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-body-sm">
              <thead>
                <tr className="border-b border-line text-caption font-bold uppercase text-ink-soft bg-surface-raised">
                  <th className="py-3 px-3">Item Description</th>
                  <th className="py-3 px-2 text-center">SKU</th>
                  <th className="py-3 px-2 text-center">Qty</th>
                  <th className="py-3 px-2 text-right">Taxable</th>
                  <th className="py-3 px-2 text-right">GST (5%)</th>
                  <th className="py-3 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {invoice?.items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-3.5 px-3">
                      <p className="font-bold text-ink">{item.name}</p>
                      {item.variantName && (
                        <p className="text-caption text-ink-soft">{item.variantName}</p>
                      )}
                    </td>
                    <td className="py-3.5 px-2 text-center font-mono text-caption text-ink-faint">
                      {item.sku}
                    </td>
                    <td className="py-3.5 px-2 text-center tabular-nums font-semibold">{item.quantity}</td>
                    <td className="py-3.5 px-2 text-right tabular-nums text-ink-soft">
                      {fmt(item.taxableAmount)}
                    </td>
                    <td className="py-3.5 px-2 text-right tabular-nums text-ink-soft">
                      {fmt(item.taxAmount)}
                    </td>
                    <td className="py-3.5 px-3 text-right font-bold text-ink tabular-nums">
                      {fmt(item.lineTotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Breakdown */}
          <div className="border-t border-line pt-6 flex flex-col sm:flex-row justify-between items-start gap-6">
            <div className="space-y-1 text-caption text-ink-soft">
              <div className="flex items-center gap-1.5 text-success font-bold">
                <ShieldCheck className="size-4" />
                <span>Verified GST Compliance</span>
              </div>
              <p className="text-[11px] text-ink-faint">
                {invoice?.taxBreakdown.isInterState
                  ? "Integrated GST (IGST 5%) applied for inter-state supply."
                  : "Central GST (CGST 2.5%) & State GST (SGST 2.5%) applied for intra-state supply."}
              </p>
            </div>

            <div className="w-full sm:w-80 space-y-2 text-body-sm">
              <div className="flex justify-between text-ink-soft">
                <span>Items Subtotal</span>
                <span className="font-mono text-ink">{fmt(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-success font-semibold">
                  <span>Savings / Discount</span>
                  <span className="font-mono">-{fmt(order.discount)}</span>
                </div>
              )}
              {invoice?.taxBreakdown.isInterState ? (
                <div className="flex justify-between text-ink-soft">
                  <span>IGST (5%)</span>
                  <span className="font-mono text-ink">{fmt(invoice.taxBreakdown.igst)}</span>
                </div>
              ) : (
                <>
                  <div className="flex justify-between text-ink-soft">
                    <span>CGST (2.5%)</span>
                    <span className="font-mono text-ink">{fmt(invoice?.taxBreakdown.cgst || 0)}</span>
                  </div>
                  <div className="flex justify-between text-ink-soft">
                    <span>SGST (2.5%)</span>
                    <span className="font-mono text-ink">{fmt(invoice?.taxBreakdown.sgst || 0)}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between text-ink-soft">
                <span>Delivery & Logistics</span>
                <span className="text-ink font-medium">
                  {order.deliveryFee === 0 ? "FREE" : fmt(order.deliveryFee)}
                </span>
              </div>
              <div className="border-t border-line pt-3 flex justify-between items-baseline font-bold">
                <span className="text-ink">Grand Total</span>
                <span className="text-heading-lg text-gold-dark dark:text-gold font-display">
                  {fmt(order.total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
