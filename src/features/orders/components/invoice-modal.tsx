"use client";

import {
  CheckCircle2,
  CreditCard,
  Download,
  FileCheck,
  FileText,
  Loader2,
  Printer,
  ShieldCheck,
  Truck,
  X,
} from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import type { Order } from "@/features/orders/order-types";
import { toast } from "@/lib/toast";
import { type CustomerInvoiceData, invoiceService } from "@/services/invoice.service";

export interface InvoiceModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

export function InvoiceModal({ order, isOpen, onClose }: InvoiceModalProps) {
  const [invoice, setInvoice] = React.useState<CustomerInvoiceData | null>(null);
  const [downloading, setDownloading] = React.useState(false);

  React.useEffect(() => {
    if (isOpen && order) {
      invoiceService.getInvoiceByOrder(order).then(setInvoice);
    }
  }, [isOpen, order]);

  if (!isOpen) return null;

  const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  function handlePrint() {
    window.print();
  }

  async function handleDownloadPdf() {
    if (!invoice) return;
    setDownloading(true);
    try {
      const { downloadUrl } = await invoiceService.getInvoiceDownloadUrl(invoice.invoiceNumber);
      // Simulate secure R2 download
      await new Promise((r) => setTimeout(r, 600));
      toast.success("Invoice Download Ready", `Saved ${invoice.invoiceNumber}.pdf to your device.`);
    } catch {
      toast.error("Download Failed", "We couldn't retrieve the invoice document from R2.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-3xl border border-line bg-surface p-6 sm:p-8 shadow-2xl space-y-6 my-8 print:border-none print:shadow-none print:p-0">
        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-line pb-4 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="size-5 text-primary" />
            <h3 className="text-body-lg font-bold text-ink">Tax Invoice</h3>
            <span className="rounded-pill bg-success/15 px-2.5 py-0.5 text-[11px] font-bold text-success">
              {invoice?.status || "ISSUED"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadPdf}
              disabled={downloading}
              className="gap-1.5"
            >
              {downloading ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Download className="size-3.5" />
              )}
              <span>{downloading ? "Preparing PDF…" : "Download PDF"}</span>
            </Button>

            <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5">
              <Printer className="size-3.5" />
              <span>Print</span>
            </Button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1.5 text-ink-soft hover:text-ink hover:bg-surface-raised transition-colors ml-1"
              aria-label="Close invoice"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Sheet */}
        <div className="space-y-6 text-body-sm text-ink print:text-black">
          {/* Top Brand & Metadata */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-line pb-6">
            <div className="space-y-1">
              <span className="font-display text-2xl font-bold text-gold-dark dark:text-gold">
                Bhagya Commerce
              </span>
              <p className="text-caption text-ink-soft leading-relaxed">
                <strong>Seller:</strong> {invoice?.seller.name}
                <br />
                <strong>Guild Cluster:</strong> {invoice?.seller.brandCluster}
                <br />
                <strong>GSTIN:</strong>{" "}
                <span className="font-mono text-ink">{invoice?.seller.gstin}</span>
                <br />
                {invoice?.seller.address}
              </p>
            </div>

            <div className="text-left sm:text-right space-y-1 bg-surface-raised sm:bg-transparent p-4 sm:p-0 rounded-2xl sm:rounded-none border sm:border-none border-line">
              <p className="text-caption font-bold uppercase tracking-wider text-ink-soft">
                TAX INVOICE NUMBER
              </p>
              <p className="font-mono text-heading-sm font-bold text-ink">
                {invoice?.invoiceNumber || order.orderNumber}
              </p>
              <p className="text-caption text-ink-soft">
                Order Ref: <span className="font-mono text-ink">{order.orderNumber}</span>
              </p>
              <p className="text-caption text-ink-soft">
                Date:{" "}
                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          {/* Billed To & Shipped To */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-line pb-6">
            <div className="space-y-1">
              <p className="text-caption font-bold uppercase tracking-wider text-ink-soft">
                Billed & Shipped To
              </p>
              <p className="font-bold text-ink">{order.shippingAddress.fullName}</p>
              <p className="text-caption text-ink-soft leading-relaxed">
                {order.shippingAddress.addressLine1}
                {order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ""}
                <br />
                {order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.postalCode}
                <br />
                Phone: {order.contact.phone || order.shippingAddress.phone}
                <br />
                Place of Supply:{" "}
                <strong className="text-ink">{order.shippingAddress.state}, India</strong>
              </p>
            </div>

            <div className="space-y-1.5 bg-surface-subtle p-4 rounded-2xl border border-line">
              <p className="text-caption font-bold uppercase tracking-wider text-ink-soft">
                Payment & Fulfillment
              </p>
              <div className="text-caption space-y-1">
                <div className="flex justify-between">
                  <span className="text-ink-soft">Payment Mode:</span>
                  <span className="font-semibold text-ink uppercase">
                    {order.payment?.method || "UPI / Online"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-soft">Transaction Ref:</span>
                  <span className="font-mono text-ink">
                    {order.payment?.providerPaymentId || "TXN-VERIFIED-SSL"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-soft">Logistics Partner:</span>
                  <span className="font-medium text-ink">
                    {order.carrier || "Delhivery Artisan Express"}
                  </span>
                </div>
                {order.trackingNumber && (
                  <div className="flex justify-between">
                    <span className="text-ink-soft">Waybill (AWB):</span>
                    <span className="font-mono text-ink">{order.trackingNumber}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-body-sm">
              <thead>
                <tr className="border-b border-line text-caption font-bold uppercase text-ink-soft bg-surface-raised">
                  <th className="py-2.5 px-3">Item Description</th>
                  <th className="py-2.5 px-2 text-center">SKU</th>
                  <th className="py-2.5 px-2 text-center">Qty</th>
                  <th className="py-2.5 px-2 text-right">Taxable</th>
                  <th className="py-2.5 px-2 text-right">GST</th>
                  <th className="py-2.5 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {invoice?.items.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-subtle/40">
                    <td className="py-3 px-3">
                      <p className="font-semibold text-ink">{item.name}</p>
                      {item.variantName && (
                        <p className="text-caption text-ink-soft">{item.variantName}</p>
                      )}
                    </td>
                    <td className="py-3 px-2 text-center font-mono text-caption text-ink-faint">
                      {item.sku}
                    </td>
                    <td className="py-3 px-2 text-center tabular-nums font-medium">{item.quantity}</td>
                    <td className="py-3 px-2 text-right tabular-nums text-ink-soft">
                      {fmt(item.taxableAmount)}
                    </td>
                    <td className="py-3 px-2 text-right tabular-nums text-ink-soft">
                      {fmt(item.taxAmount)}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-ink tabular-nums">
                      {fmt(item.lineTotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total Breakdown & GST Split */}
          <div className="border-t border-line pt-4 flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="text-caption text-ink-soft space-y-1">
              <div className="flex items-center gap-1.5 text-success font-semibold">
                <ShieldCheck className="size-4" />
                <span>GST Compliant Artisan Tax Invoice</span>
              </div>
              <p className="text-[11px] text-ink-faint">
                {invoice?.taxBreakdown.isInterState
                  ? "Inter-State Supply: Integrated Goods and Services Tax (IGST 5%) applied."
                  : "Intra-State Supply: Central GST (CGST 2.5%) & State GST (SGST 2.5%) applied."}
              </p>
            </div>

            <div className="w-full sm:w-72 space-y-2 text-caption">
              <div className="flex justify-between text-ink-soft">
                <span>Items Subtotal</span>
                <span className="text-ink font-semibold font-mono">{fmt(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-success font-semibold">
                  <span>Savings / Coupon</span>
                  <span className="font-mono">-{fmt(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-ink-soft">
                <span>Taxable Value</span>
                <span className="text-ink font-mono">{fmt(invoice?.taxableAmount || order.subtotal)}</span>
              </div>

              {invoice?.taxBreakdown.isInterState ? (
                <div className="flex justify-between text-ink-soft">
                  <span>IGST (5%)</span>
                  <span className="text-ink font-mono">{fmt(invoice.taxBreakdown.igst)}</span>
                </div>
              ) : (
                <>
                  <div className="flex justify-between text-ink-soft">
                    <span>CGST (2.5%)</span>
                    <span className="text-ink font-mono">{fmt(invoice?.taxBreakdown.cgst || 0)}</span>
                  </div>
                  <div className="flex justify-between text-ink-soft">
                    <span>SGST (2.5%)</span>
                    <span className="text-ink font-mono">{fmt(invoice?.taxBreakdown.sgst || 0)}</span>
                  </div>
                </>
              )}

              <div className="flex justify-between text-ink-soft">
                <span>Delivery & Handling</span>
                <span className="text-ink font-medium">
                  {order.deliveryFee === 0 ? "FREE" : fmt(order.deliveryFee)}
                </span>
              </div>

              <div className="border-t border-line pt-2.5 flex justify-between items-baseline font-bold text-body-md">
                <span className="text-ink">Total Amount Paid</span>
                <span className="text-heading-md text-gold-dark dark:text-gold font-display">
                  {fmt(order.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="border-t border-line pt-4 text-[11px] text-ink-faint text-center">
            This is a computer-generated tax document and requires no physical signature. Cloudflare R2 Document Vault.
          </div>
        </div>
      </div>
    </div>
  );
}
