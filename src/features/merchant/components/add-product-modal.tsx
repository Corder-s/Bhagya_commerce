"use client";

import { Check, Loader2, PackagePlus, Sparkles } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal, ModalContent } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import type { MerchantProduct } from "@/features/merchant/dashboard-types";
import { MERCHANT_CATEGORIES } from "@/features/merchant/merchant-utils";
import { toast } from "@/lib/toast";
import { merchantDashboardService } from "@/services/merchant-dashboard.service";

export function AddProductModal({
  isOpen,
  onClose,
  onProductAdded,
}: {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded?: (product: MerchantProduct) => void;
}) {
  const [name, setName] = React.useState("");
  const [category, setCategory] = React.useState("Handmade & Crafts");
  const [price, setPrice] = React.useState<number | "">("");
  const [mrp, setMrp] = React.useState<number | "">("");
  const [stock, setStock] = React.useState<number | "">(10);
  const [sku, setSku] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [status, setStatus] = React.useState<"published" | "draft">("published");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Validation Error", "Product name is required.");
      return;
    }
    if (!price || Number(price) <= 0) {
      toast.error("Validation Error", "Please specify a valid selling price.");
      return;
    }

    setIsSubmitting(true);
    try {
      const added = await merchantDashboardService.addProduct("current_store", {
        name: name.trim(),
        category,
        price: Number(price),
        mrp: mrp ? Number(mrp) : undefined,
        stock: Number(stock) || 0,
        sku: sku.trim() || undefined,
        description: description.trim() || undefined,
        status,
      });

      toast.success("Product Added", `"${added.name}" added to your catalogue.`);
      onProductAdded?.(added);
      onClose();

      // Reset
      setName("");
      setPrice("");
      setMrp("");
      setStock(10);
      setSku("");
      setDescription("");
    } catch {
      toast.error("Creation Failed", "Could not add product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <ModalContent
        title="Add New Product"
        description="List a handcrafted item in your store catalogue"
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label htmlFor="pname" className="block text-body-sm font-medium text-ink mb-1">
              Product Title <span className="text-danger">*</span>
            </label>
            <Input
              id="pname"
              placeholder="e.g. Handloom Chanderi Silk Saree"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="pcat" className="block text-body-sm font-medium text-ink mb-1">
                Category
              </label>
              <select
                id="pcat"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-body-sm text-ink focus:border-[#C49A45] focus:outline-none"
              >
                {MERCHANT_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="psku" className="block text-body-sm font-medium text-ink mb-1">
                SKU Code <span className="text-caption text-ink-soft">(Optional)</span>
              </label>
              <Input
                id="psku"
                placeholder="e.g. BNR-SILK-01"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="pprice" className="block text-body-sm font-medium text-ink mb-1">
                Selling Price (₹) <span className="text-danger">*</span>
              </label>
              <Input
                id="pprice"
                type="number"
                min={1}
                placeholder="2450"
                value={price}
                onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
                required
              />
            </div>

            <div>
              <label htmlFor="pmrp" className="block text-body-sm font-medium text-ink mb-1">
                MRP (₹) <span className="text-caption text-ink-soft">(Optional)</span>
              </label>
              <Input
                id="pmrp"
                type="number"
                min={1}
                placeholder="3200"
                value={mrp}
                onChange={(e) => setMrp(e.target.value === "" ? "" : Number(e.target.value))}
              />
            </div>

            <div>
              <label htmlFor="pstock" className="block text-body-sm font-medium text-ink mb-1">
                Stock Quantity
              </label>
              <Input
                id="pstock"
                type="number"
                min={0}
                placeholder="10"
                value={stock}
                onChange={(e) => setStock(e.target.value === "" ? "" : Number(e.target.value))}
              />
            </div>
          </div>

          <div>
            <label htmlFor="pdesc" className="block text-body-sm font-medium text-ink mb-1">
              Craft Story & Materials Description
            </label>
            <Textarea
              id="pdesc"
              rows={3}
              placeholder="Describe the artisan technique, materials used, dimensions and care instructions..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4 pt-1">
            <label className="flex items-center gap-2 text-body-sm text-ink cursor-pointer">
              <input
                type="radio"
                name="prodStatus"
                checked={status === "published"}
                onChange={() => setStatus("published")}
                className="accent-[#C49A45]"
              />
              <span>Publish Immediately</span>
            </label>
            <label className="flex items-center gap-2 text-body-sm text-ink cursor-pointer">
              <input
                type="radio"
                name="prodStatus"
                checked={status === "draft"}
                onChange={() => setStatus("draft")}
                className="accent-[#C49A45]"
              />
              <span>Save as Draft</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-line">
            <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5" />}
              {status === "published" ? "Publish Product" : "Save Draft"}
            </Button>
          </div>
        </form>
      </ModalContent>
    </Modal>
  );
}
