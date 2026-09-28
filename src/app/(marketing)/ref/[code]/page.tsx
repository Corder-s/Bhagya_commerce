"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Gift, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { loyaltyService } from "@/services/loyalty.service";

export default function ReferralLandingPage() {
  const params = useParams();
  const router = useRouter();
  const code = (params?.code as string) || "";
  const [isActivating, setIsActivating] = React.useState(true);
  const [activationMessage, setActivationMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!code) return;

    // Persist code in browser storage and cookie for checkout attribution
    try {
      localStorage.setItem("bhagya_referral_code", code);
      document.cookie = `bhagya_ref_code=${encodeURIComponent(code)}; path=/; max-age=2592000; SameSite=Lax`;
    } catch {
      // Storage access blocked or in incognito
    }

    loyaltyService.recordReferralAttribution(code)
      .then((res) => {
        setActivationMessage(res.message || "Referral reward activated for your first artisan purchase!");
      })
      .catch(() => {
        setActivationMessage("Referral link recognized! Complete your first purchase to claim your reward.");
      })
      .finally(() => {
        setIsActivating(false);
      });
  }, [code]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="max-w-md w-full rounded-2xl border border-cream-200/80 bg-white/95 p-8 shadow-xl shadow-stone-900/5 backdrop-blur-md dark:border-charcoal-700 dark:bg-charcoal-900/90 text-center"
      >
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-sage-50 text-sage-600 dark:bg-sage-950/40 dark:text-sage-400 border border-sage-200/60 dark:border-sage-800/40">
          <Gift className="h-8 w-8" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-sage-100/80 text-sage-800 dark:bg-sage-900/50 dark:text-sage-300 mb-3">
          <Sparkles className="h-3.5 w-3.5 text-accent-500" /> Patron Invitation
        </div>

        <h1 className="font-serif text-2xl font-bold text-stone-900 dark:text-cream-50 sm:text-3xl">
          Welcome to Bhagya Commerce
        </h1>

        <p className="mt-3 text-sm text-stone-600 dark:text-charcoal-300">
          You were invited by a fellow patron to discover our curated collection of certified authentic heritage crafts and organic botanicals.
        </p>

        <div className="my-6 rounded-xl border border-dashed border-sage-300 bg-sage-50/60 p-4 dark:border-sage-800 dark:bg-sage-950/30">
          <p className="text-xs uppercase tracking-wider text-sage-700 dark:text-sage-300 font-medium">
            Active Referral Voucher
          </p>
          <p className="mt-1 font-mono text-xl font-bold tracking-widest text-stone-900 dark:text-cream-100">
            {code || "ARTISAN-WELCOME"}
          </p>
          <div className="mt-2 flex items-center justify-center gap-1.5 text-xs text-sage-700 dark:text-sage-400">
            <CheckCircle2 className="h-4 w-4 text-sage-600" />
            <span>
              {isActivating ? "Activating referral code..." : activationMessage}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            variant="primary"
            className="w-full justify-center gap-2 py-3 text-base shadow-md shadow-sage-900/10"
            onClick={() => router.push("/shop")}
          >
            <span>Explore Handcrafted Catalog</span>
            <ArrowRight className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            className="w-full justify-center text-sm"
            onClick={() => router.push("/register")}
          >
            Create Patron Account
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
