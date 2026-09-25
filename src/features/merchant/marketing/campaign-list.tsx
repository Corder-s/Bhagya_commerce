'use client';

import React, { useState } from 'react';
import {
  marketingApiService,
  type BackendCampaign,
} from '@/lib/api/services';
import { formatPrice } from '@/lib/format';
import { Badge } from '@/components/ui/badge';
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
          <Badge tone="success" className="animate-pulse">
            <Play className="mr-1 h-3 w-3" /> Running
          </Badge>
        );
      case 'SCHEDULED':
        return (
          <Badge tone="warning">
            <Clock className="mr-1 h-3 w-3" /> Scheduled
          </Badge>
        );
      case 'COMPLETED':
        return (
          <Badge tone="outline">
            <CheckCircle2 className="mr-1 h-3 w-3 text-emerald-600" /> Completed
          </Badge>
        );
      case 'PAUSED':
        return (
          <Badge tone="warning">
            <Pause className="mr-1 h-3 w-3" /> Paused
          </Badge>
        );
      case 'FAILED':
        return (
          <Badge tone="danger">
            <AlertCircle className="mr-1 h-3 w-3" /> Failed
          </Badge>
        );
      case 'CANCELLED':
        return <Badge tone="neutral">Cancelled</Badge>;
      case 'DRAFT':
      default:
        return <Badge tone="neutral">Draft</Badge>;
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'EMAIL':
        return <Mail className="h-4 w-4 text-blue-600" />;
      case 'WHATSAPP':
        return <Smartphone className="h-4 w-4 text-emerald-600" />;
      case 'SMS':
        return <Smartphone className="h-4 w-4 text-amber-600" />;
      default:
        return <Megaphone className="h-4 w-4" />;
    }
  };

  if (!campaigns || campaigns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface/50 p-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
          <Megaphone className="h-7 w-7" />
        </div>
        <h3 className="font-serif text-lg font-semibold text-charcoal">No campaigns launched yet</h3>
        <p className="mt-1 max-w-sm text-sm text-charcoal-muted">
          Promote seasonal artisan collections, announce offers, and connect with your verified customers via WhatsApp, Email, or SMS.
        </p>
        <Button variant="primary" size="md" className="mt-6" onClick={onOpenCreate}>
          Create First Campaign
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
              <th className="px-6 py-4">Campaign</th>
              <th className="px-6 py-4">Channel</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Audience</th>
              <th className="px-6 py-4">Scheduled / Sent</th>
              <th className="px-6 py-4">Attributed Revenue</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {campaigns.map((camp) => (
              <tr key={camp.id} className="transition-colors hover:bg-surface-elevated/40">
                <td className="px-6 py-4">
                  <div className="font-medium text-charcoal">{camp.name}</div>
                  {camp.description && (
                    <div className="line-clamp-1 text-xs text-charcoal-muted">{camp.description}</div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 font-medium text-charcoal">
                    {getChannelIcon(camp.channel)}
                    <span className="capitalize text-xs">{camp.channel.toLowerCase()}</span>
                  </div>
                </td>
                <td className="px-6 py-4">{renderStatusBadge(camp.status)}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1 text-charcoal">
                    <Users className="h-3.5 w-3.5 text-charcoal-muted" />
                    <span>{camp.totalRecipients || 0}</span>
                  </div>
                  {camp.sentCount ? (
                    <div className="text-[11px] text-charcoal-muted">
                      {camp.sentCount} sent ({camp.deliveredCount || 0} delivered)
                    </div>
                  ) : null}
                </td>
                <td className="px-6 py-4 text-xs text-charcoal-muted">
                  {camp.scheduledAt ? (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{new Date(camp.scheduledAt).toLocaleDateString()}</span>
                    </div>
                  ) : camp.startedAt ? (
                    <span>{new Date(camp.startedAt).toLocaleDateString()}</span>
                  ) : (
                    <span>—</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1 font-medium text-charcoal">
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                    <span>{formatPrice(camp.attributedSales || 0)}</span>
                  </div>
                  <div className="text-[11px] text-charcoal-muted">
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
                        <Play className="mr-1 h-3 w-3" /> Launch
                      </Button>
                    )}
                    {camp.status === 'RUNNING' && (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={actionLoadingId === camp.id}
                        onClick={() => handlePause(camp.id)}
                      >
                        <Pause className="mr-1 h-3 w-3" /> Pause
                      </Button>
                    )}
                    {(camp.status === 'DRAFT' || camp.status === 'SCHEDULED' || camp.status === 'RUNNING') && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        disabled={actionLoadingId === camp.id}
                        onClick={() => handleCancel(camp.id)}
                      >
                        <XCircle className="h-3.5 w-3.5" />
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
            className="rounded-xl border border-border bg-surface p-4 shadow-xs space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium text-charcoal">{camp.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1 text-xs text-charcoal-muted capitalize">
                    {getChannelIcon(camp.channel)}
                    {camp.channel.toLowerCase()}
                  </div>
                  <span className="text-border">•</span>
                  <span className="text-xs text-charcoal-muted">{camp.totalRecipients || 0} audience</span>
                </div>
              </div>
              <div>{renderStatusBadge(camp.status)}</div>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-ivory/60 p-2.5 text-xs">
              <div>
                <span className="text-charcoal-muted">Attributed Sales:</span>{' '}
                <strong className="text-charcoal">{formatPrice(camp.attributedSales || 0)}</strong>
              </div>
              <div>
                <span className="text-charcoal-muted">Orders:</span>{' '}
                <strong className="text-charcoal">{camp.attributedOrders || 0}</strong>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1 border-t border-border">
              {(camp.status === 'DRAFT' || camp.status === 'SCHEDULED') && (
                <Button
                  variant="primary"
                  size="sm"
                  disabled={actionLoadingId === camp.id}
                  onClick={() => handleLaunch(camp.id)}
                >
                  <Play className="mr-1 h-3 w-3" /> Launch Now
                </Button>
              )}
              {camp.status === 'RUNNING' && (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={actionLoadingId === camp.id}
                  onClick={() => handlePause(camp.id)}
                >
                  <Pause className="mr-1 h-3 w-3" /> Pause
                </Button>
              )}
              {(camp.status === 'DRAFT' || camp.status === 'SCHEDULED' || camp.status === 'RUNNING') && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600"
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
