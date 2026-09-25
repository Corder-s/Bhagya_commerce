'use client';

import React, { useState, useEffect } from 'react';
import {
  marketingApiService,
  type BackendCampaignCreateRequest,
  type BackendCustomerSegment,
  type BackendPromotion,
} from '@/lib/api/services';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  X,
  Megaphone,
  Users,
  MessageSquare,
  Radio,
  Calendar,
  CheckCircle2,
  Sparkles,
  Mail,
  Smartphone,
  ArrowRight,
  ArrowLeft,
  Loader2,
} from 'lucide-react';

interface CampaignBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
  promotions: BackendPromotion[];
}

const STEPS = [
  { step: 1, title: 'Details' },
  { step: 2, title: 'Audience' },
  { step: 3, title: 'Content' },
  { step: 4, title: 'Channel' },
  { step: 5, title: 'Schedule' },
  { step: 6, title: 'Review' },
];

export function CampaignBuilderModal({
  isOpen,
  onClose,
  onCreated,
  promotions,
}: CampaignBuilderModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [name, setName] = useState('');
  const [purpose, setPurpose] = useState('Festive Promotion');
  const [selectedPromotionId, setSelectedPromotionId] = useState('');
  const [segments, setSegments] = useState<BackendCustomerSegment[]>([]);
  const [selectedSegmentId, setSelectedSegmentId] = useState('seg_all');
  const [channel, setChannel] = useState<'EMAIL' | 'WHATSAPP' | 'SMS'>('WHATSAPP');
  const [subject, setSubject] = useState('Exclusive Handloom Festive Savings ✨');
  const [messageBody, setMessageBody] = useState(
    'Namaste! Explore our new GI-tagged festive Katan silks with 15% off using code NAVRATRI15. View collection: https://bhagya.commerce/shop'
  );
  const [scheduleType, setScheduleType] = useState<'now' | 'later'>('now');
  const [scheduledDateTime, setScheduledDateTime] = useState('');

  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      marketingApiService.getSegments().then((res) => {
        if (res?.data && res.data.length > 0) {
          setSegments(res.data);
          setSelectedSegmentId(res.data[0].id);
        } else {
          setSegments([
            { id: 'seg_all', storeId: 'curr', name: 'All Verified Customers', estimatedCount: 142, status: 'ACTIVE', createdAt: '' },
            { id: 'seg_returning', storeId: 'curr', name: 'Repeat Buyers & Connoisseurs', estimatedCount: 38, status: 'ACTIVE', createdAt: '' },
            { id: 'seg_high_value', storeId: 'curr', name: 'High-Value Silk Collectors', estimatedCount: 24, status: 'ACTIVE', createdAt: '' },
          ]);
        }
      }).catch(() => {
        setSegments([
          { id: 'seg_all', storeId: 'curr', name: 'All Verified Customers', estimatedCount: 142, status: 'ACTIVE', createdAt: '' },
          { id: 'seg_returning', storeId: 'curr', name: 'Repeat Buyers & Connoisseurs', estimatedCount: 38, status: 'ACTIVE', createdAt: '' },
        ]);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGenerateAICopy = async () => {
    setIsGeneratingAI(true);
    try {
      const selectedPromo = promotions.find((p) => p.id === selectedPromotionId);
      const discountText = selectedPromo ? `${selectedPromo.value}% off with code ${selectedPromo.couponCode || 'FESTIVE'}` : 'exclusive artisan offer';

      const res = await marketingApiService.generateAICopy({
        purpose,
        channel,
        productName: 'GI-Certified Handloom Banarasi Silks',
        discountDetails: discountText,
      });

      if (res?.data) {
        setSubject(res.data.subject);
        setMessageBody(res.data.body);
      }
    } catch {
      // Fallback AI prompt copy
      setMessageBody(
        'Namaste! Master artisans at Varanasi Handloom Guild invite you to celebrate heritage crafts with exclusive festive privileges. Explore authentic GI-certified creations now: https://bhagya.commerce/shop'
      );
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const selectedSegment = segments.find((s) => s.id === selectedSegmentId) || segments[0];

  const handleLaunch = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const payload: BackendCampaignCreateRequest = {
        name,
        description: `Targeting: ${selectedSegment?.name || 'Audience'}`,
        channel,
        audienceId: selectedSegmentId,
        audienceName: selectedSegment?.name || 'All Verified Customers',
        promotionId: selectedPromotionId || undefined,
        subject: channel === 'EMAIL' ? subject : undefined,
        messageBody,
        scheduledAt: scheduleType === 'later' && scheduledDateTime ? new Date(scheduledDateTime).toISOString() : undefined,
      };

      const created = await marketingApiService.createCampaign(payload);
      if (created?.data?.id) {
        if (scheduleType === 'now') {
          await marketingApiService.launchCampaign(created.data.id);
        }
      }

      onCreated();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to launch campaign');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl border border-border bg-surface shadow-2xl animate-in fade-in zoom-in-95 my-auto">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border p-5 bg-surface rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Megaphone className="size-5" />
            </div>
            <div>
              <h2 className="text-heading-md font-serif text-charcoal">Marketing Campaign Builder</h2>
              <p className="text-caption text-charcoal-muted">Create, target, preview and dispatch audience promotions</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-charcoal-muted hover:bg-surface-elevated hover:text-charcoal transition-colors"
            title="Close modal"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Stepper Progress Indicator */}
        <div className="flex items-center justify-between border-b border-border/60 bg-surface-raised/40 px-6 py-3">
          {STEPS.map((s) => (
            <div key={s.step} className="flex items-center gap-2 text-caption">
              <span
                className={`flex size-6 items-center justify-center rounded-full text-xs font-semibold ${
                  currentStep === s.step
                    ? 'bg-brand-primary text-white ring-2 ring-brand-primary/30'
                    : currentStep > s.step
                    ? 'bg-emerald-700 text-white'
                    : 'bg-surface border border-border text-ink-muted'
                }`}
              >
                {currentStep > s.step ? '✓' : s.step}
              </span>
              <span className={`hidden sm:inline font-medium ${currentStep === s.step ? 'text-ink' : 'text-ink-soft'}`}>
                {s.title}
              </span>
            </div>
          ))}
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6 text-body-sm">
          {error && (
            <div className="mb-4 rounded-lg bg-rose-50 p-3 text-caption text-rose-800 border border-rose-200">
              {error}
            </div>
          )}

          {/* STEP 1: Details */}
          {currentStep === 1 && (
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-caption font-medium text-ink">Campaign Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Navratri Artisan Silk Broadcast"
                  className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-ink placeholder:text-ink-muted focus:border-brand-primary focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-caption font-medium text-ink">Campaign Purpose</label>
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-ink focus:border-brand-primary focus:outline-hidden"
                >
                  <option value="Festive Promotion">Festive Celebration Offer</option>
                  <option value="New Collection Launch">New Artisan Collection Arrival</option>
                  <option value="Repeat Customer Reward">Repeat Customer VIP Privilege</option>
                  <option value="Cart Recovery">Cart Drop-off Reminder</option>
                </select>
              </div>

              <div>
                <label className="text-caption font-medium text-ink">Attach Promotion / Coupon</label>
                <select
                  value={selectedPromotionId}
                  onChange={(e) => setSelectedPromotionId(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-ink focus:border-brand-primary focus:outline-hidden"
                >
                  <option value="">None (Informational Broadcast)</option>
                  {promotions.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {p.couponCode ? `Code: ${p.couponCode} (${p.value}${p.type.includes('PERCENTAGE') ? '%' : '₹'} off)` : `${p.value} off`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* STEP 2: Audience */}
          {currentStep === 2 && (
            <div className="flex flex-col gap-4">
              <span className="text-caption text-ink-soft">
                Select the verified customer segment to receive this promotional broadcast.
              </span>

              <div className="flex flex-col gap-3">
                {segments.map((seg) => (
                  <label
                    key={seg.id}
                    className={`flex items-center justify-between rounded-xl border p-4 cursor-pointer transition-all ${
                      selectedSegmentId === seg.id
                        ? 'border-brand-primary bg-brand-primary/5 ring-1 ring-brand-primary'
                        : 'border-border bg-surface hover:border-ink-muted'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="segment"
                        checked={selectedSegmentId === seg.id}
                        onChange={() => setSelectedSegmentId(seg.id)}
                        className="text-brand-primary focus:ring-brand-primary"
                      />
                      <div>
                        <span className="font-medium text-ink">{seg.name}</span>
                        {seg.description && <p className="text-caption text-ink-soft">{seg.description}</p>}
                      </div>
                    </div>
                    <Badge tone="neutral" size="sm">
                      ~{seg.estimatedCount} recipients
                    </Badge>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Content */}
          {currentStep === 3 && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-caption font-medium text-ink">Promotional Copy</span>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={handleGenerateAICopy}
                  disabled={isGeneratingAI}
                  className="flex items-center gap-1.5 text-xs text-brand-primary border-brand-primary/40 hover:bg-brand-primary/10"
                >
                  {isGeneratingAI ? <Loader2 className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5" />}
                  Draft with Bhagya AI
                </Button>
              </div>

              {channel === 'EMAIL' && (
                <div>
                  <label className="text-caption font-medium text-ink">Subject Line *</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter inspiring email subject..."
                    className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-ink focus:border-brand-primary focus:outline-hidden"
                  />
                </div>
              )}

              <div>
                <label className="text-caption font-medium text-ink">Message Body *</label>
                <textarea
                  rows={4}
                  required
                  value={messageBody}
                  onChange={(e) => setMessageBody(e.target.value)}
                  placeholder="Craft your artisan story, product highlights and store link..."
                  className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-ink focus:border-brand-primary focus:outline-hidden font-sans"
                />
                <span className="mt-1 block text-right text-[11px] text-ink-muted">
                  {messageBody.length} characters
                </span>
              </div>
            </div>
          )}

          {/* STEP 4: Channel */}
          {currentStep === 4 && (
            <div className="flex flex-col gap-4">
              <span className="text-caption text-ink-soft">
                Choose the communication channel. Unsubscribed customers on this channel are automatically suppressed.
              </span>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'WHATSAPP' as const, label: 'WhatsApp', icon: MessageSquare, desc: 'High engagement broadcast' },
                  { id: 'EMAIL' as const, label: 'Email', icon: Mail, desc: 'Rich editorial newsletter' },
                  { id: 'SMS' as const, label: 'SMS', icon: Smartphone, desc: 'Direct mobile alert' },
                ].map((ch) => {
                  const IconComp = ch.icon;
                  return (
                    <label
                      key={ch.id}
                      className={`flex flex-col gap-2 rounded-xl border p-4 cursor-pointer transition-all ${
                        channel === ch.id
                          ? 'border-brand-primary bg-brand-primary/5 ring-1 ring-brand-primary'
                          : 'border-border bg-surface hover:border-ink-muted'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <IconComp className={`size-5 ${channel === ch.id ? 'text-brand-primary' : 'text-ink-soft'}`} />
                        <input
                          type="radio"
                          name="channel"
                          checked={channel === ch.id}
                          onChange={() => setChannel(ch.id)}
                          className="text-brand-primary focus:ring-brand-primary"
                        />
                      </div>
                      <span className="font-medium text-ink">{ch.label}</span>
                      <span className="text-[11px] text-ink-soft">{ch.desc}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: Schedule */}
          {currentStep === 5 && (
            <div className="flex flex-col gap-4">
              <span className="text-caption text-ink-soft">
                Choose when this campaign should be queued and dispatched.
              </span>

              <div className="flex flex-col gap-3">
                <label
                  className={`flex items-center gap-3 rounded-xl border p-4 cursor-pointer ${
                    scheduleType === 'now'
                      ? 'border-brand-primary bg-brand-primary/5 ring-1 ring-brand-primary'
                      : 'border-border bg-surface'
                  }`}
                >
                  <input
                    type="radio"
                    name="schedule"
                    checked={scheduleType === 'now'}
                    onChange={() => setScheduleType('now')}
                  />
                  <div>
                    <span className="font-medium text-ink">Launch Immediately</span>
                    <p className="text-caption text-ink-soft">Dispatch to recipient queue right after review</p>
                  </div>
                </label>

                <label
                  className={`flex flex-col gap-3 rounded-xl border p-4 cursor-pointer ${
                    scheduleType === 'later'
                      ? 'border-brand-primary bg-brand-primary/5 ring-1 ring-brand-primary'
                      : 'border-border bg-surface'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="schedule"
                      checked={scheduleType === 'later'}
                      onChange={() => setScheduleType('later')}
                    />
                    <div>
                      <span className="font-medium text-ink">Schedule for Later</span>
                      <p className="text-caption text-ink-soft">Automatic dispatch at configured store time</p>
                    </div>
                  </div>

                  {scheduleType === 'later' && (
                    <input
                      type="datetime-local"
                      value={scheduledDateTime}
                      onChange={(e) => setScheduledDateTime(e.target.value)}
                      className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-ink focus:border-brand-primary focus:outline-hidden"
                    />
                  )}
                </label>
              </div>
            </div>
          )}

          {/* STEP 6: Review & Launch */}
          {currentStep === 6 && (
            <div className="flex flex-col gap-4">
              <div className="rounded-xl border border-border/80 bg-surface-raised/40 p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-border/60 pb-2">
                  <span className="text-caption text-ink-soft">Campaign</span>
                  <span className="font-medium text-ink">{name || 'Untitled Campaign'}</span>
                </div>
                <div className="flex items-center justify-between border-b border-border/60 pb-2">
                  <span className="text-caption text-ink-soft">Audience</span>
                  <span className="font-medium text-ink">
                    {selectedSegment?.name} (~{selectedSegment?.estimatedCount} recipients)
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-border/60 pb-2">
                  <span className="text-caption text-ink-soft">Channel</span>
                  <Badge tone="neutral" size="sm">{channel}</Badge>
                </div>
                <div className="flex items-center justify-between border-b border-border/60 pb-2">
                  <span className="text-caption text-ink-soft">Dispatch Time</span>
                  <span className="font-medium text-ink">
                    {scheduleType === 'now' ? 'Immediate upon confirmation' : scheduledDateTime || 'Scheduled'}
                  </span>
                </div>
                <div className="flex flex-col gap-1 pt-1">
                  <span className="text-caption text-ink-soft">Message Preview</span>
                  <p className="rounded-lg bg-surface border border-border/50 p-3 text-caption text-ink italic">
                    {messageBody}
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-caption text-emerald-900">
                ✓ Campaign delivery adheres to verified customer opt-in consent and respects provider rate limits.
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex shrink-0 items-center justify-between border-t border-border p-5 bg-surface rounded-b-2xl">
          <Button
            variant="outline"
            type="button"
            disabled={currentStep === 1 || isSubmitting}
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            className="flex items-center gap-1.5"
          >
            <ArrowLeft className="size-4" /> Back
          </Button>

          {currentStep < 6 ? (
            <Button
              variant="primary"
              type="button"
              disabled={currentStep === 1 && !name.trim()}
              onClick={() => setCurrentStep((prev) => Math.min(6, prev + 1))}
              className="flex items-center gap-1.5"
            >
              Next <ArrowRight className="size-4" />
            </Button>
          ) : (
            <Button
              variant="primary"
              type="button"
              disabled={isSubmitting || !name.trim()}
              onClick={handleLaunch}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Launching...
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-4" /> Launch Campaign
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
