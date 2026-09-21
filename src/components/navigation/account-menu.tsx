"use client";

import {
  Heart,
  LogIn,
  LogOut,
  MapPin,
  Package,
  Settings2,
  Store,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { IconButton } from "@/components/ui/icon-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { accountRoutes, authRoutes, merchantRoutes } from "@/config/routes";

/**
 * AccountMenu — the single identity surface.
 *
 * Bhagya has exactly one user identity. This menu never asks a customer to
 * "become a merchant": it offers *selling* as an additional capability on the
 * same account ("Start selling"), which is the product rule from the brief.
 * Phase 1 renders the signed-out state; Phase 2 swaps it for the session user.
 */
export function AccountMenu({
  user = null,
}: {
  user?: { name: string; email?: string; avatarUrl?: string | null } | null;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton
          label={user ? `Account menu for ${user.name}` : "Account"}
          variant="ghost"
          className="aria-expanded:bg-soft-green aria-expanded:text-primary"
        >
          {user ? (
            <Avatar name={user.name} src={user.avatarUrl} size="sm" />
          ) : (
            <UserRound aria-hidden="true" />
          )}
        </IconButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-64">
        {user ? (
          <>
            <DropdownMenuLabel className="flex items-center gap-3 py-2.5">
              <Avatar name={user.name} src={user.avatarUrl} size="md" />
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-body-sm font-semibold normal-case tracking-normal text-ink">
                  {user.name}
                </span>
                {user.email ? (
                  <span className="truncate text-caption normal-case tracking-normal text-ink-soft">
                    {user.email}
                  </span>
                ) : null}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={accountRoutes.root}>
                <UserRound aria-hidden="true" />
                Your account
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={accountRoutes.orders}>
                <Package aria-hidden="true" />
                Orders
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={accountRoutes.wishlist}>
                <Heart aria-hidden="true" />
                Wishlist
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={accountRoutes.addresses}>
                <MapPin aria-hidden="true" />
                Addresses
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={accountRoutes.preferences}>
                <Settings2 aria-hidden="true" />
                Preferences
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={merchantRoutes.root} className="justify-between">
                <span className="flex items-center gap-2.5">
                  <Store aria-hidden="true" />
                  Start selling
                </span>
                <Badge tone="botanical" size="sm">
                  New
                </Badge>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <LogOut aria-hidden="true" />
              Sign out
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuLabel>Account</DropdownMenuLabel>
            <div className="flex flex-col gap-2 px-1.5 pb-2 pt-1">
              <p className="text-caption normal-case tracking-normal text-ink-soft">
                Sign in to see orders, saved items and your addresses.
              </p>
              <Link
                href={authRoutes.login}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-sm bg-primary px-4 text-body-sm font-medium text-primary-foreground transition-colors duration-fast hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <LogIn className="size-4" aria-hidden="true" />
                Log in
              </Link>
              <Link
                href={authRoutes.register}
                className="inline-flex min-h-10 items-center justify-center rounded-sm border border-line-strong px-4 text-body-sm font-medium text-ink transition-colors duration-fast hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Create account
              </Link>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={accountRoutes.orders}>
                <Package aria-hidden="true" />
                Track an order
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={merchantRoutes.root}>
                <Store aria-hidden="true" />
                Sell on Bhagya
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
