"use client";

import { Eye, EyeOff, RotateCcw } from "lucide-react";
import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { LiveStorePreview } from "@/features/merchant/components/live-store-preview";
import { OnboardingStepper } from "@/features/merchant/components/onboarding-stepper";
import { BrandingStep } from "@/features/merchant/components/steps/branding-step";
import { BusinessStep } from "@/features/merchant/components/steps/business-step";
import { CategoryStep } from "@/features/merchant/components/steps/category-step";
import { CompleteStep } from "@/features/merchant/components/steps/complete-step";
import { ReviewStep } from "@/features/merchant/components/steps/review-step";
import { StoreStep } from "@/features/merchant/components/steps/store-step";
import type {
  MerchantOnboardingData,
  OnboardingStepId,
  Store,
} from "@/features/merchant/merchant-types";
import { slugifyStoreName } from "@/features/merchant/merchant-utils";
import { toast } from "@/lib/toast";
import { merchantService } from "@/services/merchant.service";

const INITIAL_ONBOARDING_DATA: MerchantOnboardingData = {
  businessName: "",
  ownerName: "",
  contactEmail: "",
  contactPhone: "",
  businessType: "individual",
  storeName: "",
  storeSlug: "",
  storeDescription: "",
  storeTagline: "",
  primaryCategoryId: "handmade-crafts",
  specialtyTags: [],
  brandAccent: "#C49A45",
  agreedToCharter: true,
  currentStep: "business",
  completedSteps: [],
};

