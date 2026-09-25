'use client';

import React, { useState } from 'react';
import {
  marketingApiService,
  type BackendPromotion,
} from '@/lib/api/services';
import { formatPrice } from '@/lib/format';
import { Badge } from '@/components/ui/badge';
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
          <Badge tone="success">
            <CheckCircle2 className="mr-1 h-3 w-3" /> Active
          </Badge>
        );
      case 'PAUSED':
        return (
          <Badge tone="warning">
            <Pause className="mr-1 h-3 w-3" /> Paused
          </Badge>
        );
      case 'EXPIRED':
        return (
          <Badge tone="neutral">
            <Clock className="mr-1 h-3 w-3" /> Expired
          </Badge>
        );
      case 'ARCHIVED':
        return <Badge tone="neutral">Archived</Badge>;
      case 'SCHEDULED':
        return <Badge tone="warning">Scheduled</Badge>;
      case 'DRAFT':
      default:
        return <Badge tone="neutral">Draft</Badge>;
    }
  };

  const renderValueDisplay = (promo: BackendPromotion) => {
    switch (promo.type) {
      case 'PERCENTAGE_DISCOUNT':
        return (
          <div className="flex items-center gap-1 font-semibold text-charcoal">
            <Percent className="h-3.5 w-3.5 text-primary" />
            <span>{promo.value}% OFF</span>
          </div>
        );
      case 'FIXED_DISCOUNT':
        return (
          <div className="flex items-center gap-1 font-semibold text-charcoal">
            <IndianRupee className="h-3.5 w-3.5 text-primary" />
            <span>{formatPrice(promo.value)} Flat</span>
          </div>
        );
      case 'FREE_DELIVERY':
        return (
          <div className="flex items-center gap-1 font-semibold text-emerald-700">
            <Truck className="h-3.5 w-3.5" />
            <span>Free Delivery</span>
          </div>
        );
      default:
        return <span>{promo.value}</span>;
    }
  };

  if (!promotions || promotions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface/50 p-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
          <Tag className="h-7 w-7" />
        </div>
        <h3 className="font-serif text-lg font-semibold text-charcoal">No promotions created</h3>
        <p className="mt-1 max-w-sm text-sm text-charcoal-muted">
          Create percentage discounts, flat order savings, or free delivery coupons for your store.
        </p>
        <Button variant="primary" size="md" className="mt-6" onClick={onOpenCreate}>
          Create First Promotion
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-hidden rounded-2xl border border-border bg-surface shadow-xs">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-ivory text-xs uppercase tracking-wider text-charcoal-muted font-medium">
            <tr>
              <th className="px-6 py-4">Promotion & Code</th>
              <th className="px-6 py-4">Benefit</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Spend & Limits</th>
              <th className="px-6 py-4">Usage</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {promotions.map((promo) => {
              const primaryCoupon = promo.couponCode;
              return (
                <tr key={promo.id} className="transition-colors hover:bg-surface-elevated/40">
                  <td className="px-6 py-4">
                    <div className="font-medium text-charcoal">{promo.name}</div>
                    {primaryCoupon ? (
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 rounded-md bg-ivory-warm px-2 py-0.5 font-mono text-xs font-semibold text-charcoal border border-border">
                          <Tag className="h-3 w-3 text-primary" />
                          {primaryCoupon}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyCode(primaryCoupon)}
                          className="text-charcoal-muted hover:text-charcoal transition-colors"
                          title="Copy Code"
                        >
                          {copiedCode === primaryCoupon ? (
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-charcoal-muted">Automatic Discount</span>
                    )}
                  </td>
                  <td className="px-6 py-4">{renderValueDisplay(promo)}</td>
                  <td className="px-6 py-4">{renderStatusBadge(promo.status)}</td>
                  <td className="px-6 py-4 text-xs text-charcoal">
                    {promo.minimumOrderValue ? (
                      <div>Min order: {formatPrice(promo.minimumOrderValue)}</div>
                    ) : (
                      <div>No minimum spend</div>
                    )}
                    {promo.maximumDiscount ? (
                      <div className="text-charcoal-muted">Cap: {formatPrice(promo.maximumDiscount)}</div>
                    ) : null}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-charcoal">
                      {promo.usageCount || 0}{' '}
                      <span className="text-xs font-normal text-charcoal-muted">
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
                        >
                          {promo.status === 'ACTIVE' ? (
                            <>
                              <Pause className="mr-1 h-3 w-3" /> Pause
                            </>
                          ) : (
                            <>
                              <Play className="mr-1 h-3 w-3" /> Resume
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
              className="rounded-xl border border-border bg-surface p-4 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-charcoal">{promo.name}</h4>
                  <div className="mt-1">{renderValueDisplay(promo)}</div>
                </div>
                <div>{renderStatusBadge(promo.status)}</div>
              </div>

              {primaryCoupon && (
                <div className="flex items-center justify-between rounded-lg bg-ivory/80 p-2 border border-border/60">
                  <div className="flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5 text-primary" />
                    <span className="font-mono text-xs font-semibold text-charcoal">{primaryCoupon}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => handleCopyCode(primaryCoupon)}
                  >
                    {copiedCode === primaryCoupon ? 'Copied' : 'Copy'}
                  </Button>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-charcoal-muted">
                <span>
                  Min order: {promo.minimumOrderValue ? formatPrice(promo.minimumOrderValue) : 'None'}
                </span>
                <span>
                  Used: {promo.usageCount || 0} / {promo.usageLimit || '∞'}
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                {promo.status !== 'ARCHIVED' && (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={actionLoadingId === promo.id}
                    onClick={() => handleToggleStatus(promo)}
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
