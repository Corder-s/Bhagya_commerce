'use client';

import React, { useState } from 'react';
import { marketingApiService, type BackendPromotionCreateRequest } from '@/lib/api/services';
import { Button } from '@/components/ui/button';
import { X, Tag, Percent, IndianRupee, Sparkles, Check } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary">
              <Tag className="size-5" />
            </div>
            <div>
              <h2 className="text-heading-md font-serif text-ink">Create Promotion & Coupon</h2>
              <p className="text-caption text-ink-soft">Define customer discounts and store coupon codes</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-ink-soft hover:bg-surface-raised hover:text-ink transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-rose-50 p-3 text-caption text-rose-800 border border-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4 text-body-sm">
          <div>
            <label className="text-caption font-medium text-ink">Promotion Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Navratri Festive Handloom Offer"
              className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-ink placeholder:text-ink-muted focus:border-brand-primary focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-caption font-medium text-ink">Discount Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-ink focus:border-brand-primary focus:outline-hidden"
              >
                <option value="PERCENTAGE_DISCOUNT">Percentage (%) Off</option>
                <option value="FIXED_DISCOUNT">Flat Amount (₹) Off</option>
                <option value="FREE_DELIVERY">Free Delivery</option>
              </select>
            </div>

            <div>
              <label className="text-caption font-medium text-ink">
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
                className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-ink focus:border-brand-primary focus:outline-hidden font-serif"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-caption font-medium text-ink">Coupon Code (Uppercase)</label>
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="FESTIVE15"
                className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-ink font-mono font-semibold tracking-wider uppercase focus:border-brand-primary focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-caption font-medium text-ink">Minimum Purchase (₹)</label>
              <input
                type="number"
                min="0"
                value={minOrder}
                onChange={(e) => setMinOrder(e.target.value)}
                placeholder="1999"
                className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-ink focus:border-brand-primary focus:outline-hidden font-serif"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-caption font-medium text-ink">Max Discount Cap (₹)</label>
              <input
                type="number"
                min="0"
                value={maxDiscount}
                onChange={(e) => setMaxDiscount(e.target.value)}
                placeholder="1000"
                className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-ink focus:border-brand-primary focus:outline-hidden font-serif"
              />
            </div>

            <div>
              <label className="text-caption font-medium text-ink">Total Usage Limit</label>
              <input
                type="number"
                min="1"
                value={usageLimit}
                onChange={(e) => setUsageLimit(e.target.value)}
                placeholder="200"
                className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-ink focus:border-brand-primary focus:outline-hidden font-serif"
              />
            </div>
          </div>

          <div>
            <label className="text-caption font-medium text-ink">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Terms and eligible products note..."
              className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-ink placeholder:text-ink-muted focus:border-brand-primary focus:outline-hidden"
            />
          </div>

          <div className="mt-4 flex items-center justify-end gap-3 border-t border-border pt-4">
            <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Save Promotion'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
