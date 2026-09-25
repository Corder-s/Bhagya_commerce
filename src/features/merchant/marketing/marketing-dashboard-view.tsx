'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  marketingApiService,
  type BackendMarketingOverview,
  type BackendCampaign,
  type BackendPromotion,
  type BackendCustomerSegment,
} from '@/lib/api/services';
import { formatPrice } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Megaphone,
  Tag,
  Users,
  TrendingUp,
  ShoppingBag,
  RefreshCw,
  Clock,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { CampaignList } from './campaign-list';
import { PromotionList } from './promotion-list';
import { CreatePromotionModal } from './create-promotion-modal';
import { CampaignBuilderModal } from './campaign-builder-modal';

export function MarketingDashboardView() {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'promotions' | 'audiences'>('campaigns');
  const [overview, setOverview] = useState<BackendMarketingOverview | null>(null);
  const [campaigns, setCampaigns] = useState<BackendCampaign[]>([]);
  const [promotions, setPromotions] = useState<BackendPromotion[]>([]);
  const [segments, setSegments] = useState<BackendCustomerSegment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modals
  const [isPromotionModalOpen, setIsPromotionModalOpen] = useState(false);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [overviewRes, campaignsRes, promotionsRes, segmentsRes] = await Promise.allSettled([
        marketingApiService.getOverview(),
        marketingApiService.getCampaigns(),
        marketingApiService.getPromotions(),
        marketingApiService.getSegments(),
      ]);

      if (overviewRes.status === 'fulfilled' && overviewRes.value?.data) {
        setOverview(overviewRes.value.data);
      }
      if (campaignsRes.status === 'fulfilled' && campaignsRes.value?.data) {
        setCampaigns(campaignsRes.value.data);
      }
      if (promotionsRes.status === 'fulfilled' && promotionsRes.value?.data) {
        setPromotions(promotionsRes.value.data);
      }
      if (segmentsRes.status === 'fulfilled' && segmentsRes.value?.data) {
        setSegments(segmentsRes.value.data);
      }
    } catch (err) {
      console.error('Failed to load marketing dashboard data', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchData();
  };

  return (
    <div className="space-y-8">
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-charcoal sm:text-3xl">Marketing & Promotions</h1>
          <p className="mt-1 text-sm text-charcoal-muted">
            Launch artisan campaigns, manage coupon codes, and measure real revenue attribution.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPromotionModalOpen(true)}
            className="flex items-center gap-1.5"
          >
            <Tag className="h-4 w-4 text-primary" />
            Create Promotion
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCampaignModalOpen(true)}
            className="flex items-center gap-1.5"
          >
            <Megaphone className="h-4 w-4" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <div className="rounded-2xl border border-border bg-surface p-4 shadow-xs">
          <div className="flex items-center gap-2 text-charcoal-muted">
            <Megaphone className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium">Active Campaigns</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-charcoal">
            {isLoading ? '—' : overview?.activeCampaignsCount ?? campaigns.filter((c) => c.status === 'RUNNING').length}
          </div>
          <div className="mt-1 text-[11px] text-charcoal-muted">Currently dispatching</div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-4 shadow-xs">
          <div className="flex items-center gap-2 text-charcoal-muted">
            <Clock className="h-4 w-4 text-amber-600" />
            <span className="text-xs font-medium">Scheduled</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-charcoal">
            {isLoading ? '—' : overview?.scheduledCampaignsCount ?? campaigns.filter((c) => c.status === 'SCHEDULED').length}
          </div>
          <div className="mt-1 text-[11px] text-charcoal-muted">Upcoming launches</div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-4 shadow-xs">
          <div className="flex items-center gap-2 text-charcoal-muted">
            <Tag className="h-4 w-4 text-emerald-600" />
            <span className="text-xs font-medium">Active Promotions</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-charcoal">
            {isLoading ? '—' : overview?.activePromotionsCount ?? promotions.filter((p) => p.status === 'ACTIVE').length}
          </div>
          <div className="mt-1 text-[11px] text-charcoal-muted">Redeemable at checkout</div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-4 shadow-xs">
          <div className="flex items-center gap-2 text-charcoal-muted">
            <ShoppingBag className="h-4 w-4 text-indigo-600" />
            <span className="text-xs font-medium">Attributed Orders</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-charcoal">
            {isLoading ? '—' : overview?.totalAttributedOrders ?? campaigns.reduce((acc, c) => acc + (c.attributedOrders || 0), 0)}
          </div>
          <div className="mt-1 text-[11px] text-charcoal-muted">Coupon & campaign checkouts</div>
        </div>

        <div className="col-span-2 sm:col-span-1 rounded-2xl border border-border bg-surface p-4 shadow-xs bg-linear-to-br from-surface to-ivory/60">
          <div className="flex items-center gap-2 text-charcoal-muted">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
            <span className="text-xs font-medium">Attributed Sales</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-charcoal">
            {isLoading
              ? '—'
              : formatPrice(
                  overview?.totalAttributedSales ??
                    campaigns.reduce((acc, c) => acc + (c.attributedSales || 0), 0)
                )}
          </div>
          <div className="mt-1 text-[11px] text-charcoal-muted">Verified order revenue</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center border-b border-border">
        <button
          type="button"
          onClick={() => setActiveTab('campaigns')}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'campaigns'
              ? 'border-primary text-primary font-semibold'
              : 'border-transparent text-charcoal-muted hover:text-charcoal'
          }`}
        >
          <Megaphone className="h-4 w-4" />
          Campaigns
          <span className="ml-1 rounded-full bg-surface-elevated px-2 py-0.5 text-xs text-charcoal-muted">
            {campaigns.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('promotions')}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'promotions'
              ? 'border-primary text-primary font-semibold'
              : 'border-transparent text-charcoal-muted hover:text-charcoal'
          }`}
        >
          <Tag className="h-4 w-4" />
          Promotions & Coupons
          <span className="ml-1 rounded-full bg-surface-elevated px-2 py-0.5 text-xs text-charcoal-muted">
            {promotions.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('audiences')}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'audiences'
              ? 'border-primary text-primary font-semibold'
              : 'border-transparent text-charcoal-muted hover:text-charcoal'
          }`}
        >
          <Users className="h-4 w-4" />
          Customer Audiences
          <span className="ml-1 rounded-full bg-surface-elevated px-2 py-0.5 text-xs text-charcoal-muted">
            {segments.length}
          </span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'campaigns' && (
        <CampaignList
          campaigns={campaigns}
          onRefresh={fetchData}
          onOpenCreate={() => setIsCampaignModalOpen(true)}
        />
      )}

      {activeTab === 'promotions' && (
        <PromotionList
          promotions={promotions}
          onRefresh={fetchData}
          onOpenCreate={() => setIsPromotionModalOpen(true)}
        />
      )}

      {activeTab === 'audiences' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <h3 className="font-serif text-lg font-semibold text-charcoal">Configured Customer Segments</h3>
                <p className="text-xs text-charcoal-muted mt-0.5">
                  Privacy-safe audience calculations respecting notification consent preferences.
                </p>
              </div>
              <Badge tone="success" className="text-xs">
                <ShieldCheck className="mr-1 h-3.5 w-3.5 text-emerald-600" /> Store-Scoped & Consent-Aware
              </Badge>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {segments.map((seg) => (
                <div
                  key={seg.id}
                  className="flex flex-col justify-between rounded-xl border border-border bg-ivory/40 p-4 transition-all hover:border-primary/40 hover:bg-ivory/70"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-charcoal">{seg.name}</span>
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                        {seg.estimatedCount} Reach
                      </span>
                    </div>
                    {seg.description && (
                      <p className="mt-1 text-xs text-charcoal-muted line-clamp-2">{seg.description}</p>
                    )}
                  </div>
                  <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-charcoal-muted">
                    <span>Target criteria</span>
                    <button
                      type="button"
                      onClick={() => setIsCampaignModalOpen(true)}
                      className="flex items-center gap-1 text-primary hover:underline font-medium"
                    >
                      Target with campaign <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <CreatePromotionModal
        isOpen={isPromotionModalOpen}
        onClose={() => setIsPromotionModalOpen(false)}
        onCreated={fetchData}
      />

      <CampaignBuilderModal
        isOpen={isCampaignModalOpen}
        onClose={() => setIsCampaignModalOpen(false)}
        onCreated={fetchData}
        promotions={promotions}
      />
    </div>
  );
}
