"use client";

import * as React from "react";
import type { Notification, NotificationType } from "@/features/notifications/notification-types";
import { notificationService } from "@/services/notification.service";

export interface NotificationContextValue {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  filter: NotificationType | "all";
  setFilter: (filter: NotificationType | "all") => void;
  refresh: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
}

const NotificationContext = React.createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [filter, setFilter] = React.useState<NotificationType | "all">("all");
  const [isLoading, setIsLoading] = React.useState(true);

  const refresh = React.useCallback(async () => {
    try {
      const items = await notificationService.getNotifications(filter);
      setNotifications(items);
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  const unreadCount = React.useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  const markAsRead = React.useCallback(async (id: string) => {
    await notificationService.markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }, []);

  const markAllAsRead = React.useCallback(async () => {
    await notificationService.markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const deleteNotification = React.useCallback(async (id: string) => {
    await notificationService.deleteNotification(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const value = React.useMemo(
    () => ({
      notifications,
      unreadCount,
      isLoading,
      filter,
      setFilter,
      refresh,
      markAsRead,
      markAllAsRead,
      deleteNotification,
    }),
    [
      notifications,
      unreadCount,
      isLoading,
      filter,
      refresh,
      markAsRead,
      markAllAsRead,
      deleteNotification,
    ],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications(): NotificationContextValue {
  const context = React.useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
