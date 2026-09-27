'use client';

import React, { useState } from 'react';
import {
  marketingApiService,
  type BackendCampaign,
} from '@/lib/api/services';
import { formatPrice } from '@/lib/format';
import { Button } from '@/components/ui/button';
import {
  Megaphone,
  Mail,
  Smartphone,
  Play,
  Pause,
  XCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Users,
  Calendar,
} from 'lucide-react';

interface CampaignListProps {
  campaigns: BackendCampaign[];
  onRefresh: () => void;
  onOpenCreate: () => void;
}

export function CampaignList({
  campaigns,
  onRefresh,
  onOpenCreate,
}: CampaignListProps) {
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const handleLaunch = async (id: string) => {
    try {
      setActionLoadingId(id);
      await marketingApiService.launchCampaign(id);
      onRefresh();
    } catch (err) {
      console.error('Failed to launch campaign', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handlePause = async (id: string) => {
    try {
      setActionLoadingId(id);
      await marketingApiService.pauseCampaign(id);
      onRefresh();
    } catch (err) {
      console.error('Failed to pause campaign', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCancel = async (id: string) => {
    try {
      setActionLoadingId(id);
      await marketingApiService.cancelCampaign(id);
      onRefresh();
    } catch (err) {
      console.error('Failed to cancel campaign', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'RUNNING':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#294C38] px-2.5 py-0.5 text-xs font-semibold text-[#73D393] border border-[#444139] animate-pulse">
            <Play className="size-3" /> Running
          </span>
        );
      case 'SCHEDULED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#4A3B24] px-2.5 py-0.5 text-xs font-semibold text-[#DDBB72] border border-[#444139]">
            <Clock className="size-3" /> Scheduled
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#35332C] px-2.5 py-0.5 text-xs font-semibold text-[#F5F1E8] border border-[#444139]">
            <CheckCircle2 className="size-3 text-[#43A66A]" /> Completed
          </span>
        );
      case 'PAUSED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#4A3B24] px-2.5 py-0.5 text-xs font-semibold text-[#DDBB72] border border-[#444139]">
            <Pause className="size-3" /> Paused
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#4A2924] px-2.5 py-0.5 text-xs font-semibold text-[#F09284] border border-[#444139]">
            <AlertCircle className="size-3" /> Failed
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#34322B] px-2.5 py-0.5 text-xs font-semibold text-[#C8C1B4] border border-[#444139]">
            Cancelled
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

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'EMAIL':
        return <Mail className="size-4 text-[#4A96D8]" />;
      case 'WHATSAPP':
        return <Smartphone className="size-4 text-[#73D393]" />;
      case 'SMS':
        return <Smartphone className="size-4 text-[#DDBB72]" />;
      default:
        return <Megaphone className="size-4 text-[#E89535]" />;
    }
  };

  if (!campaigns || campaigns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-surface p-12 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-[#FFF6ED] dark:bg-[#33241C] text-[#E89535] dark:text-[#F0A349] mb-4">
          <Megaphone className="size-7" />
        </div>
        <h3 className="font-display text-lg font-semibold text-ink">No campaigns launched yet</h3>
        <p className="mt-1 max-w-sm text-sm text-ink-soft">
          Promote seasonal artisan collections, announce offers, and connect with your verified customers via WhatsApp, Email, or SMS.
        </p>
        <Button
          variant="primary"
          size="md"
          className="mt-6"
          onClick={onOpenCreate}
        >
          Create First Campaign
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
              <th className="px-6 py-4">Campaign</th>
              <th className="px-6 py-4">Channel</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Audience</th>
              <th className="px-6 py-4">Scheduled / Sent</th>
              <th className="px-6 py-4">Attributed Revenue</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {campaigns.map((camp) => (
              <tr key={camp.id} className="transition-colors hover:bg-surface-subtle/50">
                <td className="px-6 py-4">
                  <div className="font-medium text-ink">{camp.name}</div>
                  {camp.description && (
                    <div className="line-clamp-1 text-xs text-ink-soft">{camp.description}</div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 font-medium text-ink">
                    {getChannelIcon(camp.channel)}
                    <span className="capitalize text-xs">{camp.channel.toLowerCase()}</span>
                  </div>
                </td>
                <td className="px-6 py-4">{renderStatusBadge(camp.status)}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1 text-ink">
                    <Users className="size-3.5 text-ink-soft" />
                    <span>{camp.totalRecipients || 0}</span>
                  </div>
                  {camp.sentCount ? (
                    <div className="text-[11px] text-ink-soft">
                      {camp.sentCount} sent ({camp.deliveredCount || 0} delivered)
                    </div>
                  ) : null}
                </td>
                <td className="px-6 py-4 text-xs text-ink-soft">
                  {camp.scheduledAt ? (
                    <div className="flex items-center gap-1">
                      <Calendar className="size-3.5" />
                      <span>{new Date(camp.scheduledAt).toLocaleDateString()}</span>
                    </div>
                  ) : camp.startedAt ? (
                    <span>{new Date(camp.startedAt).toLocaleDateString()}</span>
                  ) : (
                    <span>—</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1 font-medium text-ink">
                    <TrendingUp className="size-3.5 text-[#4E7C59]" />
                    <span>{formatPrice(camp.attributedSales || 0)}</span>
                  </div>
                  <div className="text-[11px] text-ink-soft">
                    {camp.attributedOrders || 0} orders
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {(camp.status === 'DRAFT' || camp.status === 'SCHEDULED') && (
                      <Button
                        variant="primary"
                        size="sm"
                        disabled={actionLoadingId === camp.id}
                        onClick={() => handleLaunch(camp.id)}
                      >
                        <Play className="mr-1 size-3" /> Launch
                      </Button>
                    )}
                    {camp.status === 'RUNNING' && (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={actionLoadingId === camp.id}
                        onClick={() => handlePause(camp.id)}
                        className="border-line bg-surface hover:bg-surface-subtle"
                      >
                        <Pause className="mr-1 size-3" /> Pause
                      </Button>
                    )}
                    {(camp.status === 'DRAFT' || camp.status === 'SCHEDULED' || camp.status === 'RUNNING') && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-line text-danger hover:bg-danger-surface/40 hover:border-danger/40"
                        disabled={actionLoadingId === camp.id}
                        onClick={() => handleCancel(camp.id)}
                        title="Cancel campaign"
                      >
                        <XCircle className="size-3.5" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Card View */}
      <div className="space-y-3 md:hidden">
        {campaigns.map((camp) => (
          <div
            key={camp.id}
            className="rounded-xl border border-line bg-surface p-4 shadow-sm space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium text-ink">{camp.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1 text-xs text-ink-soft capitalize">
                    {getChannelIcon(camp.channel)}
                    {camp.channel.toLowerCase()}
                  </div>
                  <span className="text-ink-soft">•</span>
                  <span className="text-xs text-ink-soft">{camp.totalRecipients || 0} reach</span>
                </div>
              </div>
              <div>{renderStatusBadge(camp.status)}</div>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-surface-subtle p-2.5 text-xs border border-line">
              <div>
                <span className="text-ink-soft">Attributed Sales:</span>{' '}
                <strong className="text-ink">{formatPrice(camp.attributedSales || 0)}</strong>
              </div>
              <div>
                <span className="text-ink-soft">Orders:</span>{' '}
                <strong className="text-ink">{camp.attributedOrders || 0}</strong>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1 border-t border-line">
              {(camp.status === 'DRAFT' || camp.status === 'SCHEDULED') && (
                <Button
                  variant="primary"
                  size="sm"
                  disabled={actionLoadingId === camp.id}
                  onClick={() => handleLaunch(camp.id)}
                >
                  <Play className="mr-1 size-3" /> Launch Now
                </Button>
              )}
              {camp.status === 'RUNNING' && (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={actionLoadingId === camp.id}
                  onClick={() => handlePause(camp.id)}
                  className="border-line bg-surface"
                >
                  <Pause className="mr-1 size-3" /> Pause
                </Button>
              )}
              {(camp.status === 'DRAFT' || camp.status === 'SCHEDULED' || camp.status === 'RUNNING') && (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-line text-danger hover:bg-danger-surface/40"
                  disabled={actionLoadingId === camp.id}
                  onClick={() => handleCancel(camp.id)}
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
