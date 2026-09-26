'use client';

import React, { useState, useEffect } from 'react';
import {
  marketingApiService,
  type BackendCampaignCreateRequest,
  type BackendCustomerSegment,
  type BackendPromotion,
} from '@/lib/api/services';
import { Button } from '@/components/ui/button';
import {
  X,
  Megaphone,
  Users,
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
    'Namaste! Explore our new GI-tagged festive Katan silks with 15% off using code FESTIVE15. View collection: https://bhagya.commerce/shop'
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl border border-[#444139] bg-[#2B2A25] shadow-2xl animate-in fade-in zoom-in-95 my-auto text-[#F5F1E8]">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#3A3831] p-5 bg-[#2B2A25] rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#35332C] text-[#C49A45] border border-[#5B533F]">
              <Megaphone className="size-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-serif font-semibold text-[#F5F1E8]">Marketing Campaign Builder</h2>
              <p className="text-xs text-[#9E988C]">Create, target, preview and dispatch audience promotions</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#9E988C] hover:bg-[#35332C] hover:text-[#F5F1E8] transition-colors"
            title="Close modal"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Stepper Progress Indicator */}
        <div className="flex items-center justify-between border-b border-[#3A3831] bg-[#1C1B18] px-6 py-3 overflow-x-auto no-scrollbar gap-2">
          {STEPS.map((s) => (
            <div key={s.step} className="flex items-center gap-2 text-xs shrink-0">
              <span
                className={`flex size-6 items-center justify-center rounded-full text-xs font-semibold ${
                  currentStep === s.step
                    ? 'bg-[#C49A45] text-[#151515] ring-2 ring-[#C49A45]/40'
                    : currentStep > s.step
                    ? 'bg-[#43A66A] text-[#151515]'
                    : 'bg-[#2B2A25] border border-[#444139] text-[#9E988C]'
                }`}
              >
                {currentStep > s.step ? '✓' : s.step}
              </span>
              <span className={`hidden sm:inline font-medium ${currentStep === s.step ? 'text-[#F5F1E8]' : 'text-[#9E988C]'}`}>
                {s.title}
              </span>
            </div>
          ))}
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6 text-sm">
          {error && (
            <div className="mb-4 rounded-lg bg-[#4A2924] p-3 text-xs text-[#F09284] border border-[#D05A4A]">
              {error}
            </div>
          )}

          {/* STEP 1: Details */}
          {currentStep === 1 && (
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-medium text-[#C8C1B4]">Campaign Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Navratri Artisan Silk Broadcast"
                  className="mt-1 w-full rounded-lg border border-[#444139] bg-[#1C1B18] px-3 py-2 text-[#F5F1E8] placeholder:text-[#9E988C] focus:border-[#C49A45] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#C8C1B4]">Campaign Purpose</label>
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#444139] bg-[#1C1B18] px-3 py-2 text-[#F5F1E8] focus:border-[#C49A45] focus:outline-hidden"
                >
                  <option value="Festive Promotion">Festive Celebration Offer</option>
                  <option value="New Collection Launch">New Artisan Collection Arrival</option>
                  <option value="Repeat Customer Reward">Repeat Customer VIP Privilege</option>
                  <option value="Cart Recovery">Cart Drop-off Reminder</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-[#C8C1B4]">Attach Promotion / Coupon</label>
                <select
                  value={selectedPromotionId}
                  onChange={(e) => setSelectedPromotionId(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#444139] bg-[#1C1B18] px-3 py-2 text-[#F5F1E8] focus:border-[#C49A45] focus:outline-hidden"
                >
                  <option value="">No attached promotion (Informational broadcast)</option>
                  {promotions.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.couponCode ? `Code: ${p.couponCode}` : `${p.value}% Off`})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* STEP 2: Audience */}
          {currentStep === 2 && (
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-medium text-[#C8C1B4]">Select Verified Customer Segment</label>
                <p className="text-xs text-[#9E988C] mt-0.5">
                  Privacy-safe audience filters honoring notification preferences.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {segments.map((seg) => (
                  <div
                    key={seg.id}
                    onClick={() => setSelectedSegmentId(seg.id)}
                    className={`cursor-pointer rounded-xl border p-4 transition-all ${
                      selectedSegmentId === seg.id
                        ? 'border-[#C49A45] bg-[#35332C] shadow-xs'
                        : 'border-[#444139] bg-[#302F29] hover:border-[#5B533F]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm text-[#F5F1E8]">{seg.name}</span>
                      <span className="rounded-full bg-[#1C1B18] px-2 py-0.5 text-xs font-semibold text-[#DDBB72] border border-[#444139]">
                        {seg.estimatedCount}
                      </span>
                    </div>
                    {seg.description && (
                      <p className="mt-1.5 text-xs text-[#9E988C] line-clamp-2">{seg.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Content & AI Generation */}
          {currentStep === 3 && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#C8C1B4]">Message Copy</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateAICopy}
                  disabled={isGeneratingAI}
                  className="flex items-center gap-1.5 text-xs border-[#C49A45]/40 bg-[#35332C] text-[#DDBB72] hover:bg-[#C49A45]/20"
                >
                  {isGeneratingAI ? <Loader2 className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5" />}
                  Draft with Bhagya AI
                </Button>
              </div>

              {channel === 'EMAIL' && (
                <div>
                  <label className="text-xs font-medium text-[#C8C1B4]">Email Subject Line</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[#444139] bg-[#1C1B18] px-3 py-2 text-[#F5F1E8] focus:border-[#C49A45] focus:outline-hidden"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-medium text-[#C8C1B4]">Message Body</label>
                <textarea
                  rows={5}
                  value={messageBody}
                  onChange={(e) => setMessageBody(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#444139] bg-[#1C1B18] px-3 py-2 text-[#F5F1E8] focus:border-[#C49A45] focus:outline-hidden font-sans"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Channel */}
          {currentStep === 4 && (
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-medium text-[#C8C1B4]">Dispatch Channel</label>
                <p className="text-xs text-[#9E988C] mt-0.5">
                  Delivered through verified Bhagya messaging orchestrators.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div
                  onClick={() => setChannel('WHATSAPP')}
                  className={`cursor-pointer rounded-xl border p-4 transition-all ${
                    channel === 'WHATSAPP'
                      ? 'border-[#43A66A] bg-[#294C38]/40 shadow-xs'
                      : 'border-[#444139] bg-[#302F29] hover:border-[#5B533F]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Smartphone className="size-5 text-[#73D393]" />
                    <span className="font-medium text-sm text-[#F5F1E8]">WhatsApp</span>
                  </div>
                  <p className="mt-2 text-xs text-[#9E988C]">Interactive broadcast with verified catalog links</p>
                </div>

                <div
                  onClick={() => setChannel('EMAIL')}
                  className={`cursor-pointer rounded-xl border p-4 transition-all ${
                    channel === 'EMAIL'
                      ? 'border-[#4A96D8] bg-[#132230]/40 shadow-xs'
                      : 'border-[#444139] bg-[#302F29] hover:border-[#5B533F]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Mail className="size-5 text-[#4A96D8]" />
                    <span className="font-medium text-sm text-[#F5F1E8]">Email</span>
                  </div>
                  <p className="mt-2 text-xs text-[#9E988C]">HTML newsletter with product collection showcase</p>
                </div>

                <div
                  onClick={() => setChannel('SMS')}
                  className={`cursor-pointer rounded-xl border p-4 transition-all ${
                    channel === 'SMS'
                      ? 'border-[#C79338] bg-[#4A3B24]/40 shadow-xs'
                      : 'border-[#444139] bg-[#302F29] hover:border-[#5B533F]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Smartphone className="size-5 text-[#DDBB72]" />
                    <span className="font-medium text-sm text-[#F5F1E8]">SMS</span>
                  </div>
                  <p className="mt-2 text-xs text-[#9E988C]">Direct transactional & promotional SMS alerts</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Schedule */}
          {currentStep === 5 && (
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-medium text-[#C8C1B4]">Launch Timing</label>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div
                  onClick={() => setScheduleType('now')}
                  className={`cursor-pointer rounded-xl border p-4 transition-all ${
                    scheduleType === 'now'
                      ? 'border-[#C49A45] bg-[#35332C] shadow-xs'
                      : 'border-[#444139] bg-[#302F29] hover:border-[#5B533F]'
                  }`}
                >
                  <span className="font-medium text-sm text-[#F5F1E8]">Send Immediately</span>
                  <p className="mt-1 text-xs text-[#9E988C]">Dispatch to worker queue upon launch confirmation</p>
                </div>

                <div
                  onClick={() => setScheduleType('later')}
                  className={`cursor-pointer rounded-xl border p-4 transition-all ${
                    scheduleType === 'later'
                      ? 'border-[#C49A45] bg-[#35332C] shadow-xs'
                      : 'border-[#444139] bg-[#302F29] hover:border-[#5B533F]'
                  }`}
                >
                  <span className="font-medium text-sm text-[#F5F1E8]">Schedule for Later</span>
                  <p className="mt-1 text-xs text-[#9E988C]">Automatic queue dispatch at selected date/time</p>
                </div>
              </div>

              {scheduleType === 'later' && (
                <div className="mt-2">
                  <label className="text-xs font-medium text-[#C8C1B4]">Date & Time (Store Timezone)</label>
                  <input
                    type="datetime-local"
                    value={scheduledDateTime}
                    onChange={(e) => setScheduledDateTime(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[#444139] bg-[#1C1B18] px-3 py-2 text-[#F5F1E8] focus:border-[#C49A45] focus:outline-hidden"
                  />
                </div>
              )}
            </div>
          )}

          {/* STEP 6: Review */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <div className="rounded-xl border border-[#3A3831] bg-[#302F29] p-4 space-y-2.5">
                <div className="flex justify-between text-xs">
                  <span className="text-[#9E988C]">Campaign Name:</span>
                  <strong className="text-[#F5F1E8]">{name}</strong>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#9E988C]">Audience Target:</span>
                  <strong className="text-[#DDBB72]">{selectedSegment?.name} ({selectedSegment?.estimatedCount} reach)</strong>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#9E988C]">Channel:</span>
                  <span className="font-semibold text-[#73D393] uppercase">{channel}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#9E988C]">Timing:</span>
                  <span className="text-[#F5F1E8]">{scheduleType === 'now' ? 'Immediate Broadcast' : scheduledDateTime}</span>
                </div>
              </div>

              <div className="rounded-xl border border-[#3A3831] bg-[#1C1B18] p-4 text-xs">
                <span className="font-semibold text-[#9E988C] block mb-1">Message Preview:</span>
                <p className="text-[#F5F1E8] whitespace-pre-line">{messageBody}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex shrink-0 items-center justify-between border-t border-[#3A3831] p-5 bg-[#2B2A25] rounded-b-2xl">
          <Button
            variant="outline"
            type="button"
            disabled={currentStep === 1 || isSubmitting}
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            className="flex items-center gap-1.5 border-[#444139] bg-[#302F29] text-[#F5F1E8] hover:bg-[#35332C]"
          >
            <ArrowLeft className="size-4" /> Back
          </Button>

          {currentStep < 6 ? (
            <Button
              variant="primary"
              type="button"
              disabled={currentStep === 1 && !name.trim()}
              onClick={() => setCurrentStep((prev) => Math.min(6, prev + 1))}
              className="flex items-center gap-1.5 bg-[#C49A45] hover:bg-[#DDBB72] text-[#151515] font-semibold"
            >
              Next <ArrowRight className="size-4" />
            </Button>
          ) : (
            <Button
              variant="primary"
              type="button"
              disabled={isSubmitting || !name.trim()}
              onClick={handleLaunch}
              className="flex items-center gap-2 bg-[#C49A45] hover:bg-[#DDBB72] text-[#151515] font-semibold"
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