export function MerchantOnboardingWizard() {
  const { user, refreshUser } = useAuth();
  const [data, setData] = React.useState<MerchantOnboardingData>(INITIAL_ONBOARDING_DATA);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [createdStore, setCreatedStore] = React.useState<Store | null>(null);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [showMobilePreview, setShowMobilePreview] = React.useState(false);

  // Load saved draft or initialize from current user
  React.useEffect(() => {
    async function initWizard() {
      setIsLoading(true);
      try {
        const draft = await merchantService.getOnboardingDraft();
        if (draft && draft.currentStep) {
          setData(draft);
        } else if (user) {
          // Pre-populate user defaults
          setData((prev) => ({
            ...prev,
            ownerName: user.name || "",
            contactEmail: user.email || "",
            contactPhone: user.phone || "",
          }));
        }
      } catch {
        // Safe fallback
      } finally {
        setIsLoading(false);
      }
    }
    initWizard();
  }, [user]);

  // Update wizard data and sync draft
  const updateData = React.useCallback((fields: Partial<MerchantOnboardingData>) => {
    setData((prev) => {
      const next = { ...prev, ...fields };
      merchantService.saveOnboardingDraft(next);
      return next;
    });
  }, []);

  // Step transitions
  const handleStepComplete = (stepId: OnboardingStepId, nextStepId: OnboardingStepId) => {
    setData((prev) => {
      const completed = prev.completedSteps.includes(stepId)
        ? prev.completedSteps
        : [...prev.completedSteps, stepId];
      const next = {
        ...prev,
        currentStep: nextStepId,
        completedSteps: completed,
      };
      merchantService.saveOnboardingDraft(next);
      return next;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStepBack = (prevStepId: OnboardingStepId) => {
    setData((prev) => {
      const next = { ...prev, currentStep: prevStepId };
      merchantService.saveOnboardingDraft(next);
      return next;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDirectStepJump = (stepId: OnboardingStepId) => {
    setData((prev) => {
      const next = { ...prev, currentStep: stepId };
      merchantService.saveOnboardingDraft(next);
      return next;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleResetDraft = async () => {
    if (confirm("Reset onboarding form? All unsaved draft details will be cleared.")) {
      await merchantService.clearOnboardingDraft();
      setData({
        ...INITIAL_ONBOARDING_DATA,
        ownerName: user?.name || "",
        contactEmail: user?.email || "",
        contactPhone: user?.phone || "",
      });
      toast.info("Draft Reset", "Onboarding form has been reset.");
    }
  };

  // Final Store Submission
  const handleCreateStore = async () => {
    if (!user) {
      toast.error("Session required", "Please sign in to complete store creation.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await merchantService.createStore(data, user.id);
      if (result.success && result.store) {
        setCreatedStore(result.store);
        await refreshUser();
        setData((prev) => ({
          ...prev,
          currentStep: "complete",
          completedSteps: ["business", "store", "category", "branding", "review", "complete"],
        }));
        toast.success("Store Created!", `"${result.store.name}" is now live.`);
      }
    } catch (err: any) {
      setSubmitError(err.message || "Failed to create your store. Please try again.");
      toast.error("Creation Failed", err.message || "Could not complete store creation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3">
        <div className="size-8 rounded-full border-2 border-[#C49A45] border-t-transparent animate-spin" />
        <p className="text-body-sm text-ink-soft">Loading onboarding workspace...</p>
      </div>
    );
  }

  // If completed, show complete step
  if (data.currentStep === "complete" && createdStore) {
    return <CompleteStep store={createdStore} />;
  }

  return (
    <div className="space-y-8">
      {/* Stepper Progress Bar */}
      <div className="flex items-center justify-between gap-4 border-b border-line pb-4">
        <div className="flex-1">
          <OnboardingStepper
            currentStepId={data.currentStep}
            completedSteps={data.completedSteps}
            onStepClick={handleDirectStepJump}
          />
        </div>

        {/* Reset Draft Button */}
        <button
          type="button"
          onClick={handleResetDraft}
          title="Reset Draft"
          className="hidden sm:flex items-center gap-1 text-xs text-ink-soft hover:text-danger p-2 rounded-lg hover:bg-surface-subtle transition-colors shrink-0"
        >
          <RotateCcw className="size-3.5" />
          <span>Reset Draft</span>
        </button>
      </div>

      {/* Mobile Live Preview Toggle */}
      <div className="lg:hidden flex items-center justify-between p-3 rounded-xl bg-surface border border-line">
        <span className="text-caption text-ink-soft">
          Live Storefront Preview
        </span>
        <button
          type="button"
          onClick={() => setShowMobilePreview(!showMobilePreview)}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#9A6A20] dark:text-[#C49A45]"
        >
          {showMobilePreview ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
          {showMobilePreview ? "Hide Preview" : "Show Preview"}
        </button>
      </div>

      {showMobilePreview && (
        <div className="lg:hidden animate-in fade-in duration-200">
          <LiveStorePreview data={data} />
        </div>
      )}

      {/* Desktop Split Grid: Left = Step Form, Right = Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Multi-Step Form */}
        <div className="lg:col-span-7">
          <Card variant="surface" padding="lg" radius="xl" className="border-line shadow-card">
            <CardContent>
              {data.currentStep === "business" && (
                <BusinessStep
                  data={data}
                  onUpdate={updateData}
                  onNext={() => handleStepComplete("business", "store")}
                />
              )}

              {data.currentStep === "store" && (
                <StoreStep
                  data={data}
                  onUpdate={updateData}
                  onNext={() => handleStepComplete("store", "category")}
                  onBack={() => handleStepBack("business")}
                />
              )}

              {data.currentStep === "category" && (
                <CategoryStep
                  data={data}
                  onUpdate={updateData}
                  onNext={() => handleStepComplete("category", "branding")}
                  onBack={() => handleStepBack("store")}
                />
              )}

              {data.currentStep === "branding" && (
                <BrandingStep
                  data={data}
                  onUpdate={updateData}
                  onNext={() => handleStepComplete("branding", "review")}
                  onBack={() => handleStepBack("category")}
                />
              )}

              {data.currentStep === "review" && (
                <ReviewStep
                  data={data}
                  onEditStep={handleDirectStepJump}
                  onSubmit={handleCreateStore}
                  isSubmitting={isSubmitting}
                  onBack={() => handleStepBack("branding")}
                  error={submitError}
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Live Storefront Preview (Sticky on Desktop) */}
        <div className="hidden lg:block lg:col-span-5 sticky top-24">
          <LiveStorePreview data={data} />
        </div>
      </div>
    </div>
  );
}
