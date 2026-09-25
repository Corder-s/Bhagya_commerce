"use client";

import * as React from "react";
import { Download, FileText, Printer, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Order } from "@/features/orders/order-types";

export interface InvoiceModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

export function InvoiceModal({ order, isOpen, onClose }: InvoiceModalProps) {
  if (!isOpen) return null;

  const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  function handlePrint() {
    window.print();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl border border-line bg-surface p-6 sm:p-8 shadow-2xl space-y-6 my-8">
        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div className="flex items-center gap-2">
            <FileText className="size-5 text-gold-dark dark:text-gold" />
            <h3 className="text-heading-md font-semibold text-ink">Tax Invoice</h3>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5">
              <Printer className="size-3.5" />
              <span>Print</span>
            </Button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-ink-soft hover:text-ink hover:bg-surface-raised transition-colors"
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
            <div>
              <span className="font-display text-xl font-bold text-gold-dark dark:text-gold">
                Bhagya Commerce
              </span>
              <p className="text-caption text-ink-soft mt-1">
                Authentic Indian Artisanal Goods
                <br />
                GSTIN: 09AABCB1234F1Z5
              </p>
            </div>
            <div className="text-left sm:text-right space-y-1">
              <p className="text-caption text-ink-soft">INVOICE NO.</p>
              <p className="font-mono font-bold text-ink">{order.orderNumber}</p>
              <p className="text-caption text-ink-soft">
                Date: {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Billed To & Shipped To */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-line pb-6">
            <div>
              <p className="text-caption font-semibold uppercase tracking-wider text-ink-soft mb-1">
                Billed To
              </p>
              <p className="font-bold text-ink">{order.shippingAddress.fullName}</p>
              <p className="text-caption text-ink-soft leading-relaxed">
                {order.shippingAddress.addressLine1}
                {order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ""}
                <br />
                {order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.postalCode}
                <br />
                Phone: {order.contact.phone || order.shippingAddress.phone}
              </p>
            </div>
            <div>
              <p className="text-caption font-semibold uppercase tracking-wider text-ink-soft mb-1">
                Payment & Logistics
              </p>
              <p className="text-caption text-ink-soft">
                Payment Method:{" "}
                <strong className="text-ink uppercase">{order.payment?.method || "Standard"}</strong>
              </p>
              <p className="text-caption text-ink-soft">
                Payment Status:{" "}
                <strong className="text-ink capitalize">{order.payment?.status || "Confirmed"}</strong>
              </p>
              <p className="text-caption text-ink-soft">
                Carrier:{" "}
                <strong className="text-ink">{order.carrier || order.deliveryMethod.name}</strong>
              </p>
              {order.trackingNumber && (
                <p className="text-caption text-ink-soft font-mono">
                  AWB: {order.trackingNumber}
                </p>
              )}
            </div>
          </div>

          {/* Itemized Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-body-sm">
              <thead>
                <tr className="border-b border-line text-caption font-semibold uppercase text-ink-soft">
                  <th className="py-2.5">Item</th>
                  <th className="py-2.5 text-center">Qty</th>
                  <th className="py-2.5 text-right">Unit Price</th>
                  <th className="py-2.5 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-3">
                      <p className="font-medium text-ink">{item.name}</p>
                      {item.variantName && (
                        <p className="text-caption text-ink-soft">{item.variantName}</p>
                      )}
                      {item.brandName && (
                        <p className="text-[11px] text-ink-faint">Sold by: {item.brandName}</p>
                      )}
                    </td>
                    <td className="py-3 text-center tabular-nums">{item.quantity}</td>
                    <td className="py-3 text-right tabular-nums">{fmt(item.unitPrice)}</td>
                    <td className="py-3 text-right font-medium text-ink tabular-nums">
                      {fmt(item.unitPrice * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total Breakdown */}
          <div className="border-t border-line pt-4 flex justify-end">
            <div className="w-64 space-y-2 text-caption">
              <div className="flex justify-between text-ink-soft">
                <span>Subtotal</span>
                <span className="text-ink font-medium">{fmt(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-success font-medium">
                  <span>Savings / Discount</span>
                  <span>-{fmt(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-ink-soft">
                <span>Delivery Charges</span>
                <span className="text-ink font-medium">
                  {order.deliveryFee === 0 ? "FREE" : fmt(order.deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between text-ink-soft">
                <span>Integrated GST (5%)</span>
                <span className="text-ink font-medium">{fmt(order.tax)}</span>
              </div>
              <div className="border-t border-line pt-2 flex justify-between items-baseline font-bold text-body-sm">
                <span className="text-ink">Grand Total</span>
                <span className="text-heading-md text-gold-dark dark:text-gold font-display">
                  {fmt(order.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="border-t border-line pt-4 text-[11px] text-ink-faint text-center">
            This is a computer generated invoice and requires no physical signature. Bhagya Commerce Artisan Network.
          </div>
        </div>
      </div>
    </div>
  );
}
