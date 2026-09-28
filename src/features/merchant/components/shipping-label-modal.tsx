"use client";

import { Check, Copy, Download, Printer, ShieldCheck } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Modal, ModalContent } from "@/components/ui/modal";
import type { Fulfillment } from "@/features/orders/shipment-types";
import type { MerchantOrder } from "@/features/merchant/dashboard-types";

export function ShippingLabelModal({
  isOpen,
  onClose,
  fulfillment,
  order,
}: {
  isOpen: boolean;
  onClose: () => void;
  fulfillment: Fulfillment | null;
  order: MerchantOrder | null;
}) {
  const [copied, setCopied] = React.useState(false);

  if (!fulfillment || !order) return null;

  const awb = fulfillment.trackingNumber || "DLH-99281745";
  const carrier = fulfillment.carrier || "Delhivery Express";

  const handleCopy = () => {
    navigator.clipboard.writeText(awb);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <ModalContent
        title="Official Shipping Document"
        description="Pre-paid carrier logistics label for parcel outer packaging"
        size="md"
      >
        <div className="space-y-4 pt-1">
          {/* Printable Thermal Label Frame */}
          <div
            id="bhagya-shipping-label"
            className="border-2 border-black bg-white text-black p-4 rounded-lg font-sans text-xs space-y-3 shadow-inner"
          >
            {/* Header: Carrier & Priority */}
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
              <div>
                <span className="font-extrabold text-sm tracking-tight uppercase block">{carrier}</span>
                <span className="text-[10px] font-semibold text-gray-700 tracking-wider">STANDARD SURFACE DISPATCH</span>
              </div>
              <div className="text-right">
                <span className="bg-black text-white text-[10px] font-black px-2 py-0.5 rounded uppercase">PREPAID</span>
                <span className="text-[10px] font-mono block mt-0.5">ZONE: NORTH-SOUTH</span>
              </div>
            </div>

            {/* Barcode Mock Visual */}
            <div className="text-center py-2 bg-gray-50 border border-gray-300 rounded space-y-1">
              <div className="h-10 flex items-center justify-center gap-0.5 px-4 overflow-hidden">
                {/* Generates alternating black bar pattern for barcode visual */}
                {Array.from({ length: 48 }).map((_, i) => (
                  <span
                    key={i}
                    className="inline-block bg-black h-8"
                    style={{
                      width: i % 4 === 0 ? "3px" : i % 3 === 0 ? "2px" : "1px",
                      marginRight: i % 5 === 0 ? "2px" : "1px",
                    }}
                  />
                ))}
              </div>
              <p className="font-mono text-xs font-bold tracking-widest text-black">{awb}</p>
            </div>

            {/* Addresses Grid */}
            <div className="grid grid-cols-2 gap-3 border-t-2 border-b-2 border-black py-2.5">
              {/* Ship To */}
              <div className="space-y-1 border-r border-gray-400 pr-2">
                <span className="font-bold text-[10px] uppercase text-gray-600 block">SHIP TO (BUYER):</span>
                <p className="font-bold text-xs">{order.customerName}</p>
                <p className="text-[11px] leading-tight text-gray-800">
                  {order.shippingAddressLine || "Customer Address on File"}
                </p>
                <p className="font-bold text-xs text-black mt-1">
                  {order.shippingCity}, India
                </p>
                <p className="text-[10px] font-mono text-gray-600">{order.customerPhone || "+91 98765 43210"}</p>
              </div>

              {/* Ship From */}
              <div className="space-y-1 pl-1">
                <span className="font-bold text-[10px] uppercase text-gray-600 block">RETURN IF UNDELIVERED:</span>
                <p className="font-bold text-xs">Bhagya Commerce Partner</p>
                <p className="text-[11px] leading-tight text-gray-800">
                  Varanasi Master Artisan Workshop, Kabir Chaura
                </p>
                <p className="font-bold text-xs text-black mt-1">
                  Varanasi, UP 221001
                </p>
                <p className="text-[10px] font-mono text-gray-600">+91 8000 123 456</p>
              </div>
            </div>

            {/* Package Details Footer */}
            <div className="flex items-center justify-between text-[11px] font-medium pt-1">
              <div>
                <span className="text-gray-600">Weight: </span>
                <span className="font-bold">{fulfillment.packageWeightKg} kg</span>
                <span className="text-gray-400 mx-1.5">|</span>
                <span className="text-gray-600">Dims: </span>
                <span className="font-bold">{fulfillment.packageDimensions}</span>
              </div>
              <div className="text-right">
                <span className="text-gray-600">Order: </span>
                <span className="font-mono font-bold">{order.orderNumber}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] text-gray-500 pt-1 border-t border-gray-200">
              <ShieldCheck className="size-3 text-emerald-600" />
              <span>Certified tamper-proof seal required. Keep away from direct water.</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="text-xs h-8 text-ink"
              >
                {copied ? <Check className="size-3 text-emerald-600" /> : <Copy className="size-3" />}
                {copied ? "AWB Copied" : "Copy AWB"}
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="text-xs h-8 text-ink"
              >
                <Printer className="size-3" />
                Print Label
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  alert(`Downloading label PDF for AWB ${awb} from secure storage.`);
                }}
                className="text-xs h-8 bg-[#E89535] hover:bg-[#D48024] text-[#241812] font-semibold"
              >
                <Download className="size-3" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
}
