"use client";

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuGroup = DropdownMenuPrimitive.Group;
const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
const DropdownMenuSub = DropdownMenuPrimitive.Sub;

function DropdownMenuContent({
  className,
  sideOffset = 8,
  align = "start",
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-content"
        sideOffset={sideOffset}
        align={align}
        collisionPadding={12}
        className={cn(
          "z-dropdown min-w-56 overflow-hidden rounded-md border border-line bg-surface p-1.5 text-ink shadow-lg",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-98",
          "data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1",
          className,
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

function DropdownMenuItem({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  variant?: "default" | "destructive";
}) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-item"
      data-variant={variant}
      className={cn(
        "relative flex min-h-10 cursor-pointer select-none items-center gap-2.5 rounded-sm px-2.5 py-2 text-body-sm outline-none",
        "transition-colors duration-fast ease-brand",
        "data-[highlighted]:bg-gold-soft/60 data-[highlighted]:text-gold-dark",
        "data-[disabled]:pointer-events-none data-[disabled]:text-ink-faint",
        "[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-ink-faint",
        "data-[highlighted]:[&_svg]:text-gold-dark",
        "data-[variant=destructive]:text-danger data-[variant=destructive]:data-[highlighted]:bg-danger-surface data-[variant=destructive]:[&_svg]:text-danger",
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuCheckboxItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-checkbox-item"
      className={cn(
        "relative flex min-h-10 cursor-pointer select-none items-center gap-2.5 rounded-sm py-2 pl-9 pr-2.5 text-body-sm outline-none",
        "data-[highlighted]:bg-gold-soft/60 data-[highlighted]:text-gold-dark",
        "data-[disabled]:pointer-events-none data-[disabled]:text-ink-faint",
        className,
      )}
      {...props}
    >
      <span className="absolute left-3 flex size-4 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <Check className="size-4 text-gold-dark" aria-hidden="true" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

function DropdownMenuLabel({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label>) {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-label"
      className={cn("label-text px-2.5 py-2 text-ink-faint", className)}
      {...props}
    />
  );
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-separator"
      className={cn("-mx-1.5 my-1 h-px bg-line", className)}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuTrigger,
};
