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
  BarChart2,
} from 'lucide-react';
import { CampaignList } from './campaign-list';
import { PromotionList } from './promotion-list';
import { CreatePromotionModal } from './create-promotion-modal';
import { CampaignBuilderModal } from './campaign-builder-modal';
import { MarketingAnalyticsCharts } from './marketing-analytics-charts';

export function MarketingDashboardView() {
  const [activeTab, setActiveTab] = useState<'analytics' | 'campaigns' | 'promotions' | 'audiences'>('analytics');
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
    <div className="space-y-6 sm:space-y-8">
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">Marketing & Promotions</h1>
          <p className="mt-1 text-xs sm:text-sm text-ink-soft">
            Launch artisan campaigns, manage coupon codes, and measure real revenue attribution.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 border-line bg-surface hover:bg-surface-subtle"
          >
            <RefreshCw className={`size-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPromotionModalOpen(true)}
            className="flex items-center gap-1.5 border-line bg-surface hover:bg-surface-subtle"
          >
            <Tag className="size-4 text-[#E89535] dark:text-[#F0A349]" />
            Create Promotion
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCampaignModalOpen(true)}
            className="flex items-center gap-1.5"
          >
            <Megaphone className="size-4" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* KPI Stat Cards — LUNÉA Surface Design */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 sm:gap-4">
        <div className="rounded-2xl border border-line bg-surface p-4 shadow-sm">
          <div className="flex items-center gap-2 text-ink-soft">
            <Megaphone className="size-4 text-[#E89535] dark:text-[#F0A349]" />
            <span className="text-xs font-medium">Active Campaigns</span>
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-bold text-ink">
            {isLoading ? '—' : overview?.activeCampaignsCount ?? campaigns.filter((c) => c.status === 'RUNNING').length}
          </div>
          <div className="mt-1 text-[11px] text-ink-soft">Currently dispatching</div>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-4 shadow-sm">
          <div className="flex items-center gap-2 text-ink-soft">
            <Clock className="size-4 text-[#E89535] dark:text-[#F0A349]" />
            <span className="text-xs font-medium">Scheduled</span>
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-bold text-ink">
            {isLoading ? '—' : overview?.scheduledCampaignsCount ?? campaigns.filter((c) => c.status === 'SCHEDULED').length}
          </div>
          <div className="mt-1 text-[11px] text-ink-soft">Upcoming launches</div>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-4 shadow-sm">
          <div className="flex items-center gap-2 text-ink-soft">
            <Tag className="size-4 text-[#4E7C59]" />
            <span className="text-xs font-medium">Active Promotions</span>
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-bold text-ink">
            {isLoading ? '—' : overview?.activePromotionsCount ?? promotions.filter((p) => p.status === 'ACTIVE').length}
          </div>
          <div className="mt-1 text-[11px] text-ink-soft">Redeemable at checkout</div>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-4 shadow-sm">
          <div className="flex items-center gap-2 text-ink-soft">
            <ShoppingBag className="size-4 text-[#E0732A]" />
            <span className="text-xs font-medium">Attributed Orders</span>
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-bold text-ink">
            {isLoading ? '—' : overview?.totalAttributedOrders ?? campaigns.reduce((acc, c) => acc + (c.attributedOrders || 0), 0)}
          </div>
          <div className="mt-1 text-[11px] text-ink-soft">Campaign & coupon sales</div>
        </div>

        <div className="col-span-2 sm:col-span-1 rounded-2xl border border-line bg-surface p-4 shadow-sm">
          <div className="flex items-center gap-2 text-ink-soft">
            <TrendingUp className="size-4 text-[#4E7C59]" />
            <span className="text-xs font-medium">Attributed Sales</span>
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-bold text-ink">
            {isLoading
              ? '—'
              : formatPrice(
                  overview?.totalAttributedSales ??
                    campaigns.reduce((acc, c) => acc + (c.attributedSales || 0), 0)
                )}
          </div>
          <div className="mt-1 text-[11px] text-[#4E7C59]">Verified order revenue</div>
        </div>
      </div>

      {/* Navigation Tabs - LUNÉA Theme Palette */}
      <div className="flex items-center border-b border-line overflow-x-auto no-scrollbar gap-1">
        <button
          type="button"
          onClick={() => setActiveTab('analytics')}
          className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors duration-150 ${
            activeTab === 'analytics'
              ? 'border-[#E89535] text-[#D48024] dark:text-[#F0A349] font-semibold bg-[#FFF6ED] dark:bg-[#33241C]'
              : 'border-transparent text-ink-soft hover:text-ink hover:bg-surface-subtle'
          }`}
        >
          <BarChart2 className="size-4" />
          Analytics & Performance
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('campaigns')}
          className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors duration-150 ${
            activeTab === 'campaigns'
              ? 'border-[#E89535] text-[#D48024] dark:text-[#F0A349] font-semibold bg-[#FFF6ED] dark:bg-[#33241C]'
              : 'border-transparent text-ink-soft hover:text-ink hover:bg-surface-subtle'
          }`}
        >
          <Megaphone className="size-4" />
          Campaigns
          <span className="ml-1 rounded-full bg-surface-subtle px-2 py-0.5 text-xs text-ink-soft border border-line">
            {campaigns.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('promotions')}
          className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors duration-150 ${
            activeTab === 'promotions'
              ? 'border-[#E89535] text-[#D48024] dark:text-[#F0A349] font-semibold bg-[#FFF6ED] dark:bg-[#33241C]'
              : 'border-transparent text-ink-soft hover:text-ink hover:bg-surface-subtle'
          }`}
        >
          <Tag className="size-4" />
          Promotions & Coupons
          <span className="ml-1 rounded-full bg-surface-subtle px-2 py-0.5 text-xs text-ink-soft border border-line">
            {promotions.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('audiences')}
          className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors duration-150 ${
            activeTab === 'audiences'
              ? 'border-[#E89535] text-[#D48024] dark:text-[#F0A349] font-semibold bg-[#FFF6ED] dark:bg-[#33241C]'
              : 'border-transparent text-ink-soft hover:text-ink hover:bg-surface-subtle'
          }`}
        >
          <Users className="size-4" />
          Customer Audiences
          <span className="ml-1 rounded-full bg-surface-subtle px-2 py-0.5 text-xs text-ink-soft border border-line">
            {segments.length}
          </span>
        </button>
      </div>

      {/* Tab Panels with Smooth Transitions */}
      {activeTab === 'analytics' && (
        <div className="space-y-6 transition-opacity duration-200">
          <MarketingAnalyticsCharts campaigns={campaigns} promotions={promotions} />
          <div className="pt-2">
            <h3 className="font-display text-lg font-semibold text-ink mb-4">Recent Campaign Results</h3>
            <CampaignList
              campaigns={campaigns}
              onRefresh={fetchData}
              onOpenCreate={() => setIsCampaignModalOpen(true)}
            />
          </div>
        </div>
      )}

      {activeTab === 'campaigns' && (
        <div className="transition-opacity duration-200">
          <CampaignList
            campaigns={campaigns}
            onRefresh={fetchData}
            onOpenCreate={() => setIsCampaignModalOpen(true)}
          />
        </div>
      )}

      {activeTab === 'promotions' && (
        <div className="transition-opacity duration-200">
          <PromotionList
            promotions={promotions}
            onRefresh={fetchData}
            onOpenCreate={() => setIsPromotionModalOpen(true)}
          />
        </div>
      )}

      {activeTab === 'audiences' && (
        <div className="space-y-4 transition-opacity duration-200">
          <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-line gap-2">
              <div>
                <h3 className="font-display text-base sm:text-lg font-semibold text-ink">
                  Configured Customer Segments
                </h3>
                <p className="text-xs text-ink-soft mt-0.5">
                  Privacy-safe audience calculations respecting notification consent preferences.
                </p>
              </div>
              <span className="rounded-full bg-[#EAF3ED] dark:bg-[#25392B] px-3 py-1 text-xs font-semibold text-[#4E7C59] dark:text-[#78A383] border border-[#B0C9B6] dark:border-[#375D41] w-fit flex items-center gap-1">
                <ShieldCheck className="size-3.5 text-[#4E7C59]" /> Store-Scoped & Consent-Aware
              </span>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {segments.map((seg) => (
                <div
                  key={seg.id}
                  className="flex flex-col justify-between rounded-xl border border-line bg-surface p-4 transition-all duration-150 hover:border-[#E89535]/40 hover:bg-surface-subtle"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-ink">{seg.name}</span>
                      <span className="rounded-full bg-[#FFF6ED] dark:bg-[#33241C] px-2 py-0.5 text-xs font-semibold text-[#D48024] dark:text-[#F0A349] border border-[#E89535]/30">
                        {seg.estimatedCount} Reach
                      </span>
                    </div>
                    {seg.description && (
                      <p className="mt-1 text-xs text-ink-soft line-clamp-2">{seg.description}</p>
                    )}
                  </div>
                  <div className="mt-4 pt-3 border-t border-line flex items-center justify-between text-xs text-ink-soft">
                    <span>Target criteria</span>
                    <button
                      type="button"
                      onClick={() => setIsCampaignModalOpen(true)}
                      className="flex items-center gap-1 text-[#E89535] dark:text-[#F0A349] hover:text-[#D48024] font-medium transition-colors"
                    >
                      Target with campaign <ArrowRight className="size-3" />
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
