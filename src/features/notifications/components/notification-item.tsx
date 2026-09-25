"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bell,
  Check,
  CreditCard,
  ExternalLink,
  Package,
  Trash2,
  Truck,
  UserRound,
} from "lucide-react";

import type { Notification, NotificationType } from "@/features/notifications/notification-types";
import { cn } from "@/lib/utils";

export interface NotificationItemProps {
  notification: Notification;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const typeIcons: Record<
  NotificationType,
  {
    icon: React.ComponentType<{ className?: string }>;
    colorClass: string;
  }
> = {
  order: {
    icon: Package,
    colorClass: "bg-gold-soft text-gold-dark dark:text-gold border-gold/30",
  },
  payment: {
    icon: CreditCard,
    colorClass: "bg-success-surface text-success border-success/20",
  },
  delivery: {
    icon: Truck,
    colorClass: "bg-gold-soft text-gold-dark dark:text-gold border-gold/30",
  },
  account: {
    icon: UserRound,
    colorClass: "bg-surface-raised text-ink-soft border-line",
  },
  system: {
    icon: Bell,
    colorClass: "bg-surface-raised text-ink-soft border-line",
  },
};

export function NotificationItem({
  notification,
  onMarkRead,
  onDelete,
}: NotificationItemProps) {
  const config = typeIcons[notification.type] || typeIcons.system;
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "group relative flex items-start gap-4 rounded-xl border p-4 sm:p-5 transition-all duration-fast",
        notification.read
          ? "border-line bg-surface hover:bg-surface-raised/40 text-ink-soft"
          : "border-gold/30 bg-gold-soft/10 dark:bg-gold/5 shadow-xs text-ink",
      )}
    >
      {/* Type Icon */}
      <div
        className={cn(
          "grid size-10 shrink-0 place-items-center rounded-xl border",
          config.colorClass,
        )}
      >
        <Icon className="size-4.5" aria-hidden="true" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h4
              className={cn(
                "text-body-sm font-semibold",
                notification.read ? "text-ink" : "text-ink font-bold",
              )}
            >
              {notification.title}
            </h4>
            {!notification.read && (
              <span
                className="size-2 rounded-full bg-gold inline-block"
                title="Unread notification"
              />
            )}
          </div>
          <time className="text-caption text-ink-faint whitespace-nowrap">
            {new Date(notification.createdAt).toLocaleDateString("en-IN", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </time>
        </div>

        <p className="text-body-sm text-ink-soft leading-relaxed">
          {notification.message}
        </p>

        {/* Action Link & Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          {notification.actionUrl ? (
            <Link
              href={notification.actionUrl as any}
              onClick={() => {
                if (!notification.read) onMarkRead(notification.id);
              }}
              className="inline-flex items-center gap-1 text-caption font-semibold text-gold-dark dark:text-gold hover:underline"
            >
              <span>View details</span>
              <ExternalLink className="size-3" />
            </Link>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            {!notification.read && (
              <button
                type="button"
                onClick={() => onMarkRead(notification.id)}
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-caption text-ink-soft hover:text-ink hover:bg-surface-raised transition-colors"
                title="Mark as read"
              >
                <Check className="size-3" />
                <span>Mark read</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onDelete(notification.id)}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-caption text-ink-soft hover:text-danger hover:bg-danger-surface transition-colors"
              title="Delete notification"
            >
              <Trash2 className="size-3" />
              <span className="sr-only">Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
