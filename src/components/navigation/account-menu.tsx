"use client";

import {
  Bell,
  Heart,
  LayoutDashboard,
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
import { useAuth } from "@/context/auth-context";
import { useNotifications } from "@/hooks/use-notifications";
import type { User } from "@/types/auth";

export interface AccountMenuProps {
  user?: User | null;
}

export function AccountMenu({ user: propUser }: AccountMenuProps) {
  const { user: ctxUser, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const user = propUser !== undefined ? propUser : ctxUser;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton
          label={user ? `Account menu for ${user.name}` : "Account"}
          variant="ghost"
          className="text-zinc-300 hover:text-white hover:bg-white/10 aria-expanded:bg-white/10 aria-expanded:text-gold"
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
              <Link href={"/notifications" as any} className="justify-between">
                <span className="flex items-center gap-2">
                  <Bell aria-hidden="true" />
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-gold text-[#151515] text-[10px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
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
            {user.organizationMembership?.storeId ? (
              <>
                <DropdownMenuItem asChild>
                  <Link href={merchantRoutes.dashboard} className="justify-between">
                    <span className="flex items-center gap-2.5">
                      <Store aria-hidden="true" className="text-[#C49A45]" />
                      <span className="font-medium text-ink">
                        {user.organizationMembership.storeName || "My Store"}
                      </span>
                    </span>
                    <Badge tone="gold" size="sm">
                      Merchant
                    </Badge>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={merchantRoutes.dashboard}>
                    <LayoutDashboard aria-hidden="true" />
                    Merchant Workspace
                  </Link>
                </DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem asChild>
                <Link href={"/start-selling" as any} className="justify-between">
                  <span className="flex items-center gap-2.5">
                    <Store aria-hidden="true" className="text-[#C49A45]" />
                    Start selling
                  </span>
                  <Badge tone="outline" size="sm">
                    Open Store
                  </Badge>
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => logout()}
              className="cursor-pointer"
            >
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
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-gradient-btn-gold px-4 text-body-sm font-bold text-[#151515] shadow-sm shadow-primary/20 transition-all duration-fast hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <LogIn className="size-4" aria-hidden="true" />
                Log in
              </Link>
              <Link
                href={authRoutes.register}
                className="inline-flex min-h-10 items-center justify-center rounded-xl border border-line bg-surface px-4 text-body-sm font-semibold text-ink transition-all duration-fast hover:border-primary hover:bg-gold-soft/20 dark:hover:bg-gold/10 hover:text-gold-dark dark:hover:text-gold hover:shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2"
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
