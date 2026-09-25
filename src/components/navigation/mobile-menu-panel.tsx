"use client";

import { LogIn, Store } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { BrandMark } from "@/components/common/brand-mark";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent } from "@/components/ui/drawer";
import { footerNav, primaryNav } from "@/config/navigation";
import { categories } from "@/data/categories";
import { authRoutes, marketingRoutes } from "@/config/routes";
import { cn } from "@/lib/utils";

/**
 * MobileMenuPanel — the phone "everything else" sheet.
 *
 * Split out of `mobile-menu.tsx` and loaded on demand: the panel only exists
 * once the sheet is opened, so its markup and the drawer primitive stay out of
 * the first page load. The trigger lives in the header and is always present.
 *
 * Pulling down to the tab bar, this sheet holds destinations that do not fit in
 * the five tab slots — account, selling and support — each as a large row that
 * closes the sheet on activation.
 */
export function MobileMenuPanel({
  open,
  onOpenChange,
  className,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
}) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        title="Menu"
        description="Browse Bhagya Commerce"
        side="left"
        size="md"
        className={cn("rounded-none sm:rounded-r-xl", className)}
        footer={
          <div className="flex flex-col gap-2.5">
            <Button asChild variant="primary" size="md" fullWidth>
              <Link href={marketingRoutes.startSelling}>
                <Store aria-hidden="true" />
                Start Selling
              </Link>
            </Button>
            <Button asChild variant="outline" size="md" fullWidth>
              <Link href={authRoutes.login}>
                <LogIn aria-hidden="true" />
                Log in
              </Link>
            </Button>
            <p className="pt-1 text-center text-caption text-ink-soft">
              New here?{" "}
              <Link
                href={authRoutes.register}
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        }
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <BrandMark variant="compact" size="sm" />
            <ThemeToggle />
          </div>

          <div className="flex flex-col gap-2 rounded-xl bg-canvas-deep/40 p-3 border border-line/60">
            <span className="text-caption font-medium text-ink-soft">Theme appearance</span>
            <ThemeToggle variant="segmented" className="w-full justify-between" />
          </div>

          <nav aria-label="Mobile primary">
            <ul className="flex flex-col">
              {primaryNav.map((item) => (
                <li key={`${item.href}-${item.label}`}>
                  <DrawerClose asChild>
                    <Link
                      href={item.href}
                      className="flex min-h-12 items-center justify-between gap-4 rounded-md px-2 text-heading-md text-ink transition-colors duration-fast hover:bg-gold-soft/50 hover:text-gold-dark"
                    >
                      {item.label}
                      <span aria-hidden="true" className="text-ink-faint">
                        →
                      </span>
                    </Link>
                  </DrawerClose>
                </li>
              ))}
            </ul>
          </nav>

          <div className="h-px bg-line" />

          <nav aria-label="Shop by category">
            <p className="label-text mb-3 text-ink-faint">Shop by category</p>
            <ul className="grid grid-cols-2 gap-2">
              {categories.slice(0, 6).map((category) => (
                <li key={category.slug}>
                  <DrawerClose asChild>
                    <Link
                      href={{
                        pathname: marketingRoutes.shop,
                        query: { category: category.slug },
                      }}
                      className="flex min-h-12 items-center rounded-md border border-line px-3 text-body-sm font-medium text-ink-soft transition-colors duration-fast hover:border-gold hover:bg-gold-soft/40 hover:text-gold-dark"
                    >
                      {category.name}
                    </Link>
                  </DrawerClose>
                </li>
              ))}
            </ul>
          </nav>

          <div className="h-px bg-line" />

          <div className="flex flex-col gap-5">
            {footerNav.slice(0, 3).map((column) => (
              <div key={column.title} className="flex flex-col gap-2">
                <h2 className="label-text text-ink-faint">{column.title}</h2>
                <ul className="flex flex-col gap-1">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <DrawerClose asChild>
                        <Link
                          href={link.href}
                          className="flex min-h-9 items-center text-body-sm text-ink-soft transition-colors duration-fast hover:text-primary"
                        >
                          {link.label}
                        </Link>
                      </DrawerClose>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
