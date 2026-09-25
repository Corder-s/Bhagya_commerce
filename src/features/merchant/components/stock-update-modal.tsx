"use client";

import { Boxes, Check, Loader2 } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal, ModalContent } from "@/components/ui/modal";
import { toast } from "@/lib/toast";
import { merchantDashboardService } from "@/services/merchant-dashboard.service";

export function StockUpdateModal({
  item,
  isOpen,
  onClose,
  onUpdated,
}: {
  item: { id: string; name: string; sku: string; currentStock: number } | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated?: () => void;
}) {
  const [stockInput, setStockInput] = React.useState<number>(0);
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    if (item) {
      setStockInput(item.currentStock);
    }
  }, [item]);

  if (!item) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await merchantDashboardService.updateProductStock(item.id, Number(stockInput));
      toast.success("Stock Updated", `Inventory for "${item.name}" updated to ${stockInput} units.`);
      onUpdated?.();
      onClose();
    } catch {
      toast.error("Update Failed", "Could not update stock quantity.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <ModalContent
        title="Adjust Inventory Stock"
        description={`Update available units for ${item.name}`}
        size="sm"
      >
        <form onSubmit={handleSave} className="space-y-4 pt-2">
          <div className="p-3 rounded-xl bg-surface-subtle border border-line flex items-center justify-between text-caption">
            <div>
              <span className="text-ink-soft block">SKU Code</span>
              <span className="font-mono text-ink font-semibold">{item.sku}</span>
            </div>
            <div>
              <span className="text-ink-soft block">Current Available</span>
              <span className="font-semibold text-ink tabular-nums">{item.currentStock} units</span>
            </div>
          </div>

          <div>
            <label htmlFor="newStock" className="block text-body-sm font-medium text-ink mb-1.5">
              New Available Stock Level
            </label>
            <div className="flex gap-2">
              <Input
                id="newStock"
                type="number"
                min={0}
                max={9999}
                value={stockInput}
                onChange={(e) => setStockInput(Math.max(0, parseInt(e.target.value) || 0))}
                className="text-body-md font-semibold"
              />
            </div>
          </div>

          {/* Quick Increment Buttons */}
          <div className="flex items-center gap-2">
            <span className="text-caption text-ink-soft">Quick add:</span>
            {[+5, +10, +25, +50].map((inc) => (
              <Button
                key={inc}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setStockInput((prev) => prev + inc)}
                className="text-xs h-7 px-2"
              >
                +{inc}
              </Button>
            ))}
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-line">
            <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={isSaving}>
              {isSaving ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3.5" />}
              Save Stock
            </Button>
          </div>
        </form>
      </ModalContent>
    </Modal>
  );
}
