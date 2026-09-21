"use client";

import { toast as sonnerToast } from "sonner";

/**
 * Toast API.
 *
 * A thin, typed wrapper over Sonner so feature code never imports the library
 * directly — swapping the toast implementation later stays a one-file change.
 * Copy guidance: title = what happened, description = what to do next.
 */
export const toast = {
  success(title: string, description?: string) {
    return sonnerToast.success(title, { description });
  },
  error(title: string, description?: string) {
    return sonnerToast.error(title, { description });
  },
  info(title: string, description?: string) {
    return sonnerToast.info(title, { description });
  },
  warning(title: string, description?: string) {
    return sonnerToast.warning(title, { description });
  },
  /** For async work: shows a loader, then swaps to success/error. */
  promise<T>(
    promise: Promise<T>,
    messages: { loading: string; success: string; error: string },
  ) {
    return sonnerToast.promise(promise, messages);
  },
  dismiss(id?: string | number) {
    sonnerToast.dismiss(id);
  },
} as const;

export type ToastApi = typeof toast;
