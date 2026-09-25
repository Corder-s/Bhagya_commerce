"use client";

import { AlertCircle, Check, Loader2, ShieldCheck, X } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import type { AIWriteActionData } from "@/features/ai/types/ai.types";

export function AIActionConfirmation({
  action,
  messageId,
  onConfirm,
}: {
  action: AIWriteActionData;
  messageId: string;
  onConfirm: (messageId: string, confirmed: boolean) => Promise<void>;
}) {
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleAction = async (confirmed: boolean) => {
    setIsProcessing(true);
    try {
      await onConfirm(messageId, confirmed);
    } finally {
      setIsProcessing(false);
    }
  };

  if (action.status === "executed") {
    return (
      <div className="flex items-center gap-2 p-3 rounded-xl border border-success/30 bg-success/10 text-success-text text-caption">
        <ShieldCheck className="size-4 shrink-0 text-success" />
        <span>Action executed successfully.</span>
      </div>
    );
  }

  if (action.status === "cancelled") {
    return (
      <div className="flex items-center gap-2 p-3 rounded-xl border border-line bg-surface-subtle text-ink-soft text-caption">
        <X className="size-4 shrink-0" />
        <span>Action cancelled by user.</span>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-2xl border border-[#C49A45]/40 bg-surface shadow-xs space-y-3">
      <div className="flex items-start gap-2.5">
        <span className="grid size-7 place-items-center rounded-lg bg-[#C49A45]/15 text-[#9A6A20] dark:text-[#C49A45] shrink-0 mt-0.5">
          <AlertCircle className="size-4" />
        </span>
        <div className="space-y-1">
          <span className="text-caption font-bold uppercase tracking-wider text-[#9A6A20] dark:text-[#C49A45] block">
            Confirmation Required
          </span>
          <p className="text-body-sm text-ink leading-relaxed">
            {action.promptMessage}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-1 border-t border-line">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleAction(false)}
          disabled={isProcessing}
          className="h-8 px-3 text-xs"
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={() => handleAction(true)}
          disabled={isProcessing}
          className="h-8 px-3 text-xs"
        >
          {isProcessing ? (
            <Loader2 className="size-3 animate-spin" />
          ) : (
            <Check className="size-3" />
          )}
          <span>Confirm & Execute</span>
        </Button>
      </div>
    </div>
  );
}
