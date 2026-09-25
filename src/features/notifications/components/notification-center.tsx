"use client";

import * as React from "react";
import { Bell, CheckCheck, Inbox, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { NotificationItem } from "./notification-item";
import { NotificationPreferencesModal } from "./notification-preferences-modal";
import type { NotificationType } from "@/features/notifications/notification-types";
import { useNotifications } from "@/hooks/use-notifications";

const NOTIFICATION_TABS: { label: string; value: NotificationType | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Orders", value: "order" },
  { label: "Delivery", value: "delivery" },
  { label: "Payments", value: "payment" },
  { label: "Account", value: "account" },
];

export function NotificationCenter() {
  const {
    notifications,
    unreadCount,
    isLoading,
    filter,
    setFilter,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  const [showPreferences, setShowPreferences] = React.useState(false);

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
          {NOTIFICATION_TABS.map((tab) => {
            const isActive = filter === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setFilter(tab.value)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-body-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? "bg-gradient-btn-gold text-[#151515] font-bold shadow-xs"
                    : "bg-surface border border-line text-ink-soft hover:text-ink hover:bg-surface-raised"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => markAllAsRead()}
              className="gap-1.5"
            >
              <CheckCheck className="size-3.5" />
              <span>Mark all read</span>
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPreferences(true)}
            className="gap-1.5 text-ink-soft hover:text-ink"
          >
            <Settings className="size-3.5" />
            <span>Preferences</span>
          </Button>
        </div>
      </div>

      {/* Notifications List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 rounded-xl border border-line bg-surface animate-pulse"
            />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <Card variant="surface" padding="lg" radius="xl" className="border-line shadow-card text-center py-16">
          <CardContent className="space-y-4 max-w-md mx-auto">
            <div className="grid size-16 place-items-center rounded-2xl bg-gold-soft text-gold-dark dark:text-gold border border-gold/20 mx-auto">
              <Inbox className="size-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-heading-lg font-semibold text-ink">
                You&apos;re all caught up!
              </h3>
              <p className="text-body-sm text-ink-soft leading-relaxed">
                {filter !== "all"
                  ? `No ${filter} notifications at this time.`
                  : "Important updates regarding your orders, artisanal shipments, and payment status will appear here."}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <NotificationItem
              key={n.id}
              notification={n}
              onMarkRead={markAsRead}
              onDelete={deleteNotification}
            />
          ))}
        </div>
      )}

      {/* Preferences Modal */}
      <NotificationPreferencesModal
        isOpen={showPreferences}
        onClose={() => setShowPreferences(false)}
      />
    </div>
  );
}
