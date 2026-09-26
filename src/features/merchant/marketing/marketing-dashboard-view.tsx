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
          <h1 className="font-serif text-2xl font-bold text-[#F5F1E8] sm:text-3xl">Marketing & Promotions</h1>
          <p className="mt-1 text-xs sm:text-sm text-[#9E988C]">
            Launch artisan campaigns, manage coupon codes, and measure real revenue attribution.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 border-[#444139] bg-[#2B2A25] text-[#F5F1E8] hover:bg-[#302F29] hover:border-[#5B533F]"
          >
            <RefreshCw className={`size-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPromotionModalOpen(true)}
            className="flex items-center gap-1.5 border-[#444139] bg-[#2B2A25] text-[#F5F1E8] hover:bg-[#302F29] hover:border-[#5B533F]"
          >
            <Tag className="size-4 text-[#C49A45]" />
            Create Promotion
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCampaignModalOpen(true)}
            className="flex items-center gap-1.5 bg-[#C49A45] hover:bg-[#DDBB72] text-[#151515] font-semibold"
          >
            <Megaphone className="size-4" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* KPI Stat Cards — Soft Charcoal Design */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 sm:gap-4">
        <div className="rounded-2xl border border-[#444139] bg-[#2B2A25] p-4 shadow-sm">
          <div className="flex items-center gap-2 text-[#9E988C]">
            <Megaphone className="size-4 text-[#C49A45]" />
            <span className="text-xs font-medium">Active Campaigns</span>
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-bold text-[#F5F1E8]">
            {isLoading ? '—' : overview?.activeCampaignsCount ?? campaigns.filter((c) => c.status === 'RUNNING').length}
          </div>
          <div className="mt-1 text-[11px] text-[#9E988C]">Currently dispatching</div>
        </div>

        <div className="rounded-2xl border border-[#444139] bg-[#2B2A25] p-4 shadow-sm">
          <div className="flex items-center gap-2 text-[#9E988C]">
            <Clock className="size-4 text-[#C79338]" />
            <span className="text-xs font-medium">Scheduled</span>
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-bold text-[#F5F1E8]">
            {isLoading ? '—' : overview?.scheduledCampaignsCount ?? campaigns.filter((c) => c.status === 'SCHEDULED').length}
          </div>
          <div className="mt-1 text-[11px] text-[#9E988C]">Upcoming launches</div>
        </div>

        <div className="rounded-2xl border border-[#444139] bg-[#2B2A25] p-4 shadow-sm">
          <div className="flex items-center gap-2 text-[#9E988C]">
            <Tag className="size-4 text-[#43A66A]" />
            <span className="text-xs font-medium">Active Promotions</span>
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-bold text-[#F5F1E8]">
            {isLoading ? '—' : overview?.activePromotionsCount ?? promotions.filter((p) => p.status === 'ACTIVE').length}
          </div>
          <div className="mt-1 text-[11px] text-[#9E988C]">Redeemable at checkout</div>
        </div>

        <div className="rounded-2xl border border-[#444139] bg-[#2B2A25] p-4 shadow-sm">
          <div className="flex items-center gap-2 text-[#9E988C]">
            <ShoppingBag className="size-4 text-[#4A96D8]" />
            <span className="text-xs font-medium">Attributed Orders</span>
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-bold text-[#F5F1E8]">
            {isLoading ? '—' : overview?.totalAttributedOrders ?? campaigns.reduce((acc, c) => acc + (c.attributedOrders || 0), 0)}
          </div>
          <div className="mt-1 text-[11px] text-[#9E988C]">Campaign & coupon sales</div>
        </div>

        <div className="col-span-2 sm:col-span-1 rounded-2xl border border-[#444139] bg-[#2B2A25] p-4 shadow-sm">
          <div className="flex items-center gap-2 text-[#9E988C]">
            <TrendingUp className="size-4 text-[#43A66A]" />
            <span className="text-xs font-medium">Attributed Sales</span>
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-bold text-[#F5F1E8]">
            {isLoading
              ? '—'
              : formatPrice(
                  overview?.totalAttributedSales ??
                    campaigns.reduce((acc, c) => acc + (c.attributedSales || 0), 0)
                )}
          </div>
          <div className="mt-1 text-[11px] text-[#73D393]">Verified order revenue</div>
        </div>
      </div>

      {/* Navigation Tabs - High-Contrast Soft Charcoal Palette */}
      <div className="flex items-center border-b border-[#3A3831] overflow-x-auto no-scrollbar gap-1">
        <button
          type="button"
          onClick={() => setActiveTab('analytics')}
          className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors duration-150 ${
            activeTab === 'analytics'
              ? 'border-[#C49A45] text-[#DDBB72] font-semibold bg-[#302B20]/40'
              : 'border-transparent text-[#B8B1A5] hover:text-[#F5F1E8] hover:bg-[#34322B]'
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
              ? 'border-[#C49A45] text-[#DDBB72] font-semibold bg-[#302B20]/40'
              : 'border-transparent text-[#B8B1A5] hover:text-[#F5F1E8] hover:bg-[#34322B]'
          }`}
        >
          <Megaphone className="size-4" />
          Campaigns
          <span className="ml-1 rounded-full bg-[#35332C] px-2 py-0.5 text-xs text-[#C8C1B4] border border-[#444139]">
            {campaigns.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('promotions')}
          className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors duration-150 ${
            activeTab === 'promotions'
              ? 'border-[#C49A45] text-[#DDBB72] font-semibold bg-[#302B20]/40'
              : 'border-transparent text-[#B8B1A5] hover:text-[#F5F1E8] hover:bg-[#34322B]'
          }`}
        >
          <Tag className="size-4" />
          Promotions & Coupons
          <span className="ml-1 rounded-full bg-[#35332C] px-2 py-0.5 text-xs text-[#C8C1B4] border border-[#444139]">
            {promotions.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('audiences')}
          className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors duration-150 ${
            activeTab === 'audiences'
              ? 'border-[#C49A45] text-[#DDBB72] font-semibold bg-[#302B20]/40'
              : 'border-transparent text-[#B8B1A5] hover:text-[#F5F1E8] hover:bg-[#34322B]'
          }`}
        >
          <Users className="size-4" />
          Customer Audiences
          <span className="ml-1 rounded-full bg-[#35332C] px-2 py-0.5 text-xs text-[#C8C1B4] border border-[#444139]">
            {segments.length}
          </span>
        </button>
      </div>

      {/* Tab Panels with Smooth Transitions */}
      {activeTab === 'analytics' && (
        <div className="space-y-6 transition-opacity duration-200">
          <MarketingAnalyticsCharts campaigns={campaigns} promotions={promotions} />
          <div className="pt-2">
            <h3 className="font-serif text-lg font-semibold text-[#F5F1E8] mb-4">Recent Campaign Results</h3>
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
          <div className="rounded-2xl border border-[#444139] bg-[#2B2A25] p-5 sm:p-6 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-[#3A3831] gap-2">
              <div>
                <h3 className="font-serif text-base sm:text-lg font-semibold text-[#F5F1E8]">
                  Configured Customer Segments
                </h3>
                <p className="text-xs text-[#9E988C] mt-0.5">
                  Privacy-safe audience calculations respecting notification consent preferences.
                </p>
              </div>
              <span className="rounded-full bg-[#294C38] px-3 py-1 text-xs font-semibold text-[#73D393] border border-[#444139] w-fit flex items-center gap-1">
                <ShieldCheck className="size-3.5 text-[#43A66A]" /> Store-Scoped & Consent-Aware
              </span>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {segments.map((seg) => (
                <div
                  key={seg.id}
                  className="flex flex-col justify-between rounded-xl border border-[#3A3831] bg-[#302F29] p-4 transition-all duration-150 hover:border-[#5B533F] hover:bg-[#35332C]"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-[#F5F1E8]">{seg.name}</span>
                      <span className="rounded-full bg-[#35332C] px-2 py-0.5 text-xs font-semibold text-[#DDBB72] border border-[#444139]">
                        {seg.estimatedCount} Reach
                      </span>
                    </div>
                    {seg.description && (
                      <p className="mt-1 text-xs text-[#9E988C] line-clamp-2">{seg.description}</p>
                    )}
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#3A3831] flex items-center justify-between text-xs text-[#9E988C]">
                    <span>Target criteria</span>
                    <button
                      type="button"
                      onClick={() => setIsCampaignModalOpen(true)}
                      className="flex items-center gap-1 text-[#C49A45] hover:text-[#DDBB72] font-medium transition-colors"
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
