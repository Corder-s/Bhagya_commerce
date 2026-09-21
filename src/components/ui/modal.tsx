"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const Modal = DialogPrimitive.Root;
const ModalTrigger = DialogPrimitive.Trigger;
const ModalClose = DialogPrimitive.Close;

export interface ModalContentProps
  extends React.ComponentProps<typeof DialogPrimitive.Content> {
  /** Rendered as the dialog heading; required for accessible naming. */
  title: string;
  description?: string;
  /** Hides the visible heading while keeping the accessible name. */
  hideTitle?: boolean;
  showClose?: boolean;
  size?: "sm" | "md" | "lg";
  footer?: React.ReactNode;
}

const sizeStyles = {
  sm: "sm:max-w-md",
  md: "sm:max-w-lg",
  lg: "sm:max-w-2xl",
} as const;

/**
 * Modal — focused decision or short task (confirmations, quick edits, filters).
 *
 * Radix handles focus trapping, scroll locking, `Esc` and `aria-modal`; the
 * exit animation is handled by `animate-out` data-state utilities so unmount is
 * not abrupt. Content is portalled to `<body>` so no ancestor `overflow`
 * clipping can crop it.
 */
function ModalContent({
  className,
  title,
  description,
  hideTitle = false,
  showClose = true,
  size = "md",
  footer,
  children,
  ...props
}: ModalContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        data-slot="modal-overlay"
        className={cn(
          "fixed inset-0 z-overlay bg-deep/45 backdrop-blur-[2px]",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
        )}
      />
      <div
        className={cn(
          "fixed inset-0 z-modal flex items-end justify-center p-0",
          "sm:items-center sm:p-6",
          // The wrapper must not swallow clicks meant for the overlay.
          "pointer-events-none",
        )}
      >
        <DialogPrimitive.Content
          data-slot="modal-content"
          className={cn(
            "pointer-events-auto relative flex max-h-[92dvh] w-full flex-col overflow-hidden",
            "border border-line bg-surface shadow-xl",
            "rounded-t-xl sm:rounded-xl",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-4 sm:data-[state=open]:zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
            sizeStyles[size],
            className,
          )}
          {...props}
        >
          <header
            className={cn(
              "flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6 sm:py-5",
              hideTitle && "sr-only border-0 p-0",
            )}
          >
            <div className={cn("flex flex-col gap-1", hideTitle && "sr-only")}>
              <DialogPrimitive.Title
                data-slot="modal-title"
                className="text-heading-md text-ink"
              >
                {title}
              </DialogPrimitive.Title>
              {description ? (
                <DialogPrimitive.Description className="text-body-sm text-ink-soft">
                  {description}
                </DialogPrimitive.Description>
              ) : null}
            </div>

            {showClose ? (
              <DialogPrimitive.Close
                aria-label="Close dialog"
                className={cn(
                  "-mr-1 -mt-1 grid size-9 shrink-0 place-items-center rounded-md text-ink-soft",
                  "transition-colors duration-fast ease-brand",
                  "hover:bg-soft-green hover:text-primary",
                  "focus-visible:outline-2 focus-visible:outline-offset-2",
                )}
              >
                <X className="size-4" aria-hidden="true" />
              </DialogPrimitive.Close>
            ) : null}
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 text-body-sm text-ink-soft sm:px-6">
            {children}
          </div>

          {footer ? (
            <footer className="flex flex-col-reverse gap-3 border-t border-line px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
              {footer}
            </footer>
          ) : null}
        </DialogPrimitive.Content>
      </div>
    </DialogPrimitive.Portal>
  );
}

/** Convenience confirm dialog used by destructive actions later on. */
function ConfirmDialogContent({
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  tone = "default",
  children,
}: {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  tone?: "default" | "destructive";
  children?: React.ReactNode;
}) {
  return (
    <ModalContent
      title={title}
      description={description}
      size="sm"
      footer={
        <>
          <DialogPrimitive.Close asChild>
            <button
              type="button"
              className="h-11 rounded-md border border-line-strong px-5 text-body-sm font-medium text-ink transition-colors duration-fast hover:bg-canvas-deep focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {cancelLabel}
            </button>
          </DialogPrimitive.Close>
          <DialogPrimitive.Close asChild>
            <button
              type="button"
              onClick={onConfirm}
              className={cn(
                "h-11 rounded-md px-5 text-body-sm font-medium text-white transition-colors duration-fast focus-visible:outline-2 focus-visible:outline-offset-2",
                tone === "destructive"
                  ? "bg-danger hover:bg-[#8f1e1e]"
                  : "bg-primary hover:bg-primary-hover",
              )}
            >
              {confirmLabel}
            </button>
          </DialogPrimitive.Close>
        </>
      }
    >
      {children}
    </ModalContent>
  );
}

export { ConfirmDialogContent, Modal, ModalClose, ModalContent, ModalTrigger };
