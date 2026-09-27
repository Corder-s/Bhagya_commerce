'use client';

import React, { useState } from 'react';
import {
  marketingApiService,
  type BackendPromotion,
} from '@/lib/api/services';
import { formatPrice } from '@/lib/format';
import { Button } from '@/components/ui/button';
import {
  Tag,
  Percent,
  IndianRupee,
  Pause,
  Play,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  Truck,
} from 'lucide-react';

interface PromotionListProps {
  promotions: BackendPromotion[];
  onRefresh: () => void;
  onOpenCreate: () => void;
}

export function PromotionList({
  promotions,
  onRefresh,
  onOpenCreate,
}: PromotionListProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleToggleStatus = async (promo: BackendPromotion) => {
    try {
      setActionLoadingId(promo.id);
      if (promo.status === 'ACTIVE') {
        await marketingApiService.pausePromotion(promo.id);
      } else {
        await marketingApiService.activatePromotion(promo.id);
      }
      onRefresh();
    } catch (err) {
      console.error('Failed to update promotion status', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#294C38] px-2.5 py-0.5 text-xs font-semibold text-[#73D393] border border-[#444139]">
            <CheckCircle2 className="size-3 text-[#43A66A]" /> Active
          </span>
        );
      case 'PAUSED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#4A3B24] px-2.5 py-0.5 text-xs font-semibold text-[#DDBB72] border border-[#444139]">
            <Pause className="size-3" /> Paused
          </span>
        );
      case 'EXPIRED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#34322B] px-2.5 py-0.5 text-xs font-semibold text-[#9E988C] border border-[#444139]">
            <Clock className="size-3" /> Expired
          </span>
        );
      case 'ARCHIVED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#34322B] px-2.5 py-0.5 text-xs font-semibold text-[#C8C1B4] border border-[#444139]">
            Archived
          </span>
        );
      case 'SCHEDULED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#4A3B24] px-2.5 py-0.5 text-xs font-semibold text-[#DDBB72] border border-[#444139]">
            Scheduled
          </span>
        );
      case 'DRAFT':
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#34322B] px-2.5 py-0.5 text-xs font-semibold text-[#C8C1B4] border border-[#444139]">
            Draft
          </span>
        );
    }
  };

  const renderValueDisplay = (promo: BackendPromotion) => {
    switch (promo.type) {
      case 'PERCENTAGE_DISCOUNT':
        return (
          <div className="flex items-center gap-1 font-semibold text-ink">
            <Percent className="size-3.5 text-[#E89535] dark:text-[#F0A349]" />
            <span>{promo.value}% OFF</span>
          </div>
        );
      case 'FIXED_DISCOUNT':
        return (
          <div className="flex items-center gap-1 font-semibold text-ink">
            <IndianRupee className="size-3.5 text-[#E89535] dark:text-[#F0A349]" />
            <span>{formatPrice(promo.value)} Flat</span>
          </div>
        );
      case 'FREE_DELIVERY':
        return (
          <div className="flex items-center gap-1 font-semibold text-[#4E7C59]">
            <Truck className="size-3.5" />
            <span>Free Delivery</span>
          </div>
        );
      default:
        return <span>{promo.value}</span>;
    }
  };

  if (!promotions || promotions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-surface p-12 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-[#FFF6ED] dark:bg-[#33241C] text-[#E89535] dark:text-[#F0A349] mb-4">
          <Tag className="size-7" />
        </div>
        <h3 className="font-display text-lg font-semibold text-ink">No promotions created</h3>
        <p className="mt-1 max-w-sm text-sm text-ink-soft">
          Create percentage discounts, flat order savings, or free delivery coupons for your store.
        </p>
        <Button
          variant="primary"
          size="md"
          className="mt-6"
          onClick={onOpenCreate}
        >
          Create First Promotion
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-hidden rounded-2xl border border-line bg-surface shadow-md">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-surface-subtle text-xs uppercase tracking-wider text-ink-soft font-medium">
            <tr>
              <th className="px-6 py-4">Promotion & Code</th>
              <th className="px-6 py-4">Benefit</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Spend & Limits</th>
              <th className="px-6 py-4">Usage</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {promotions.map((promo) => {
              const primaryCoupon = promo.couponCode;
              return (
                <tr key={promo.id} className="transition-colors hover:bg-surface-subtle/50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-ink">{promo.name}</div>
                    {primaryCoupon ? (
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 rounded-md bg-[#FFF6ED] dark:bg-[#33241C] px-2 py-0.5 font-mono text-xs font-semibold text-[#D48024] dark:text-[#F0A349] border border-[#E89535]/30">
                          <Tag className="size-3 text-[#E89535] dark:text-[#F0A349]" />
                          {primaryCoupon}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyCode(primaryCoupon)}
                          className="text-ink-soft hover:text-ink transition-colors cursor-pointer"
                          title="Copy Code"
                        >
                          {copiedCode === primaryCoupon ? (
                            <Check className="size-3.5 text-[#4E7C59]" />
                          ) : (
                            <Copy className="size-3.5" />
                          )}
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-ink-soft">Automatic Discount</span>
                    )}
                  </td>
                  <td className="px-6 py-4">{renderValueDisplay(promo)}</td>
                  <td className="px-6 py-4">{renderStatusBadge(promo.status)}</td>
                  <td className="px-6 py-4 text-xs text-ink-soft">
                    {promo.minimumOrderValue ? (
                      <div>Min order: {formatPrice(promo.minimumOrderValue)}</div>
                    ) : (
                      <div>No minimum spend</div>
                    )}
                    {promo.maximumDiscount ? (
                      <div className="text-ink-soft">Cap: {formatPrice(promo.maximumDiscount)}</div>
                    ) : null}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-ink">
                      {promo.usageCount || 0}{' '}
                      <span className="text-xs font-normal text-ink-soft">
                        / {promo.usageLimit || '∞'} uses
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {promo.status !== 'ARCHIVED' && (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={actionLoadingId === promo.id}
                          onClick={() => handleToggleStatus(promo)}
                          className="border-line bg-surface hover:bg-surface-subtle"
                        >
                          {promo.status === 'ACTIVE' ? (
                            <>
                              <Pause className="mr-1 size-3" /> Pause
                            </>
                          ) : (
                            <>
                              <Play className="mr-1 size-3" /> Resume
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Card View */}
      <div className="space-y-3 md:hidden">
        {promotions.map((promo) => {
          const primaryCoupon = promo.couponCode;
          return (
            <div
              key={promo.id}
              className="rounded-xl border border-line bg-surface p-4 shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-ink">{promo.name}</h4>
                  <div className="mt-1">{renderValueDisplay(promo)}</div>
                </div>
                <div>{renderStatusBadge(promo.status)}</div>
              </div>

              {primaryCoupon && (
                <div className="flex items-center justify-between rounded-lg bg-surface-subtle p-2 border border-line">
                  <div className="flex items-center gap-1.5">
                    <Tag className="size-3.5 text-[#E89535] dark:text-[#F0A349]" />
                    <span className="font-mono text-xs font-semibold text-[#D48024] dark:text-[#F0A349]">{primaryCoupon}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs text-ink-soft hover:text-ink"
                    onClick={() => handleCopyCode(primaryCoupon)}
                  >
                    {copiedCode === primaryCoupon ? 'Copied' : 'Copy'}
                  </Button>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-ink-soft">
                <span>
                  Min order: {promo.minimumOrderValue ? formatPrice(promo.minimumOrderValue) : 'None'}
                </span>
                <span>
                  Used: {promo.usageCount || 0} / {promo.usageLimit || '∞'}
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-line">
                {promo.status !== 'ARCHIVED' && (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={actionLoadingId === promo.id}
                    onClick={() => handleToggleStatus(promo)}
                    className="border-line bg-surface"
                  >
                    {promo.status === 'ACTIVE' ? 'Pause' : 'Resume'}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
