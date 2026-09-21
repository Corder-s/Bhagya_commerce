"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const Drawer = DialogPrimitive.Root;
const DrawerTrigger = DialogPrimitive.Trigger;
const DrawerClose = DialogPrimitive.Close;

export interface DrawerContentProps
  extends React.ComponentProps<typeof DialogPrimitive.Content> {
  title: string;
  description?: string;
  hideTitle?: boolean;
  side?: "right" | "left" | "bottom";
  size?: "sm" | "md" | "lg";
  footer?: React.ReactNode;
}

const sizeStyles = {
  right: {
    sm: "w-[min(88vw,22rem)]",
    md: "w-[min(92vw,26rem)]",
    lg: "w-[min(94vw,34rem)]",
  },
  left: {
    sm: "w-[min(88vw,22rem)]",
    md: "w-[min(92vw,26rem)]",
    lg: "w-[min(94vw,34rem)]",
  },
  bottom: {
    sm: "h-[min(45dvh,22rem)]",
    md: "h-[min(70dvh,32rem)]",
    lg: "h-[min(88dvh,44rem)]",
  },
} as const;

const sideStyles = {
  right: "right-0 top-0 h-dvh border-l data-[state=open]:slide-in-from-right",
  left: "left-0 top-0 h-dvh border-r data-[state=open]:slide-in-from-left",
  bottom:
    "bottom-0 left-0 w-full rounded-t-xl border-t data-[state=open]:slide-in-from-bottom",
} as const;

/**
 * Drawer — the mobile-native pattern: navigation, filters, cart.
 *
 * Built on Radix Dialog so focus trapping, `Esc`, `aria-modal` and the
 * scroll-lock are handled correctly, while the surface behaves like a sheet
 * rather than a centred dialog. Swipe-to-dismiss is intentionally omitted in
 * Phase 1 — a close button and the overlay cover the same ground without the
 * gesture-conflict risk inside scrollable panels.
 */
function DrawerContent({
  className,
  title,
  description,
  hideTitle = false,
  side = "right",
  size = "md",
  footer,
  children,
  ...props
}: DrawerContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        data-slot="drawer-overlay"
        className={cn(
          "fixed inset-0 z-overlay bg-deep/45 backdrop-blur-[2px]",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
        )}
      />
      <DialogPrimitive.Content
        data-slot="drawer-content"
        className={cn(
          "fixed z-drawer flex flex-col overflow-hidden bg-surface shadow-xl",
          "border-line",
          "duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out",
          sideStyles[side],
          sizeStyles[side][size],
          className,
        )}
        {...props}
      >
        <header
          className={cn(
            "flex items-center justify-between gap-4 border-b border-line px-5 py-4",
            hideTitle && "pointer-events-none absolute inset-x-0 top-0 border-0 p-0",
          )}
        >
          <DialogPrimitive.Title
            data-slot="drawer-title"
            className={cn(
              "font-sans text-heading-md text-ink",
              hideTitle && "sr-only",
            )}
          >
            {title}
          </DialogPrimitive.Title>
          {description ? (
            <DialogPrimitive.Description
              className={cn("text-body-sm text-ink-soft", hideTitle && "sr-only")}
            >
              {description}
            </DialogPrimitive.Description>
          ) : null}

          <DialogPrimitive.Close
            aria-label={`Close ${title}`}
            className={cn(
              "grid size-10 shrink-0 place-items-center rounded-md text-ink-soft",
              "transition-colors duration-fast ease-brand",
              "hover:bg-soft-green hover:text-primary",
              "focus-visible:outline-2 focus-visible:outline-offset-2",
              hideTitle && "pointer-events-auto absolute right-4 top-4",
            )}
          >
            <X className="size-4" aria-hidden="true" />
          </DialogPrimitive.Close>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5">
          {children}
        </div>

        {footer ? (
          <footer className="border-t border-line px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            {footer}
          </footer>
        ) : null}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export { Drawer, DrawerClose, DrawerContent, DrawerTrigger };
