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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative flex max-h-[90vh] w-full max-w-lg flex-col rounded-2xl border border-line bg-surface shadow-2xl animate-in fade-in zoom-in-95 my-auto text-ink">
        {/* Modal Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-line p-5 bg-surface rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-[#FFF6ED] dark:bg-[#33241C] text-[#E89535] dark:text-[#F0A349] border border-[#E89535]/30">
              <Tag className="size-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-ink">Create Promotion & Coupon</h2>
              <p className="text-xs text-ink-soft">Define customer discounts and store coupon codes</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-ink-soft hover:bg-surface-subtle hover:text-ink transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Modal Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 space-y-4 overflow-y-auto p-5 text-sm">
            {error && (
              <div className="rounded-lg bg-danger-surface p-3 text-xs text-danger border border-danger/40">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-ink-soft">Promotion Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Navratri Festive Handloom Offer"
                className="mt-1 w-full rounded-lg border border-line bg-surface-subtle px-3 py-2 text-ink placeholder:text-ink-faint focus:border-[#E89535] focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-ink-soft">Discount Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-line bg-surface-subtle px-3 py-2 text-ink focus:border-[#E89535] focus:outline-hidden"
                >
                  <option value="PERCENTAGE_DISCOUNT">Percentage (%) Off</option>
                  <option value="FIXED_DISCOUNT">Flat Amount (₹) Off</option>
                  <option value="FREE_DELIVERY">Free Delivery</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-ink-soft">
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
                  className="mt-1 w-full rounded-lg border border-line bg-surface-subtle px-3 py-2 text-ink focus:border-[#E89535] focus:outline-hidden font-display"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-ink-soft">Coupon Code (Uppercase)</label>
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="FESTIVE15"
                  className="mt-1 w-full rounded-lg border border-line bg-surface-subtle px-3 py-2 text-ink font-mono font-semibold tracking-wider uppercase focus:border-[#E89535] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-ink-soft">Minimum Purchase (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={minOrder}
                  onChange={(e) => setMinOrder(e.target.value)}
                  placeholder="1999"
                  className="mt-1 w-full rounded-lg border border-line bg-surface-subtle px-3 py-2 text-ink focus:border-[#E89535] focus:outline-hidden font-display"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-ink-soft">Max Discount Cap (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={maxDiscount}
                  onChange={(e) => setMaxDiscount(e.target.value)}
                  placeholder="1000"
                  className="mt-1 w-full rounded-lg border border-line bg-surface-subtle px-3 py-2 text-ink focus:border-[#E89535] focus:outline-hidden font-display"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-ink-soft">Total Usage Limit</label>
                <input
                  type="number"
                  min="1"
                  value={usageLimit}
                  onChange={(e) => setUsageLimit(e.target.value)}
                  placeholder="200"
                  className="mt-1 w-full rounded-lg border border-line bg-surface-subtle px-3 py-2 text-ink focus:border-[#E89535] focus:outline-hidden font-display"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-ink-soft">Description</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Terms and eligible products note..."
                className="mt-1 w-full rounded-lg border border-line bg-surface-subtle px-3 py-2 text-ink placeholder:text-ink-faint focus:border-[#E89535] focus:outline-hidden"
              />
            </div>
          </div>

          {/* Modal Sticky Footer Actions */}
          <div className="flex shrink-0 items-center justify-end gap-3 border-t border-line p-4 bg-surface rounded-b-2xl">
            <Button
              variant="outline"
              size="md"
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Save Promotion'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
