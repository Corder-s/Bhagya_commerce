'use client';

import React, { useState } from 'react';
import { marketingApiService, type BackendPromotionCreateRequest } from '@/lib/api/services';
import { Button } from '@/components/ui/button';
import { X, Tag } from 'lucide-react';

interface CreatePromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function CreatePromotionModal({ isOpen, onClose, onCreated }: CreatePromotionModalProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState('PERCENTAGE_DISCOUNT');
  const [value, setValue] = useState('15');
  const [couponCode, setCouponCode] = useState('');
  const [minOrder, setMinOrder] = useState('1999');
  const [maxDiscount, setMaxDiscount] = useState('1000');
  const [usageLimit, setUsageLimit] = useState('200');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const payload: BackendPromotionCreateRequest = {
        name,
        description: description || undefined,
        type,
        value: parseFloat(value),
        minimumOrderValue: minOrder ? parseFloat(minOrder) : 0,
        maximumDiscount: maxDiscount ? parseFloat(maxDiscount) : undefined,
        couponCode: couponCode ? couponCode.trim().toUpperCase() : undefined,
        usageLimit: usageLimit ? parseInt(usageLimit, 10) : undefined,
        perCustomerLimit: 1,
      };

      await marketingApiService.createPromotion(payload);
      onCreated();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create promotion');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative flex max-h-[90vh] w-full max-w-lg flex-col rounded-2xl border border-[#444139] bg-[#2B2A25] shadow-2xl animate-in fade-in zoom-in-95 my-auto text-[#F5F1E8]">
        {/* Modal Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#3A3831] p-5 bg-[#2B2A25] rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-[#35332C] text-[#C49A45] border border-[#5B533F]">
              <Tag className="size-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-semibold text-[#F5F1E8]">Create Promotion & Coupon</h2>
              <p className="text-xs text-[#9E988C]">Define customer discounts and store coupon codes</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#9E988C] hover:bg-[#35332C] hover:text-[#F5F1E8] transition-colors"
            title="Close modal"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Modal Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 space-y-4 overflow-y-auto p-5 text-sm">
            {error && (
              <div className="rounded-lg bg-[#4A2924] p-3 text-xs text-[#F09284] border border-[#D05A4A]">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-[#C8C1B4]">Promotion Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Navratri Festive Handloom Offer"
                className="mt-1 w-full rounded-lg border border-[#444139] bg-[#1C1B18] px-3 py-2 text-[#F5F1E8] placeholder:text-[#9E988C] focus:border-[#C49A45] focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#C8C1B4]">Discount Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#444139] bg-[#1C1B18] px-3 py-2 text-[#F5F1E8] focus:border-[#C49A45] focus:outline-hidden"
                >
                  <option value="PERCENTAGE_DISCOUNT">Percentage (%) Off</option>
                  <option value="FIXED_DISCOUNT">Flat Amount (₹) Off</option>
                  <option value="FREE_DELIVERY">Free Delivery</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#C8C1B4]">
                  {type === 'PERCENTAGE_DISCOUNT' ? 'Percentage Value (%) *' : 'Discount Amount (₹) *'}
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max={type === 'PERCENTAGE_DISCOUNT' ? '100' : '50000'}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="15"
                  className="mt-1 w-full rounded-lg border border-[#444139] bg-[#1C1B18] px-3 py-2 text-[#F5F1E8] focus:border-[#C49A45] focus:outline-hidden font-serif"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#C8C1B4]">Coupon Code (Uppercase)</label>
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="FESTIVE15"
                  className="mt-1 w-full rounded-lg border border-[#444139] bg-[#1C1B18] px-3 py-2 text-[#F5F1E8] font-mono font-semibold tracking-wider uppercase focus:border-[#C49A45] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#C8C1B4]">Minimum Purchase (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={minOrder}
                  onChange={(e) => setMinOrder(e.target.value)}
                  placeholder="1999"
                  className="mt-1 w-full rounded-lg border border-[#444139] bg-[#1C1B18] px-3 py-2 text-[#F5F1E8] focus:border-[#C49A45] focus:outline-hidden font-serif"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#C8C1B4]">Max Discount Cap (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={maxDiscount}
                  onChange={(e) => setMaxDiscount(e.target.value)}
                  placeholder="1000"
                  className="mt-1 w-full rounded-lg border border-[#444139] bg-[#1C1B18] px-3 py-2 text-[#F5F1E8] focus:border-[#C49A45] focus:outline-hidden font-serif"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#C8C1B4]">Total Usage Limit</label>
                <input
                  type="number"
                  min="1"
                  value={usageLimit}
                  onChange={(e) => setUsageLimit(e.target.value)}
                  placeholder="200"
                  className="mt-1 w-full rounded-lg border border-[#444139] bg-[#1C1B18] px-3 py-2 text-[#F5F1E8] focus:border-[#C49A45] focus:outline-hidden font-serif"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#C8C1B4]">Description</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Terms and eligible products note..."
                className="mt-1 w-full rounded-lg border border-[#444139] bg-[#1C1B18] px-3 py-2 text-[#F5F1E8] placeholder:text-[#9E988C] focus:border-[#C49A45] focus:outline-hidden"
              />
            </div>
          </div>

          {/* Modal Sticky Footer Actions */}
          <div className="flex shrink-0 items-center justify-end gap-3 border-t border-[#3A3831] p-4 bg-[#2B2A25] rounded-b-2xl">
            <Button
              variant="outline"
              size="md"
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="border-[#444139] bg-[#302F29] text-[#F5F1E8] hover:bg-[#35332C]"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              type="submit"
              disabled={isSubmitting}
              className="bg-[#C49A45] hover:bg-[#DDBB72] text-[#151515] font-semibold"
            >
              {isSubmitting ? 'Creating...' : 'Save Promotion'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
